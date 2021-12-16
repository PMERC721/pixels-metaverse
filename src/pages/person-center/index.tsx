import React, { useEffect } from "react"
import { filter, isEmpty } from "lodash";
import { useLocation } from "react-router";
import { useUserInfo } from "../../components/UserProvider";
import { PixelsMetaverseHandleImgProvider, useGetPositionStr, usePixelsMetaverse, usePixelsMetaverseUserInfo } from "../../pixels-metaverse";
import { BaseInfo } from "./components/BaseInfo";
import { AssetsInfo } from "./components/AssetsInfo";
import { useWeb3Info } from "../../hook/web3";
import { useLoading } from "../../components/Loading";
import { NoConnect } from "../../components/NoConnect";

export const PersonCenter = () => {
  const { address: addresss } = useWeb3Info()
  const { goodsList, userInfo } = useUserInfo()
  const { search } = useLocation()
  const address = search ? search.split("=")[1] : addresss
  const { closeDelayLoading, openLoading, closeLoading } = useLoading()

  const { noOutfitEdList, outfitEdList } = React.useMemo(() => {
    if (isEmpty(goodsList)) return {
      outfitEdList: [],
      noOutfitEdList: [],
    }
    return {
      outfitEdList: filter(goodsList, item => !item?.isSale && item?.isOutfit && item?.owner === address),
      noOutfitEdList: filter(goodsList, item => !item?.isSale && !item?.isOutfit && item?.owner === address)
    }
  }, [goodsList, address])

  const positions = useGetPositionStr(outfitEdList)

  const getUserInfo = usePixelsMetaverseUserInfo({
    onRequestBefore: () => {
      console.log("请求数据了")
      openLoading()
    },
    onSuccess: (arg) => {
      console.log(arg, "请求数据成功")
      closeDelayLoading()
    },
    onFail: (arg) => {
      console.log(arg, "请求数据失败")
    }
  })

  useEffect(() => {
    if (!address) return
    getUserInfo(address)
  }, [address])

  return (
    !isEmpty(userInfo) && positions ? <PixelsMetaverseHandleImgProvider size={240} showGrid={userInfo?.withGrid} data={{
      positions: positions,
      size: 'large',
      bgColor: userInfo?.bgColor,
      gridColor: userInfo?.gridColor,
    }}>
      <div className="p-8 pt-20 h-screen">
        <div className="flex justify-between p-8 m-auto rounded-md text-opacity-80 text-white bg-white bg-opacity-5 h-full">
          <BaseInfo />
          <AssetsInfo outfitEdList={outfitEdList} noOutfitEdList={noOutfitEdList} />
        </div>
      </div>
    </PixelsMetaverseHandleImgProvider> : <NoConnect />
  )
}
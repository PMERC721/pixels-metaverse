import React, { useEffect, useMemo } from "react"
import { Dictionary, filter, isEmpty, map } from "lodash";
import { useLocation } from "react-router";
import { useUserInfo } from "../../components/UserProvider";
import { PixelsMetaverseHandleImgProvider, useConvertedPostion, useGetPositionStr, usePixelsMetaverse, usePixelsMetaverseUserInfo } from "../../pixels-metaverse";
import { BaseInfo } from "./components/BaseInfo";
import { AssetsInfo } from "./components/AssetsInfo";
import { useWeb3Info } from "../../hook/web3";
import { useLoading } from "../../components/Loading";
import { message } from "antd";
import { useGetPersonData } from "../play";

export const PersonCenter = () => {
  const { address: addresss, networkId } = useWeb3Info()
  const { goodsList, userInfo } = useUserInfo()
  const { search } = useLocation()
  const address = search ? search.split("=")[1] : addresss
  const { closeDelayLoading, openLoading, closeLoading } = useLoading()
  const convertedPostion = useConvertedPostion()
  const { noCollectionList, avater, colectionList, onwerList } = useGetPersonData()

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

  const positions = useMemo(() => {
    if (isEmpty(onwerList)) return "empty"
    let data: Dictionary<any> = {}
    map(onwerList, item => {
      const positionsData = convertedPostion({
        positions: item?.baseInfo?.data
      })
      data = { ...data, ...positionsData }
    })

    const colors: Dictionary<number[]> = {}
    for (let i in data) {
      colors[data[i]] ? colors[data[i]].push(Number(i)) : colors[data[i]] = [Number(i)]
    }

    let str = ""
    let min = 1
    for (let i in colors) {
      const position = map(colors[i], ite => (ite - min).toString(36)).join("|")
      str += `${parseInt(i.slice(1), 16).toString(36)}-${position}-`
    }
    return `${str}${min}`
  }, [onwerList])

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
      message.error({
        content: arg?.message,
        style: {
          width: 500,
          margin: "auto"
        }
      })
      closeDelayLoading()
    }
  })

  useEffect(() => {
    if (!address || !networkId) return
    getUserInfo(address)
    console.log("networkId", networkId)
  }, [address, networkId])

  return (
    <>{positions && <PixelsMetaverseHandleImgProvider size={240} showGrid={userInfo?.withGrid} data={{
      positions: positions,
      size: 'large',
      bgColor: userInfo?.bgColor,
      gridColor: userInfo?.gridColor,
    }}>
      <div className="p-8 pt-20 h-screen">
        <div className="flex justify-between p-8 m-auto rounded-md text-opacity-80 text-white bg-white bg-opacity-5 h-full">
          <BaseInfo />
          <AssetsInfo outfitEdList={onwerList} noOutfitEdList={colectionList} />
        </div>
      </div>
    </PixelsMetaverseHandleImgProvider>}
    </>
  )
}
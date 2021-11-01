import React from "react"
import { filter, isEmpty } from "lodash";
import { useLocation } from "react-router";
import { useUserInfo } from "../../components/UserProvider";
import { PixelsMetaverseHandleImgProvider, usePixelsMetaverseContract, useGetPositionStr } from "../../pixels-metaverse";
import { BaseInfo } from "./components/BaseInfo";
import { AssetsInfo } from "./components/AssetsInfo";

export const PersonCenter = () => {
  const { accounts } = usePixelsMetaverseContract()
  const { goodsList, userInfo } = useUserInfo()
  const { search } = useLocation()
  const address = search ? search.split("=")[1] : accounts.address

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
    </PixelsMetaverseHandleImgProvider> : <div className="flex justify-center item-center text-white pt-60">请链接钱包</div>
  )
}
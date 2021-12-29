import { PersonCenter } from "./components/PersonCenter";
import { Avatar } from "./components/Avatar";
import { Collections } from "./components/Collections";
import { Dictionary, filter, isEmpty, map } from "lodash";
import React, { useMemo } from "react";
import { useUserInfo } from "../../components/UserProvider";
import { useLocation, useParams } from "react-router-dom";
import {
  PixelsMetaverseHandleImgProvider,
  useConvertedPostion
} from "../../pixels-metaverse";
import { useWeb3Info } from "../../hook/web3";
import { MaterialItem } from "../../components/Card";

export const PixelsMetaverse = () => {
  const { address: addresss } = useWeb3Info()
  const { search } = useLocation()
  const address = search ? search.split("=")[1] : addresss
  const { goodsList, userInfo, goodsId, collectList } = useUserInfo()
  const convertedPostion = useConvertedPostion()
  const a = useParams()

  const { noCollectionList, avater, colectionList, onwerList } = useMemo(() => {
    const noCollectionList: MaterialItem[] = [], colectionList: MaterialItem[] = [], onwerList: MaterialItem[] = [];
    let avater: MaterialItem | undefined;
    map(goodsList, (item: MaterialItem) => {
      const isCollect = collectList?.includes(item?.material?.id);
      const isCurAddress = address === item?.material?.owner
      if (item?.material?.id === userInfo?.avater) {
        avater = item;
      } else if (isCollect) {
        colectionList.push(item);
      } else if (isCurAddress) {
        onwerList.push(item)
      } else {
        noCollectionList.push(item);
      }
    })
    return { noCollectionList, avater, colectionList, onwerList }
  }, [goodsList, collectList, userInfo])

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

  return (
    <PixelsMetaverseHandleImgProvider
      size={480}
      showGrid={userInfo?.withGrid}
      data={{
        positions: positions,
        size: 'large',
        bgColor: userInfo?.bgColor,
        gridColor: userInfo?.gridColor,
      }}
    >
      <div className="flex justify-between bg-transparent flex-1 pt-20">
        <PersonCenter avater={avater} colectionList={colectionList} onwerList={onwerList} />
        <Avatar />
        <Collections noCollectionList={noCollectionList} />
      </div>
    </PixelsMetaverseHandleImgProvider>
  )
}
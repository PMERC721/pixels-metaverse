import { PersonCenter } from "./components/PersonCenter";
import { Avatar } from "./components/Avatar";
import { Collection } from "./components/Collection";
import { Dictionary, filter, isEmpty, map } from "lodash";
import { useMemo } from "react";
import { useUserInfo } from "../../components/UserProvider";
import { useLocation, useParams } from "react-router-dom";
import {
  PixelsMetaverseHandleImgProvider,
  useConvertedPostion,
  usePixelsMetaverse
} from "../../pixels-metaverse";

export const PixelsMetaverse = () => {
  const { accounts } = usePixelsMetaverse()
  const { search } = useLocation()
  const address = search ? search.split("=")[1] : accounts?.address
  const { goodsList, userInfo, goodsId } = useUserInfo()
  const convertedPostion = useConvertedPostion()
  const a = useParams()
  //console.log(a)

  /* 
  
    const set = useRequest(fetchSetPMT721, {
      onSuccess: () => {
        message.success("设置成功！")
      }
    }, [address])
    useEffect(() => {
      set()
    }, []) */

  const { noOutfitEdList, outfitEdList } = useMemo(() => {
    if (isEmpty(goodsList)) return {
      outfitEdList: [],
      noOutfitEdList: [],
    }
    return {
      outfitEdList: filter(goodsList, item => !item?.isSale && item?.isOutfit && item?.owner === address),
      noOutfitEdList: filter(goodsList, item => !item?.isSale && !item?.isOutfit && item?.owner === address)
    }
  }, [goodsList, address, goodsId])

  const positions = useMemo(() => {
    if (isEmpty(outfitEdList)) return "empty"
    let data: Dictionary<any> = {}
    map(outfitEdList, item => {
      const positionsData = convertedPostion({
        positions: item?.data
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
  }, [outfitEdList])

  if (isEmpty(userInfo)) {
    return <div className="flex justify-center item-center text-white pt-60">请链接钱包</div>
  }

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
        <PersonCenter outfitEdList={outfitEdList} noOutfitEdList={noOutfitEdList} />
        <Avatar />
        <Collection />
      </div>
    </PixelsMetaverseHandleImgProvider>
  )
}
import React, { useMemo } from "react"
import { Dictionary, isEmpty, map } from "lodash";
import { useUserInfo } from "../../components/UserProvider";
import { PixelsMetaverseHandleImgProvider, useConvertedPostion } from "../../pixels-metaverse";
import { BaseInfo } from "./components/BaseInfo";
import { AssetsInfo } from "./components/AssetsInfo";
import { useGetPersonData } from "../play";

export const PersonCenter = () => {
  const { userInfo } = useUserInfo()
  const convertedPostion = useConvertedPostion()
  const { avater } = useGetPersonData()

  const avaterData = useMemo(() => {
    avater?.composeData?.push(avater)
    return avater
  }, [avater?.composeData])

  const positions = React.useMemo(() => {
    if (isEmpty(avaterData?.composeData)) return "empty"
    let data: Dictionary<any> = {}
    map(avaterData?.composeData, item => {
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
  }, [avaterData?.composeData])

  return (
    <>{positions && <PixelsMetaverseHandleImgProvider
      size={240}
      showGrid={userInfo?.withGrid}
      data={{
        positions: positions,
        size: 'large',
        bgColor: userInfo?.bgColor,
        gridColor: userInfo?.gridColor,
      }}>
      <div className="p-8 pt-20 h-screen">
        <div className="flex justify-between p-8 m-auto rounded-md text-opacity-80 text-white bg-white bg-opacity-5 h-full">
          <BaseInfo />
          <AssetsInfo />
        </div>
      </div>
    </PixelsMetaverseHandleImgProvider>}
    </>
  )
}
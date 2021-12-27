import { cloneDeep, find } from "lodash";
import { message } from "antd";
import { useUserInfo } from "../../../components/UserProvider";
import { fetchCollect, useRequest } from "../../../hook/api";
import { categoryData } from "../../produced/components/Submit";
import { useHistory } from "react-router";
import { PixelsMetaverseImgByPositionData, PixelsMetaverseImgByPositionData2 } from "../../../pixels-metaverse";
import React, { useMemo } from "react";
import { ellipseAddress } from "../../../helpers/utilities";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { useWeb3Info } from "../../../hook/web3";

export const GoodsCard = ({ item, i, setComposeList }: { item: any, i: number, setComposeList?: React.Dispatch<React.SetStateAction<number[]>> }) => {
  const { setGoodsList } = useUserInfo()
  const { address } = useWeb3Info()

  const collect = useRequest(fetchCollect, {
    onSuccess: () => {
      message.success("收藏成功！")
    }
  }, [])
  const history = useHistory()
  const { userInfo } = useUserInfo()

  const data = useMemo(()=>{
    return {
      ...item,
      data: item?.baseInfo?.data
    }
  }, [item])

  return (
    <div
      key={item?.id}
      className="p-2 mb-4 flex-col flex rounded-md bg-white bg-opacity-10" style={{
        height: 216 + 100,
        width: 216,
        marginRight: i % 5 === 4 ? 0 : 17
      }}>
      <PixelsMetaverseImgByPositionData data={{ ...item, positions: item?.baseInfo?.data, goodsData: [data] }} size={200} style={{ borderRadius: 4, background: item?.bgColor || userInfo?.user?.bgColor || "#e1e1e11a", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)" }} />
      {/* <PixelsMetaverseImgByPositionData2 data={item} size={["50%", "50%"]} style={{ borderRadius: 4, background: item?.bgColor || userInfo?.user?.bgColor || "#e1e1e11a", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)" }} /> */}
      <div className="flex flex-col justify-between flex-1 mt-4" style={{ fontSize: 12, width: 200 }}>
        <div className="text-right flex-1" style={{ height: 40, textOverflow: "ellipsis", overflow: "hidden" }}>{item?.baseInfo?.name || "卡姿兰大眼睛，你值得拥有,还在等什么，快点装备我吧"}</div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex justify-between items-center">
            <div className="p px-2 rounded-sm mr-2 bg-white bg-opacity-10">ID: {item?.material?.id}</div>
            <div className="p px-2 rounded-sm bg-white bg-opacity-10">{(find(categoryData, ite => ite?.value === item?.baseInfo?.category) || {})?.label}</div>
          </div>
          <Checkbox disabled={address !== item?.material?.owner || Number(item?.material?.compose) !== 0} onChange={(checked) => {
            setComposeList && setComposeList((pre: number[])=>{
              const list = cloneDeep(pre)
              if(checked?.target?.checked){
                list?.push(item?.material?.id)
              }else{
                list?.splice(list.indexOf(item?.material?.id), 1)
              }
              return list
            })
          }} />
        </div>
        <div className="flex justify-between items-center mt-2">
          {item?.material?.owner && <div className="p rounded-sm overflow-x-scroll hover:text-red-500 cursor-pointer"
            style={{ height: 20, width: 120, textOverflow: "ellipsis", overflow: "hidden" }}
            onClick={() => {
              history.push(`/person-center?address=${item?.material?.owner}`)
            }}
          >{ellipseAddress(item?.material?.owner, 8)}</div>}
          <button className="p px-2 bg-red-500 rounded-sm" style={{ background: item?.isSale ? "rgba(239, 68, 68)" : "rgba(225,225,225, 0.1)", width: 60 }} onClick={() => {
            if (userInfo?.account?.includes("0000000000000000000000000")) {
              message.warning("你还不是平台用户，请激活自己的账户！")
              return
            }
            collect({
              id: Number(item?.material?.id),
              setGoodsList
            })
          }}
            disabled={item?.isSale}>{!item?.isSale ? "收藏" : "已收藏"}</button>
        </div>
      </div>
    </div>
  )
}
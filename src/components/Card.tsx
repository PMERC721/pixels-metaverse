import { Checkbox, message, Modal, Tooltip } from "antd";
import { cloneDeep, divide } from "lodash";
import React, { ReactNode, useCallback, useState } from "react";
import { useUserInfo } from "../components/UserProvider";
import { fetchCollect, useRequest } from "../hook/api";
import { useWeb3Info } from "../hook/web3";

export interface IMaterial {
  id: string;
  compose: string;
  time: string;
  position: string;
  zIndex: string;
  owner: string;
  data: string;
}

export interface IBaseInfo {
  data: string;
  category: string;
  decode: string;
  name: string;
  userId: string;
}

export interface MaterialItem {
  composes: string[];
  material: IMaterial;
  baseInfo: IBaseInfo;
  composeData: MaterialItem[]
}

export const MaterialLabel = ({
  children,
  toRight,
  toDetails,
  ...props
}: {
  children: ReactNode,
  toRight?: boolean,
  toDetails?: boolean
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const handleOk = useCallback(() => {
    setIsModalVisible(false)
  }, []);

  if (!children) return null

  return (
    <>
      <Tooltip className="cursor-pointer text-sm" color="#29303d" title={toDetails ? `点击可查看详情` : ""}>
        <div
          className={`p px-2 rounded-sm bg-white bg-opacity-10`}
          style={{ marginRight: toRight ? 0 : 10, marginLeft: toRight ? 10 : 0, cursor: toDetails ? "pointer" : "default" }}
          onClick={() => {
            if (toDetails) {
              console.log(children, "children")
              setIsModalVisible(true)
            }
          }}
          {...props}>{children}</div>
      </Tooltip>
      {toDetails && <Modal
        title="是否发布物品"
        okText={"确认"}
        cancelText="取消"
        visible={isModalVisible}
        maskClosable={false}
        onOk={handleOk}
        onCancel={() => { setIsModalVisible(false) }}
      >
        <p>是否确认发布该物品？</p>
        <p>{"当前数据量较大，可能消耗的GAS较多，且有可能提交不成功，请问是否继续提交数据？"}</p>
      </Modal> }
    </>
  )
}

export const Collection = ({ item }: { item: MaterialItem }) => {
  const { setGoodsList, collectList, userInfo } = useUserInfo()
  const { address } = useWeb3Info()

  const collect = useRequest(fetchCollect, {
    onSuccess: () => {
      message.success("收藏成功！")
    }
  }, [])

  return (
    <>
      {address !== item?.material?.owner ? <button className="p px-2 bg-red-500 rounded-sm"
        style={{
          background: !collectList?.includes(item?.material?.id) ? "rgba(239, 68, 68)" : "rgba(225,225,225, 0.1)",
          cursor: !collectList?.includes(item?.material?.id) ? "pointer" : "no-drop",
          width: 60
        }} onClick={() => {
          if (Number(userInfo?.id) < 1) {
            message.warning("你还不是平台用户，请激活自己的账户！")
            return
          }
          collect({
            id: Number(item?.material?.id),
            setGoodsList
          })
        }}
        disabled={collectList?.includes(item?.material?.id)}>{collectList?.includes(item?.material?.id) ? "已收藏" : "收藏"}</button>:<div>当前账户</div>}
    </>
  )
}

export const Composes = ({
  item
}: {
  item: MaterialItem,
}) => {
  const { address } = useWeb3Info()
  const { composeList, setComposeList } = useUserInfo()

  return (
    <>
      {Number(item?.material?.compose) === 0
        ? (address === item?.material?.owner ? <Checkbox
          checked={composeList.includes(item?.material?.id)}
          onChange={(checked) => {
            setComposeList && setComposeList((pre: string[]) => {
              const list = cloneDeep(pre)
              if (checked?.target?.checked) {
                list?.push(item?.material?.id)
              } else {
                list?.splice(list.indexOf(item?.material?.id), 1)
              }
              return list
            })
          }} /> : <div>非当前账户</div>)
        : <div>已合成至{item?.material?.compose}</div>
      }
    </>
  )
}
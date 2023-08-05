import { CopyOutlined, SmileOutlined } from "@ant-design/icons";
import { Checkbox, message, Modal, Tooltip, Tree, Typography } from "antd";
import { DataNode } from "antd/lib/tree";
import { cloneDeep, find, isEmpty, map } from "lodash";
import React, { Dispatch, ReactNode, useEffect, useMemo, useState } from "react";
import { useUserInfo } from "../components/UserProvider";
import { useRequest, useWeb3Info } from "abi-to-request";
import { categoryData } from "../pages/produced/components/Submit";
import { PixelsMetaverseImgByPositionData } from "../pixels-metaverse";
import {
  setAvater,
  subtract
} from "../client/PixelsMetaverse";
import { useLoading } from "./Loading";
const { Text } = Typography;

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
  userId?: string;
}

export interface MaterialItem {
  composes: string[];
  material: IMaterial;
  baseInfo: IBaseInfo;
  composeData: MaterialItem[]
}

export const CancelCompose = ({ item, setIsModalVisible }: { item: MaterialItem, setIsModalVisible?: Dispatch<React.SetStateAction<boolean>> }) => {
  const { composeList, setSmallLoading } = useUserInfo()

  const [cancelCompose] = useRequest(subtract, {
    isGlobalTransactionHookValid: true,
    onSuccess: () => {
      setSmallLoading(true);
      setIsModalVisible && setIsModalVisible(false)
    },
    onTransactionSuccess: () => {
      message.success("分解成功！正在获取链上新数据...")
    }
  }, [composeList, item])

  return (<span className="inline-block bg-red-500 text-white ml-4 px-2 rounded-sm cursor-pointer" onClick={() => { cancelCompose({ ids: item?.material?.id, idList: [] }) }}>
    分解
  </span>)
}

export const RemoveCompose = ({ item, setIsModalVisible }: { item: MaterialItem, setIsModalVisible?: Dispatch<React.SetStateAction<boolean>> }) => {
  const { materialListObj, setSmallLoading } = useUserInfo()

  const [substract] = useRequest(subtract, {
    isGlobalTransactionHookValid: true,
    onSuccess: () => {
      setIsModalVisible && setIsModalVisible(false)
      setSmallLoading(true);
    },
    onTransactionSuccess: () => {
      message.success("移除成功！正在获取链上新数据...")
    }
  }, [item])
  const from = useMemo(() => materialListObj[item?.material?.compose], [materialListObj, item])
  const isShow = useMemo(() => from?.material?.compose === "0", [from, item])

  return (isShow ? <span className="inline-block bg-red-500 text-white ml-4 px-2 rounded-sm cursor-pointer" onClick={() => { substract({ ids: from?.material?.id, idList: [item?.material?.id] }) }}>
    移除该物品
  </span> : null)
}

export const SetAvater = ({ item }: { item: MaterialItem }) => {
  const { openLoading, closeDelayLoading } = useLoading()
  const { address } = useWeb3Info()
  const { composeList, setComposeList, materialListObj, userInfo, setSmallLoading } = useUserInfo()

  const [setAvaterFun] = useRequest(setAvater, {
    isGlobalTransactionHookValid: true,
    onSuccess: () => {
      setSmallLoading(true);
    },
    onTransactionSuccess: () => {
      message.success("头像设置成功！正在获取链上新数据...")
    }
  })

  if (address?.toLowerCase() === item?.material?.owner?.toLowerCase() && String(userInfo?.id) !== item?.material?.id) {
    return (<span className="inline-block bg-red-500 text-white ml-4 px-2 rounded-sm cursor-pointer" onClick={() => { setAvaterFun({ id: item?.material?.id }) }}>
      设置为头像
    </span>)
  } else {
    return null
  }
}

export const DetailsBody = ({ item, child, setIsModalVisible }: { item: MaterialItem, child?: boolean, setIsModalVisible?: Dispatch<React.SetStateAction<boolean>> }) => {
  const { materialListObj, userInfo } = useUserInfo()
  const { address } = useWeb3Info()
  const data = useMemo(() => {
    if (isEmpty(item) || isEmpty(materialListObj)) return []
    if (isEmpty(item?.composes)) return [({ ...item, data: item?.baseInfo?.data } as any)]
    return map(item?.composeData, it => ({ ...it, data: it?.baseInfo?.data } as any))
  }, [item, materialListObj])

  return (
    <div className="flex">
      <PixelsMetaverseImgByPositionData
        data={{ ...item, positions: item?.baseInfo?.data, materialData: data }}
        size={200}
        style={{ background: "#323945", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)" }} />
      <div className="ml-10 flex flex-col justify-between">
        <div>物品名称：{item?.baseInfo?.name || "这什么鬼名称"}<SetAvater item={item} /></div>
        <div className="flex">组成部分：<div className="overflow-x-scroll" style={{ maxWidth: !child ? 800 : 400 }}>{item?.composes?.join(",") || "暂无"}{/* {!isEmpty(item?.composes) && Number(item?.material?.compose) === 0 && <CancelCompose item={item} setIsModalVisible={setIsModalVisible} />} */}</div></div>
        <div className="relative">所属地址：<Text copyable={{
          text: item?.material?.owner,
          icon: [<CopyOutlined className="absolute top-1" />, <SmileOutlined className="absolute top-1" />],
          tooltips: false
        }}>
          {item?.material?.owner}
        </Text></div>
        <div>所属ID：{Number(item?.material?.compose) > 0 ? <>{item?.material?.compose}<RemoveCompose item={item} setIsModalVisible={setIsModalVisible} /></> : "暂未被合成"}</div>
        {/* <div className="flex">是否收藏：{isCollect ? "是" : `否`} {!isCollect && <div className="ml-8 flex w-90" style={{ color: !isCollect && item?.material?.owner === address ? "rgba(0,0,0,0.7)" : "white" }}><Collection item={item} /></div>}</div> */}
      </div>
    </div>
  )
}

export const MaterialTreeData = ({ item }: { item: MaterialItem }) => {
  const { materialListObj } = useUserInfo()
  const [select, setSelect] = useState<MaterialItem>()
  const [treeData, setTreeData] = useState<DataNode[]>();

  useEffect(() => {
    if (isEmpty(item) || isEmpty(materialListObj)) return
    const nodeData: DataNode[] = [];
    const fun = (item: MaterialItem, node: DataNode[]) => {
      if (item?.composes?.length === 0) return
      map(item?.composes, (ite: string) => {
        if (materialListObj[ite] && materialListObj[ite]?.material?.compose === item?.material?.id) {
          node?.push({
            key: ite,
            title: ite,
            children: []
          })
          const childNode = find(node, it => it.key === ite)?.children;
          childNode && fun(materialListObj[ite], childNode);
        }
      })
    }
    fun(item, nodeData)
    nodeData[0]?.key && setSelect(materialListObj[nodeData[0]?.key]);
    setTreeData(nodeData)
  }, [item, materialListObj])

  const onSelect = (selectedKeys: React.Key[]) => {
    !isEmpty(selectedKeys) && setSelect(materialListObj[selectedKeys[0]])
  };

  return (
    <div className="flex justify-between" style={{ height: 300, minWidth: 1200 }}>
      {treeData && treeData[0] && <Tree
        className="flex-1"
        height={300}
        showLine={true}
        defaultExpandedKeys={[treeData[0]?.key]}
        onSelect={onSelect}
        treeData={treeData}
      />}
      {!isEmpty(treeData) && select && <div className="border-l border-black border-opacity-10 p-4" style={{ width: 800, minWidth: 800 }}>
        <DetailsBody item={select} child />
      </div>}
    </div>
  );
}

export const Details = ({ id, setIsModalVisible }: { id: string, setIsModalVisible: Dispatch<React.SetStateAction<boolean>> }) => {
  const { materialListObj } = useUserInfo()
  const item = useMemo(() => materialListObj[id], [materialListObj, id])

  return (
    <div className="text-black text-opacity-70">
      <p className="text-xl">ID:{id} 详情</p>
      <DetailsBody item={item} setIsModalVisible={setIsModalVisible} />
      {!isEmpty(item?.composes) && <div className="pt-4 mt-8 border-t border-black border-opacity-70 border-dashed">
        <MaterialTreeData item={item} />
      </div>}
    </div>
  )
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

  if (!children) return null

  return (
    <>
      <Tooltip className="cursor-pointer text-sm" color="#29303d" title={toDetails ? `点击可查看详情` : ""}>
        <div
          className={`p px-2 rounded-sm bg-white bg-opacity-10 text-white text-opacity-90`}
          style={{ marginRight: toRight ? 0 : 10, marginLeft: toRight ? 10 : 0, cursor: toDetails ? "pointer" : "default" }}
          onClick={() => {
            toDetails && setIsModalVisible(true)
          }}
          {...props}>{children}</div>
      </Tooltip>
      {toDetails && <Modal
        title=""
        width={1200}
        visible={isModalVisible}
        footer={null}
        onCancel={() => { setIsModalVisible(false) }}
      >
        <Details id={String(children)} setIsModalVisible={setIsModalVisible} />
      </Modal>}
    </>
  )
}

/* export const Collection = ({ item }: { item: MaterialItem }) => {
  const { collectList } = useUserInfo()
  const { address } = useWeb3Info()

  const [collect] = useRequest(PixelsMetaverse_Collect, {
    isGlobalTransactionHookValid: true,
    onTransactionSuccess: () => {
      message.success("收藏成功！")
    }
  }, [])

  const [cancelCollect] = useRequest(PixelsMetaverse_CancelCollect, {
    isGlobalTransactionHookValid: true,
    onTransactionSuccess: () => {
      message.success("已取消收藏！")
    }
  }, [])

  const index = useMemo(() => collectList?.indexOf(item?.material?.id), [collectList, item, address])

  return (
    <>
      {address?.toLowerCase() !== item?.material?.owner?.toLowerCase() ? <button
        className="p px-2 bg-red-500 rounded-sm " onClick={() => {
          if (index !== undefined && index >= 0) cancelCollect({ id: Number(item?.material?.id), index })
          else collect({ id: Number(item?.material?.id) })
        }}
      >{index !== undefined && index >= 0 ? "取消收藏" : "收藏"}</button> : <div>当前账户</div>}
    </>
  )
} */

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
        ? (address?.toLowerCase() === item?.material?.owner?.toLowerCase() ? <Checkbox
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
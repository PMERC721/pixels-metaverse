import { CarryOutOutlined, CopyOutlined, SmileOutlined } from "@ant-design/icons";
import { Checkbox, message, Modal, Tooltip, Tree, Typography } from "antd";
import { DataNode } from "antd/lib/tree";
import { cloneDeep, find, isEmpty, map } from "lodash";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useUserInfo } from "../components/UserProvider";
import { fetchCollect, useRequest } from "../hook/api";
import { useWeb3Info } from "../hook/web3";
import { categoryData } from "../pages/produced/components/Submit";
import { PixelsMetaverseImgByPositionData } from "../pixels-metaverse";
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
  userId: string;
}

export interface MaterialItem {
  composes: string[];
  material: IMaterial;
  baseInfo: IBaseInfo;
  composeData: MaterialItem[]
}

export const DetailsBody = ({ item, child }: { item: MaterialItem, child?: boolean }) => {
  const { collectList, goodsListObj } = useUserInfo()
  const { address } = useWeb3Info()
  const data = useMemo(() => {
    if (isEmpty(item) || isEmpty(goodsListObj)) return []
    if (isEmpty(item?.composes)) return [({ ...item, data: item?.baseInfo?.data } as any)]
    return map(item?.composeData, it => ({ ...it, data: it?.baseInfo?.data } as any))
  }, [item, goodsListObj])

  const isCollect = useMemo(() => collectList?.includes(item?.material?.id), [collectList, item])

  return (
    <div className="flex">
      <PixelsMetaverseImgByPositionData
        data={{ ...item, positions: item?.baseInfo?.data, goodsData: data }}
        size={200}
        style={{ background: "#323945", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)" }} />
      <div className="ml-10 flex flex-col justify-between">
        <div>物品名称：{item?.baseInfo?.name || "这什么鬼名称"}</div>
        <div>物品类别：{(find(categoryData, ite => ite?.value === item?.baseInfo?.category) || {})?.label || "这什么鬼类别"}</div>
        <div className="flex">组成部分：<div className="overflow-x-scroll" style={{ maxWidth: !child ? 800 : 400 }}>{map(item?.composeData, ite => ite?.material?.id)?.join(",") || "暂无"}</div></div>
        <div className="relative">所属地址：<Text copyable={{
          text: item?.material?.owner,
          icon: [<CopyOutlined className="absolute top-1" />, <SmileOutlined className="absolute top-1" />],
          tooltips: false
        }}>
          {item?.material?.owner}
        </Text></div>
        <div>所属ID：{Number(item?.material?.compose) > 0 ? item?.material?.compose : "暂无"}</div>
        <div className="flex">是否收藏：{isCollect ? "是" : `否`} {!isCollect && <div className="ml-8 flex w-90" style={{ color: !isCollect && item?.material?.owner === address ? "rgba(0,0,0,0.7)" : "white" }}><Collection item={item} /></div>}</div>
      </div>
    </div>
  )
}

export const MaterialTreeData = ({ item }: { item: MaterialItem }) => {
  const { goodsListObj } = useUserInfo()
  const [select, setSelect] = useState<MaterialItem>()
  const [treeData, setTreeData] = useState<DataNode[]>();

  useEffect(() => {
    if (isEmpty(item) || isEmpty(goodsListObj)) return
    const nodeData: DataNode[] = [];
    const fun = (item: MaterialItem, node: DataNode[]) => {
      if (item?.composes?.length === 0) return
      map(item?.composes, (ite: string) => {
        if (goodsListObj[ite]) {
          node?.push({
            key: ite,
            title: ite,
            icon: <CarryOutOutlined />,
            children: []
          })
          const childNode = find(node, it => it.key === ite)?.children;
          childNode && fun(goodsListObj[ite], childNode);
        }
      })
    }
    fun(item, nodeData)
    nodeData[0]?.key && setSelect(goodsListObj[nodeData[0]?.key]);
    setTreeData(nodeData)
  }, [item, goodsListObj])

  const onSelect = (selectedKeys: React.Key[]) => {
    !isEmpty(selectedKeys) && setSelect(goodsListObj[selectedKeys[0]])
  };

  return (
    <div className="flex justify-between" style={{ height: 300, minWidth: 1200 }}>
      { treeData && treeData[0] && <Tree
        className="flex-1"
        height={300}
        showLine={true}
        showIcon={false}
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

export const Details = ({ id }: { id: string }) => {
  const { goodsListObj } = useUserInfo()
  const item = useMemo(() => goodsListObj[id], [goodsListObj, id])

  return (
    <div className="text-black text-opacity-70">
      <p className="text-xl">ID:{id} 详情</p>
      <DetailsBody item={item} />
      { !isEmpty(item?.composes) && <div className="pt-4 mt-8 border-t border-black border-opacity-70 border-dashed">
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
          className={`p px-2 rounded-sm bg-white bg-opacity-10`}
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
        <Details id={String(children)} />
      </Modal>}
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
        disabled={collectList?.includes(item?.material?.id)}>{collectList?.includes(item?.material?.id) ? "已收藏" : "收藏"}</button> : <div>当前账户</div>}
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
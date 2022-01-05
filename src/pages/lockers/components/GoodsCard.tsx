import { find, isEmpty, map } from "lodash";
import { useUserInfo } from "../../../components/UserProvider";
import { categoryData } from "../../produced/components/Submit";
import { useHistory } from "react-router";
import { PixelsMetaverseImgByPositionData } from "../../../pixels-metaverse";
import { useMemo, useState } from "react";
import { ellipseAddress } from "../../../helpers/utilities";
import { useWeb3Info } from "../../../hook/web3";
import { Collection, Composes, Details, MaterialItem, MaterialLabel } from "../../../components/Card";
import { Modal } from "antd";

export const GoodsCard = ({ item }: { item: MaterialItem }) => {
  const { userInfo, goodsListObj } = useUserInfo()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { address } = useWeb3Info()
  const history = useHistory()
  const data = useMemo(() => {
    if (isEmpty(item) || isEmpty(goodsListObj)) return []
    if (isEmpty(item?.composes)) return [({ ...item, data: item?.baseInfo?.data } as any)]
    return map(item?.composeData, it => ({ ...it, data: it?.baseInfo?.data } as any))
  }, [item, goodsListObj])

  return (
    <div
      key={item?.material?.id}
      className="p-2 mb-4 flex-col flex rounded-md bg-white bg-opacity-10"
      style={{
        height: 216 + 100,
        width: 216,
        margin: 7
      }}>
      <PixelsMetaverseImgByPositionData
        data={{ ...item, positions: item?.baseInfo?.data, goodsData: data }}
        size={200}
        style={{ background: userInfo?.user?.bgColor || "#e1e1e11a", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)" }}
        onClick={() => { setIsModalVisible(true) }}
      />
      {/* <PixelsMetaverseImgByPositionData2 data={item} size={["50%", "50%"]} style={{ borderRadius: 4, background: item?.bgColor || userInfo?.user?.bgColor || "#e1e1e11a", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)" }} /> */}
      <div className="flex flex-col justify-between flex-1 mt-4" style={{ fontSize: 12, width: 200 }}>
        <div className="text-right flex-1" style={{ height: 40, textOverflow: "ellipsis", overflow: "hidden" }}>{item?.baseInfo?.name || "这什么鬼"}</div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex justify-between items-center">
            <MaterialLabel toDetails>{item?.material?.id}</MaterialLabel>
            <MaterialLabel>{(find(categoryData, ite => ite?.value === item?.baseInfo?.category) || {})?.label}</MaterialLabel>
          </div>
          <Composes item={item} />
        </div>
        <div className="flex justify-between items-center mt-2">
          {item?.material?.owner && <div className="p rounded-sm overflow-x-scroll hover:text-red-500 cursor-pointer"
            style={{ height: 20, width: 120, textOverflow: "ellipsis", overflow: "hidden" }}
            onClick={() => {
              history.push(`/person-center?address=${item?.material?.owner}`)
            }}
          >{ellipseAddress(item?.material?.owner, 8)}</div>}
          <Collection item={item} />
        </div>
      </div>
      {isModalVisible && item?.material?.id && <Modal
        title=""
        width={1200}
        visible={isModalVisible}
        footer={null}
        onCancel={() => { setIsModalVisible(false) }}
      >
        <Details id={item?.material?.id} setIsModalVisible={setIsModalVisible}/>
      </Modal>}
    </div>
  )
}
import { find, isEmpty, map } from "lodash";
import { useUserInfo } from "../../../components/UserProvider";
import { categoryData } from "../../produced/components/Submit";
import { useHistory } from "react-router";
import { PixelsMetaverseImgByPositionData } from "../../../pixels-metaverse";
import { useMemo, useState } from "react";
import { ellipseAddress } from "../../../helpers/utilities";
import { Composes, Details, MaterialItem, MaterialLabel } from "../../../components/Card";
import { message, Modal, Typography } from "antd";
import { useWeb3Info } from "abi-to-request";
const { Paragraph } = Typography;

export const MaterialCard = ({ item }: { item: MaterialItem }) => {
  const { userInfo, materialListObj } = useUserInfo()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isBigImg, setIsBigImg] = useState<boolean>(false);
  const { address } = useWeb3Info()
  const data = useMemo(() => {
    if (isEmpty(item) || isEmpty(materialListObj)) return []
    if (isEmpty(item?.composes)) return [({ ...item, data: item?.baseInfo?.data } as any)]
    return map(item?.composeData, it => ({ ...it, data: it?.baseInfo?.data } as any))
  }, [item, materialListObj])

  const copyToClipboard = (content: string) => {
    const el = document.createElement("textarea");
    el.value = content;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(el);
    message.success("复制成功！");
  };

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
        data={{ ...item, positions: item?.baseInfo?.data, materialData: data }}
        size={200}
        style={{ background: userInfo?.user?.bgColor || "#e1e1e11a", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)" }}
        onClick={() => { setIsBigImg(true) }}
      />
      {/* <PixelsMetaverseImgByPositionData2 data={item} size={["50%", "50%"]} style={{ borderRadius: 4, background: item?.bgColor || userInfo?.user?.bgColor || "#e1e1e11a", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)" }} /> */}
      <div className="flex flex-col justify-between flex-1 mt-4" style={{ fontSize: 12, width: 200 }}>
        <div className="text-right flex-1" style={{ height: 40, textOverflow: "ellipsis", overflow: "hidden" }}>{item?.baseInfo?.name || "这什么鬼"}</div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex justify-between items-center">
            <MaterialLabel toDetails>{item?.material?.id}</MaterialLabel>
            {/* <MaterialLabel>{(find(categoryData, ite => ite?.value === item?.baseInfo?.category) || {})?.label}</MaterialLabel> */}
          </div>
          <Composes item={item} />
        </div>
        <div className="flex justify-between items-center mt-2">
          {item?.material?.owner && <div
            className="p rounded-sm overflow-x-scroll hover:text-red-500 cursor-pointer"
            style={{ height: 20, textOverflow: "ellipsis", overflow: "hidden" }}
            onClick={()=>{
              copyToClipboard(item?.material?.owner)
            }}
          >{ellipseAddress(item?.material?.owner, 15)}</div>}
        </div>
      </div>
      {isModalVisible && item?.material?.id && <Modal
        title=""
        width={1200}
        visible={isModalVisible}
        footer={null}
        onCancel={() => { setIsModalVisible(false) }}
      >
        <Details id={item?.material?.id} setIsModalVisible={setIsModalVisible} />
      </Modal>}
      {isBigImg && item?.material?.id && <Modal
        title=""
        width={600}
        visible={isBigImg}
        footer={null}
        bodyStyle={{ padding: 0 }}
        closable={false}
        onCancel={() => { setIsBigImg(false) }}
      >
        <PixelsMetaverseImgByPositionData
          data={{ ...item, positions: item?.baseInfo?.data, materialData: data }}
          size={600}
          style={{ background: "#323945", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)", margin: "auto" }} />
      </Modal>}
    </div>
  )
}
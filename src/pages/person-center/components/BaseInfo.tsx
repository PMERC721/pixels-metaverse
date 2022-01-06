import { isEmpty } from "lodash";
import { message } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { fetchRegister, fetchSetConfig, useRequest } from "../../../helpers/api";
import { useLocation } from "react-router";
import { useUserInfo } from "../../../components/UserProvider";
import { fetchUserInfo, PixelsMetaverseHandleImg, usePixelsMetaverseContract, usePixelsMetaverseHandleImg } from "../../../pixels-metaverse";
import { ReactNode } from "react";

const InfoLabel = ({ children, label }: { children: ReactNode, label: string }) => {
  return (
    <div className="flex justify-between items-center mt-3">
      <div>{label}</div>
      { children}
    </div>
  )
}

export const BaseInfo = () => {
  const { setConfig, config, canvas2Ref } = usePixelsMetaverseHandleImg()
  const { accounts } = usePixelsMetaverseContract()
  const { search } = useLocation()
  const { userInfo, setUserInfo } = useUserInfo()
  const address = search ? search.split("=")[1] : accounts.address
  const getUserInfo = useRequest(fetchUserInfo)

  const getInfo = () => {
    if (isEmpty(address)) return
    getUserInfo({ address, setUserInfo })
  }

  const goSetConfig = useRequest(fetchSetConfig, {
    onSuccess: () => {
      message.success("更新信息成功！")
      getInfo()
    }
  }, [config, address])

  const fetch = useRequest(fetchRegister, {
    onSuccess: () => {
      message.success("激活账户成功！")
      getInfo()
    }
  }, [address])

  return (
    <div className="pr-8 mr-4 border-r border-white border-opacity-30">
      <PixelsMetaverseHandleImg
        className="rounded-full mb-8"
        canvasRef={canvas2Ref}
        showGridColor
        style={{
          backgroundColor: config.bgColor,
          cursor: "cell",
          boxShadow: "0px 0px 10px rgba(225,225,225,0.3)"
        }} />
      <div className="overflow-y-scroll" style={{ height: "calc(100% - 240px)" }}>
        <InfoLabel label="账户">
          <div className="overflow-x-scroll w-48">
            {userInfo?.account || "0x000000000000000000000000000000000000000000000000000"}
          </div>
        </InfoLabel>
        <InfoLabel label="类型">
          {userInfo?.account?.includes("0000000000000000000000000")
            ? <div className="cursor-pointer text-red-500" onClick={fetch}>去激活账户</div>
            : <div>{userInfo?.isMerchant ? "商户" : "用户"}</div>}
        </InfoLabel>
        <InfoLabel label="显示辅助线">
          <AppstoreOutlined style={{ color: config?.withGrid ? 'white' : "gray", fontSize: 22 }}
            onClick={() => setConfig((pre) => ({ ...pre, withGrid: !config?.withGrid }))} />
        </InfoLabel>
        <InfoLabel label="辅助线颜色">
          <input type="color" value={config?.gridColor} className="w-10 cursor-pointer"
            onChange={(e) => setConfig((pre) => ({ ...pre, gridColor: e.target.value }))} />
        </InfoLabel>
        <InfoLabel label="背景色">
          <input type="color" value={config?.bgColor} className="w-10 cursor-pointer"
            onChange={(e) => setConfig((pre) => ({ ...pre, bgColor: e.target.value }))} />
        </InfoLabel>
        <button className="mt-6 bg-red-500 cursor-pointer h-10 w-full hover:text-white rounded"
          disabled={address?.toUpperCase() !== accounts?.address?.toUpperCase()}
          onClick={() => {
            goSetConfig({
              value: {
                bgColor: config?.bgColor,
                gridColor: config?.gridColor,
                withGrid: config?.withGrid
              }
            })
          }}
        >{address?.toUpperCase() === accounts?.address?.toUpperCase() ? "更新设置" : "不可更新设置"}</button>
      </div>
    </div>
  )
}
import { Button, message } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { fetchSetUserConfig, useRequest } from "../../../hook/api";
import { useLocation } from "react-router";
import { useUserInfo } from "../../../components/UserProvider";
import { PixelsMetaverseHandleImg, usePixelsMetaverseHandleImg } from "../../../pixels-metaverse";
import { ReactNode, useEffect, useMemo } from "react";
import { useWeb3Info } from "../../../hook/web3";
import { split } from "lodash";

const InfoLabel = ({ children, label }: { children: ReactNode, label: string }) => {
  return (
    <div className="flex justify-between items-center mt-3">
      <div>{label}</div>
      { children}
    </div>
  )
}

export const useGetUserConfig = () => {
  const { userInfo } = useUserInfo()
  return useMemo(() => {
    let bgColor: string, gridColor: string, withGrid: boolean;
    if (!userInfo?.other) {
      bgColor = "";
      gridColor = "";
      withGrid = false;
    }
    try {
      let other = split(userInfo?.other, "|")
      bgColor = other[0];
      gridColor = other[1];
      withGrid = !!other[2];
    } catch (error) {
      bgColor = "";
      gridColor = "";
      withGrid = false;
    }
    return { bgColor, gridColor, withGrid }
  }, [userInfo?.other])
}

export const BaseInfo = () => {
  const { setConfig, config, canvas2Ref } = usePixelsMetaverseHandleImg()
  const { address: addresss } = useWeb3Info()
  const { search } = useLocation()
  const address = search ? search.split("=")[1] : addresss
  const { userInfo, getInfo, register } = useUserInfo()

  const goSetConfig = useRequest(fetchSetUserConfig, {
    onSuccess: () => {
      message.success("更新信息成功！")
      getInfo()
    }
  }, [config, address])

  const { bgColor, gridColor, withGrid } = useGetUserConfig()
  useEffect(() => {
    if (!bgColor && !gridColor && !withGrid) return
    setConfig((pre) => ({ ...pre, withGrid, bgColor, gridColor }))
  }, [bgColor, gridColor, withGrid])

  const isCurUser = useMemo(() => address?.toUpperCase() === addresss?.toUpperCase(), [addresss, address])

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
            {address || "0x000000000000000000000000000000000000000000000000000"}
          </div>
        </InfoLabel>
        <InfoLabel label="类型">
          {userInfo?.id === "0"
            ? <div className="cursor-pointer text-red-500" onClick={register}>去激活账户</div>
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
        <Button type="primary" size="large" className="mt-6 bg-red-500 cursor-pointer h-10 w-full hover:text-white"
          style={{ cursor: isCurUser && userInfo?.id !== "0" ? "pointer" : "no-drop" }}
          onClick={() => {
            console.log(`${config?.bgColor || ""}|${config?.withGrid ? config?.gridColor : ""}`)
            if (isCurUser && userInfo?.id !== "0") {
              goSetConfig({ other: `${config?.bgColor || ""}|${config?.gridColor}|${config?.withGrid ? true : ""}`, role: userInfo?.role, id: userInfo?.avater })
            }
          }}
        >{address?.toUpperCase() === addresss?.toUpperCase() ? "更新设置" : "不可更新设置"}</Button>
      </div>
    </div>
  )
}
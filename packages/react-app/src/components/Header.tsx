import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { ellipseAddress } from "../helpers/utilities";
import { useTranslation } from "react-i18next"
import { Button, Menu, message } from "antd";
import { isEmpty } from "lodash";
import i18n from "i18next";
import { useWeb3Info } from "abi-to-request"
import { useUserInfo } from "./UserProvider";

const nav = [
  // { label: "加工", path: "/action" },
  { label: "生产", path: "/produced" },
  { label: "仓库", path: "/lockers" },
  // { label: "个人中心", path: "/person-center" },
]

const menu = () => {
  const changeLanguage = (val: string) => {
    i18n.changeLanguage(val);
  };

  return (
    <Menu>
      <Menu.Item key="cd" onClick={() => changeLanguage("cn")}>简体</Menu.Item>
      <Menu.Item key="hk" onClick={() => changeLanguage("hk")}>繁体</Menu.Item>
      <Menu.Item key="en" onClick={() => changeLanguage("en")}>英文</Menu.Item>
    </Menu>
  )
}

export const useQueryParams = () => {
  const { search } = useLocation();
  const parmasString = search.substring(1);
  const params = new URLSearchParams(parmasString);
  return params
}

export const Header = memo(() => {
  const { connected, address, killSession, toConnect, chainData } = useWeb3Info();
  const { t } = useTranslation()
  const history = useHistory()
  const { pathname } = useLocation()
  const params = useQueryParams()
  const [inputStr, setInputStr] = useState<string | null>()
  const { SmallLoading } = useUserInfo()
  /*   const [data] = useGetDataRequest(fetchGetMaterialLength, undefined)
  
    console.log(data?.toString()) */

  useEffect(() => {
    if (params && params?.get("address")) {
      setInputStr(params?.get("address"))
    }
  }, [params?.get("address")])

  return (
    <div className="flex px-4 items-center justify-between text-l fixed w-full h-16 bg-white bg-opacity-10 text-white text-opacity-70 z-50">
      <div className="text-2xl cursor-pointer mr-20" onClick={() => history.push("/")}>像素元宇宙</div>
      <div className="flex items-center justify-between flex-1">
        <div className="flex justify-around items-center w-40">
          {nav.map(item => {
            return (<div
              key={item?.label}
              style={{ color: pathname === item?.path ? "#EF4444" : "rgba(225,225,225,.9)" }}
              className="cursor-pointer hover:text-red-500"
              onClick={() => history.push(item?.path)}
            >{item?.label}</div>)
          })}
        </div>
        <div className="flex justify-end relative">
          {/* <div className="mr-4 flex items-center bg-white bg-opacity-10" style={{ borderRadius: 20 }}>
            <input
              className="px-4 bg-transparent outline-none focus:outline-none w-60"
              placeholder="请输入用户钱包地址"
              value={inputStr || ""}
              onChange={(e) => setInputStr(e.target.value)}
            />
            <Button type="primary" size="large" className="w-24"
              style={{ borderRadius: 0, borderTopRightRadius: 20, borderBottomRightRadius: 20, height: "100%" }}
              onClick={() => {
                if (inputStr && (inputStr?.length !== 42 || inputStr?.indexOf("0x") !== 0)) {
                  message.warning("Please enter a well-formed address");
                  return;
                }
                history.push(`/action${inputStr ? "?address=" + inputStr : ""}`)
              }}
            >查询</Button>
          </div> */}
          <div className="mr-4 flex items-center">
            <SmallLoading size={20} color={"#EF4444"} />
          </div>


          {address && !isEmpty(chainData) && connected ? (
            <div className="px-2 rounded bg-white bg-opacity-10 relative w-52 h-11">
              <div className="font-bold">{ellipseAddress(address, 12)}</div>
              <div className="flex justify-between text-xs">
                <div className="w-32 ellipsis">
                  {chainData?.name}
                </div>
                <span className="cursor-pointer hover:text-white" onClick={killSession}>断开连接</span>
              </div>
            </div>)
            : <div className="flex items-center justify-center rounded cursor-pointer bg-white bg-opacity-10 w-24 hover:text-white h-10"
              onClick={() => {
                localStorage.clear()
                toConnect && toConnect()
              }}>连接钱包</div>
          }
          {/* <Dropdown overlay={menu} placement="bottomLeft">
          <div className="flex items-center justify-center rounded cursor-pointer bg-white bg-opacity-10 w-24 hover:text-white ml-4">{t("home.content")}</div>
        </Dropdown> */}
        </div>
      </div >
    </div>
  );
});
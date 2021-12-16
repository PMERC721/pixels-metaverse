import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { memo, useState } from "react";
import { ellipseAddress } from "../helpers/utilities";
import { useTranslation } from "react-i18next"
import { Button, Menu } from "antd";
import { useWeb3Info } from "../hook/web3";
import { isEmpty } from "lodash";
import i18n from "i18next";

const nav = [
  { label: "首页", path: "/app" },
  { label: "作坊", path: "/produced" },
  { label: "储物室", path: "/lockers" },
  { label: "个人中心", path: "/person-center" },
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

export const Header = memo(() => {
  const { connected, address, killSession, toConnect, chainData } = useWeb3Info();
  const { t } = useTranslation()
  const history = useHistory()
  const [inputStr, setInputStr] = useState("")
  const { pathname } = useLocation()

  return (
    <div className="flex px-4 items-center justify-between text-l fixed w-full h-16 bg-white bg-opacity-10 text-white text-opacity-70">
      <div className="text-2xl cursor-pointer" onClick={() => history.push("/")}>像素元宇宙</div>
      <div className="flex justify-around items-center w-80">
        {nav.map(item => {
          return (<div
            key={item?.label}
            style={{ color: pathname === item?.path ? "#EF4444" : "rgba(225,225,225,.9)" }}
            className="cursor-pointer hover:text-red-500"
            onClick={() => history.push(item?.path)}
          >{item?.label}</div>)
        })}
      </div>
      <div className="flex justify-end">
        <div className="mr-4 flex items-center bg-white bg-opacity-10" style={{ borderRadius: 20 }}>
          <input
            className="px-4 bg-transparent outline-none focus:outline-none w-60"
            placeholder="请输入用户钱包地址"
            onChange={(e) => setInputStr(e.target.value)}
          />
          <Button type="primary" size="large" className="w-24"
            style={{ borderRadius: 0, borderTopRightRadius: 20, borderBottomRightRadius: 20 }}
            onClick={() => history.push(`/app${inputStr ? "?address=" + inputStr : ""}`)}
          >查询</Button>
        </div>

        {address && !isEmpty(chainData) && connected ? (
          <div className="px-4 rounded bg-white bg-opacity-10 relative w-48">
            <div className="font-bold">{ellipseAddress(address, 10)}</div>
            <div className="flex justify-between text-xs">
              {chainData?.name}<span className="cursor-pointer hover:text-white" onClick={killSession}>断开连接</span>
            </div>
          </div>)
          : <div className="flex items-center justify-center rounded cursor-pointer bg-white bg-opacity-10 w-24 hover:text-white"
            onClick={toConnect}>连接钱包</div>
        }
        {/* <Dropdown overlay={menu} placement="bottomLeft">
          <div className="flex items-center justify-center rounded cursor-pointer bg-white bg-opacity-10 w-24 hover:text-white ml-4">{t("home.content")}</div>
        </Dropdown> */}
      </div>
    </div >
  );
});
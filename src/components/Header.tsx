import { transitions } from "../styles";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { useWeb3js } from "../eos-api/hook";
import React, { useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { getWeb3 } from "../eos-api/getWeb3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import { Bitski } from "bitski";
import { ellipseAddress, getChainData } from "../helpers/utilities";
import { useTranslation } from "react-i18next"
import { Dropdown, Menu } from "antd";
import i18n from "i18next";

interface IWeb3InfoProps {
  connected?: boolean;
  address?: string;
  chainId?: number;
  web3?: Web3;
  networkId?: number,
  web3Modal?: Web3Modal,
  addressBalance?: string,
}

const nav = [
  { label: "首页", path: "/app" },
  { label: "制作虚拟物品", path: "/produced" },
  { label: "商城", path: "/mall" },
  { label: "个人中心", path: "/person-center" },
]

const menu = () => {
  const changeLanguage = (val: string) => {
    i18n.changeLanguage(val);
  };

  return (
    <Menu>
      <Menu.Item onClick={() => changeLanguage("cn")}>简体</Menu.Item>
      <Menu.Item onClick={() => changeLanguage("hk")}>繁体</Menu.Item>
      <Menu.Item onClick={() => changeLanguage("en")}>英文</Menu.Item>
    </Menu>
  )
}

const getProviderOptions = () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "4bf032f2d38a4ed6bb975b80d6340847"
      }
    },
    authereum: {
      package: Authereum
    },
    bitski: {
      package: Bitski,
      options: {
        clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
        callbackUrl: window.location.href + "bitski-callback.html"
      }
    }
  };
  return providerOptions;
};

const INITIAL_STATE: IWeb3InfoProps = {
  address: "",
  web3: undefined,
  connected: false,
  chainId: 1,
  networkId: 1
};

const useGetWeb3Info = () => {
  const [{
    connected,
    address,
    chainId,
    web3,
    networkId,
    web3Modal
  }, setWeb3Info] = useState<IWeb3InfoProps>({})

  const resetApp = async () => {
    await web3Modal?.clearCachedProvider();
    setWeb3Info((pre) => ({ ...pre, ...INITIAL_STATE }));
  };

  const network = useMemo(() => chainId ? getChainData(chainId).network : "mainnet", [chainId]);

  useEffect(() => {
    const web3Modal = new Web3Modal({
      network,
      cacheProvider: true,
      providerOptions: getProviderOptions()
    });
    setWeb3Info((pre) => ({ ...pre, web3Modal }));
  }, [])

  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      toConnect()
    }
  }, [web3Modal?.cachedProvider])

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await setWeb3Info((pre) => ({ ...pre, address: accounts[0] }));
    });
    provider.on("chainChanged", async (chainId: number) => {
      const networkId = await web3?.eth.net.getId();
      await setWeb3Info((pre) => ({ ...pre, chainId, networkId }))
    });

    provider.on("networkChanged", async (networkId: number) => {
      const chainId = await web3?.eth?.getChainId();
      await setWeb3Info((pre) => ({ ...pre, chainId, networkId }));
    });
  };

  const initWeb3 = (provider: any) => {
    const web3: any = new Web3(provider);
    web3?.eth.extend({
      methods: [
        {
          name: "chainId",
          call: "eth_chainId",
          outputFormatter: web3?.utils.hexToNumber
        }
      ]
    });

    return web3;
  }

  const toConnect = async () => {
    const provider = await web3Modal?.connect();
    let web3: Web3, chainId: number;
    try {
      await subscribeProvider(provider);
      web3 = initWeb3(provider);
      chainId = await web3?.eth.getChainId();
    } catch (error) {
      web3 = await getWeb3()
      chainId = await web3?.eth.getChainId();
    }

    const accounts = await web3?.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3?.eth.net.getId();

    const addressBalance = await web3?.eth.getBalance(address)

    setWeb3Info((pre) => ({
      ...pre,
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId,
      addressBalance
    }));
  };

  const killSession = () => {
    resetApp()
  }

  return {
    connected,
    address,
    chainId,
    killSession,
    toConnect,
    web3,
    networkId
  }
}

const Header = () => {
  const { connected, address, chainId, killSession, toConnect, web3, networkId } = useGetWeb3Info();
  const { t } = useTranslation()
  const chainData = chainId ? getChainData(chainId) : null;
  const history = useHistory()
  const [inputStr, setInputStr] = useState("")
  const { pathname } = useLocation()
  const { setAccounts } = useWeb3js()

  useEffect(() => {
    if (!web3) return
    setAccounts({
      web3,
      networkId,
      address
    })
  }, [web3, networkId, address])

  return (
    <div className="flex px-4 items-center justify-end text-l fixed w-full header">
      <div style={{
        marginBottom: "1px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        flex: 1,
        justifyContent: "space-between"
      }}>
        <div className="text-2xl cursor-pointer" onClick={() => { history.push("/") }}>像素元宇宙，从头开始</div>
        <div className="flex justify-around items-center w-96">
          {nav.map(item => {
            return <div key={item?.label} style={{ color: pathname === item?.path ? "#EF4444" : "rgba(225,225,225,.9)" }} className="cursor-pointer hover:text-red-500"
              onClick={() => { history.push(item?.path) }}>{item?.label}</div>
          })}
        </div>
        <div className="flex justify-end" style={{ width: 500 }}>
          <div className="mr-4 flex items-center search-box">
            <input
              className="py-2 pl-4 mr-2 bg-transparent search"
              placeholder="请输入以太坊钱包地址"
              onChange={(e) => { setInputStr(e.target.value) }}
            />
            <div className="flex items-center justify-center h-full w-20 bg-red-500 cursor-pointer hover:text-white"
              style={{ borderTopRightRadius: 20, borderBottomRightRadius: 20 }}
              onClick={() => {
                history.push(`/app${inputStr ? "?address=" + inputStr : ""}`)
              }}>查询</div>
          </div>

          {address && chainData ? (
            <div className="bg-black contect px-4 rounded-md">
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                fontWeight: 500
              }}>
                <div
                  style={{
                    transition: transitions.base,
                    fontWeight: "bold",
                    margin: connected ? "0px auto 1em" : "0"
                  }}>{ellipseAddress(address)}</div>
                <div
                  style={{
                    transition: transitions.button,
                    fontSize: "12px",
                    fontFamily: "monospace",
                    position: "absolute",
                    top: "20px",
                    opacity: connected ? 1 : 0,
                    visibility: connected ? "visible" : "hidden",
                    pointerEvents: connected ? "auto" : "none",
                    left: 0
                  }}>
                  {chainData.name}
                </div>
                <div style={{
                  transition: transitions.button,
                  fontSize: "12px",
                  fontFamily: "monospace",
                  position: "absolute",
                  right: 0,
                  top: "20px",
                  opacity: 0.7,
                  visibility: connected ? "visible" : "hidden",
                  pointerEvents: connected ? "auto" : "none",
                  cursor: "pointer"
                }} onClick={killSession}>
                  {"断开连接"}
                </div>
              </div>
            </div>)
            : <div className="flex items-center justify-center rounded-md cursor-pointer contect w-24" style={{ height: 40 }} onClick={() => {
              toConnect()
            }} >连接钱包</div>
          }
          {/* <Dropdown overlay={menu} placement="bottomLeft">
            <div className="flex items-center justify-center rounded-md cursor-pointer contect ml-4" style={{ height: 40, minWidth: 80, marginTop: -1 }}>{t("home.content")}</div>
          </Dropdown> */}
        </div>
      </div>
    </div >
  );
};

export default Header;

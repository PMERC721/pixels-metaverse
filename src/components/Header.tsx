import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import { Bitski } from "bitski";
import { ellipseAddress, getChainData, warning } from "../helpers/utilities";
import { useTranslation } from "react-i18next"
import { Button, Menu } from "antd";
import { useWeb3js, useMyWeb3 } from "../hook/web3";
import i18n from "i18next";
import { IChainData } from "../helpers/types";
import { isEmpty } from "lodash";

interface IWeb3InfoProps {
  connected?: boolean;
  address?: string;
  chainId?: number;
  web3?: Web3;
  networkId?: number,
  web3Modal?: Web3Modal,
  addressBalance?: string,
  chainData?: IChainData
}

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
    web3Modal,
    chainData
  }, setWeb3Info] = useState<IWeb3InfoProps>({})
  const getMyWeb3 = useMyWeb3()

  const resetApp = async () => {
    await web3Modal?.clearCachedProvider();
    setWeb3Info((pre) => ({ ...pre, ...INITIAL_STATE }));
  };

  useEffect(() => {
    if (chainId) {
      const chainData = getChainData(chainId)
      if (!chainData) {
        warning(parseInt(String(chainId)))
      }
      setWeb3Info((pre) => ({ ...pre, chainData: chainData || null }));
    }
  }, [chainId])

  const network = useMemo(() => !isEmpty(chainData) ? chainData?.network : "mainnet", [chainData]);

  useEffect(() => {
    const web3Modal = new Web3Modal({
      network,
      cacheProvider: true,
      providerOptions: getProviderOptions()
    });
    setWeb3Info((pre) => ({ ...pre, web3Modal }));
  }, [network])

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
      web3 = await getMyWeb3()
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
    networkId,
    chainData
  }
}

export const Header = () => {
  const { connected, address, killSession, toConnect, web3, chainData } = useGetWeb3Info();
  const { t } = useTranslation()
  const history = useHistory()
  const [inputStr, setInputStr] = useState("")
  const { pathname } = useLocation()
  const web3js = useWeb3js()

  useEffect(() => {
    if (!web3 || web3js.web3) return
    console.log(web3, web3js.web3)
    web3js?.setWeb3(web3)
  }, [web3])

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
            placeholder="请输入以太坊钱包地址"
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
};
import React, { createContext, ReactNode, useState, useContext, Dispatch, useCallback, useEffect, useMemo } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import { Bitski } from "bitski";
import { getChainData, warning } from "../helpers/utilities";
import { IChainData } from "../helpers/types";
import { isEmpty } from "lodash";

export const useMyWeb3 = () => {
  return useCallback(() => new Promise<Web3>((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  }), [])
}

interface IWeb3InfoProps {
  connected?: boolean;
  address?: string;
  chainId?: number;
  web3?: Web3;
  networkId?: number,
  web3Modal?: Web3Modal,
  addressBalance?: string,
  chainData?: IChainData,
  killSession?: () => void,
  toConnect?: () => void,
}

const INITIAL_STATE: IWeb3InfoProps = {
  address: "",
  web3: undefined,
  connected: false,
  chainId: 1,
  networkId: 1
};

export const Web3InfoContext = createContext(
  {} as {
    web3Info: IWeb3InfoProps;
    setWeb3Info: Dispatch<React.SetStateAction<IWeb3InfoProps>>;
  },
);

export const useWeb3Info = () => useContext(Web3InfoContext);

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

export const useGetWeb3Info = () => {
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

export const Web3InfoProvider = ({ children }: { children: ReactNode }) => {
  const [web3Info, setWeb3Info] = useState<IWeb3InfoProps>(INITIAL_STATE);
  const getWeb3Info = useGetWeb3Info()

  useEffect(() => {
    setWeb3Info((pre) => ({ ...pre, ...getWeb3Info }))
  }, [getWeb3Info])

  return (
    <Web3InfoContext.Provider value={{ web3Info, setWeb3Info }}>
      {children}
    </Web3InfoContext.Provider>
  )
}
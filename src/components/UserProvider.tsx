import { Dictionary, isEmpty, map } from "lodash";
import * as React from "react";
import { ReactNode, useContext, useEffect, useState } from "react";
import { createContext, Dispatch } from "react";
import { usePixelsMetaverse } from "../pixels-metaverse";
import { fetchCollectList, fetchGetGoodsIdList, fetchUserInfo, useRequest } from "../hook/api";
import { useWeb3Info } from "../hook/web3";

export const UserInfoContext = createContext(
  {} as {
    userInfo: any;
    setUserInfo: Dispatch<any>;
    goodsList: any[];
    setGoodsList: Dispatch<any[]>;
    collectList: any[];
    setCollectList: Dispatch<any[]>;
    goodsId?: number;
    setGoodsId: Dispatch<React.SetStateAction<number | undefined>>
  },
);

export const useUserInfo = () => useContext(UserInfoContext);

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<Dictionary<any>>({});
  const [goodsList, setGoodsList] = useState<any[]>([]);
  const [collectList, setCollectList] = useState<any[]>([]);
  const [goodsId, setGoodsId] = useState<number | undefined>();
  const { address, networkId } = useWeb3Info()
  const { contract } = usePixelsMetaverse()
  const getUserInfo = useRequest(fetchUserInfo)

  useEffect(() => {
    if (isEmpty(address)) return
    getUserInfo({ address: address, setUserInfo })
  }, [address, contract])

  const getGoodsIdList = useRequest(fetchGetGoodsIdList)
  const getCollectList = useRequest(fetchCollectList)

  useEffect(() => {
    getGoodsIdList({ setValue: setGoodsList, newNumber: -1 })
  }, [address, contract])

  useEffect(() => {
    getCollectList({ setValue: setCollectList, address })
  }, [address, contract])

  useEffect(() => {
    if (isEmpty(networkId)) return
    setGoodsList([])
    getGoodsIdList({ setValue: setGoodsList, newNumber: -1 })
  }, [networkId])

  console.log(collectList)

  useEffect(() => {
    if (!goodsId) return
    //getGoodsInfo({ id: goodsId, setGoodsList })
  }, [goodsId])

  return (
    <UserInfoContext.Provider value={{
      userInfo, setUserInfo,
      goodsList, setGoodsList,
      goodsId, setGoodsId,
      collectList, setCollectList
    }}>
      {children}
    </UserInfoContext.Provider>
  )
}
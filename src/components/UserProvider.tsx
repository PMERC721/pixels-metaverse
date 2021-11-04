import { Dictionary, isEmpty } from "lodash";
import * as React from "react";
import { ReactNode, useContext, useEffect, useState } from "react";
import { createContext, Dispatch } from "react";
import { fetchUserInfo, usePixelsMetaverse } from "../pixels-metaverse";
import { fetchGetGoodsIdList, useRequest } from "../hook/api";

export const UserInfoContext = createContext(
  {} as {
    userInfo: any;
    setUserInfo: Dispatch<any>;
    goodsList: any[];
    setGoodsList: Dispatch<any[]>;
    goodsId?: number;
    setGoodsId: Dispatch<React.SetStateAction<number | undefined>>
  },
);

export const useUserInfo = () => useContext(UserInfoContext);

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<Dictionary<any>>({});
  const [goodsList, setGoodsList] = useState<any[]>([]);
  const [goodsId, setGoodsId] = useState<number | undefined>();
  const { accounts, contract } = usePixelsMetaverse()
  const getUserInfo = useRequest(fetchUserInfo)

  useEffect(() => {
    if (isEmpty(accounts?.address)) return
    getUserInfo({ address: accounts?.address, setUserInfo })
  }, [accounts?.address, contract])

  const getGoodsIdList = useRequest(fetchGetGoodsIdList)

  useEffect(() => {
    getGoodsIdList({ setValue: setGoodsList, newNumber: -1 })
  }, [accounts?.address, contract])

  useEffect(() => {
    if (isEmpty(accounts?.networkId)) return
    setGoodsList([])
    getGoodsIdList({ setValue: setGoodsList, newNumber: -1 })
  }, [accounts?.networkId])

  /* useEffect(()=>{
    if(!goodsId) return
    getGoodsInfo({ id: goodsId, setGoodsList })
  }, [goodsId]) */

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo, goodsList, setGoodsList, goodsId, setGoodsId }}>
      {children}
    </UserInfoContext.Provider>
  )
}
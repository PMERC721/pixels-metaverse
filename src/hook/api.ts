import { Dispatch, useCallback, useEffect, useState } from "react";
import { IMerchandise } from "../pages/produced/components/Submit";
import { useLoading } from "../components/Loading";
import { message } from "antd";
import { cloneDeep, map } from "lodash";
import { usePixelsMetaverse } from "../pixels-metaverse";
import { useWeb3Info } from "./web3";
import { Contract } from 'web3-eth-contract';

export interface IArgContract { contract: Contract, accounts?: any, address?: any }

export interface IHandle {
  onSuccess?: () => void,
  onFail?: (arg?: any) => void
}

export const useRequest = (
  fetch: (argContract: IArgContract, arg?: any) => Promise<void>,
  {
    onSuccess,
    onFail
  }: IHandle = {},
  delay: any[] = []
) => {
  const { address } = useWeb3Info()
  const { contract } = usePixelsMetaverse()
  const { closeDelayLoading, openLoading, closeLoading } = useLoading()

  return useCallback(async (arg?: any) => {
    if (!contract || !address) return
    try {
      !arg?.closeLoading && openLoading()
      fetch({ address, contract }, arg).then(() => {
        closeDelayLoading()
        onSuccess && onSuccess()
      }).catch((error) => {
        closeLoading()
        console.log(error)
        //message.error(error?.message)
        onFail && onFail(error)
      })
    } catch (error) {
      closeLoading()
      console.log(error)
      message.error(error?.message)
      onFail && onFail(error)
    }
  }, [contract, address, ...delay])
}

export const fetchUserInfo = async (argContract: IArgContract, arg: { address: string, setUserInfo: Dispatch<any> }) => {
  const info = await argContract?.contract?.methods.user(arg.address).call();
  arg.setUserInfo && arg.setUserInfo(info)
}

export const fetchRegister = async (argContract: IArgContract) => {
  await argContract?.contract.methods.register().send({ from: argContract?.address });
}

export const fetchGetGoodsInfo = async (argContract: IArgContract, arg: { id: number, setGoodsList: Dispatch<React.SetStateAction<any[]>> }) => {
  const goods = await argContract?.contract.methods.goods(arg?.id).call();
  arg?.setGoodsList && arg?.setGoodsList((pre) => {
    const list = cloneDeep(pre)
    return map(list, item => {
      if (item?.id === goods.id) {
        return goods
      }
      return item
    })
  })
}

export const fetchCollectList = async (argContract: IArgContract, arg: { address: string, setValue: Dispatch<React.SetStateAction<any[]>> }) => {
  const list = await argContract?.contract.methods.getCollection(arg?.address).call();
  console.log(list, "getCollection")
  arg?.setValue && arg?.setValue(list)
}

export const fetchGetMaterialLength = async (argContract: IArgContract, arg?: { setValue: Dispatch<React.SetStateAction<any>> }) => {
  const len = await argContract?.contract.methods.getMaterialLength().call();
  console.log(len, "list")
  arg?.setValue && arg?.setValue(Number(len))
}

export const fetchGetGoodsIdList = async (argContract: IArgContract, arg?: { setValue: Dispatch<React.SetStateAction<any[]>>, newNumber?: number }) => {
  const len = await argContract?.contract?.methods.getMaterialLength().call();

  if (arg?.newNumber === -1) {
    for (let i = len; i >= 1; i--) {
      let item = await argContract?.contract?.methods.getMaterial(i).call()
      const obj = { ...item, composeData: [] }
      arg?.setValue && arg?.setValue((pre) => {
        if (i === len) {
          return [obj]
        }
        return [...pre, obj]
      })
    }
  } else {
    for (let i = len - 1; i >= len - (arg?.newNumber || len); i--) {
      let item = await argContract?.contract?.methods.getMaterial(i + 1).call()
      const obj = { ...item, composeData: [] }
      arg?.setValue && !arg.newNumber && arg?.setValue((pre) => ([...pre, obj]))
      arg?.setValue && arg.newNumber && arg?.setValue((pre) => ([obj, ...pre]))
    }
  }
}

export const fetchSetConfig = async (argContract: IArgContract, arg: { config: string }) => {
  await argContract?.contract.methods.setConfig(arg.config).send({ from: argContract?.address });
}

export const fetchApplication = async (argContract: IArgContract, arg: { name: string }) => {
  await argContract?.contract.methods.application(arg?.name).send({ from: argContract?.address });
}

export const fetchMake = async (argContract: IArgContract, arg: { value: IMerchandise }) => {
  await argContract?.contract.methods.make(
    arg?.value?.name,
    arg?.value?.category,
    arg?.value?.data,
    "",
    Number(arg?.value?.amount)
  ).send({ from: argContract?.address });
}

export const fetchBuyGoods = async (argContract: IArgContract, arg: { id: number, price: number, setGoodsList: Dispatch<React.SetStateAction<any[]>> }) => {
  await argContract?.contract.methods.buyGoods(arg.id).send({ from: argContract?.address, value: arg.price });
  fetchGetGoodsInfo(argContract, { id: arg?.id, setGoodsList: arg?.setGoodsList })
}

export const fetchCollect = async (argContract: IArgContract, arg: { id: number, setGoodsList: Dispatch<React.SetStateAction<any[]>> }) => {
  await argContract?.contract.methods.collect(arg.id).send({ from: argContract?.address });
  //fetchGetGoodsInfo(argContract, { id: arg?.id, setGoodsList: arg?.setGoodsList })
}

export const fetchCompose = async (argContract: IArgContract, arg: { ids: string[], name: string, category: string }) => {
  console.log(arg)
  await argContract?.contract.methods.compose(arg.ids, arg.name, arg.category, "", "").send({ from: argContract?.address });
}

export const fetchSubjion = async (argContract: IArgContract, arg: { ids: string[], id: string }) => {
  await argContract?.contract.methods.subjion(arg.ids, arg.id).send({ from: argContract?.address });
}

export const fetchOutfit = async (argContract: IArgContract, arg: { value: any, setGoodsList: Dispatch<React.SetStateAction<any[]>> }) => {
  await argContract?.contract.methods.outfit(arg?.value.id, arg?.value.isOutfit).send({ from: argContract?.address });
  fetchGetGoodsInfo(argContract, { id: arg?.value.id, setGoodsList: arg?.setGoodsList })
}

export const fetchSetPMT721 = async (argContract: IArgContract) => {
  await argContract?.contract.methods.setPMT721("0xE13d961d6Fb3BADE2A64372360C348bD80C1075e").send({ from: argContract?.address });
}
import { Dispatch, useCallback } from "react";
import { IMerchandise } from "../pages/produced/components/Submit";
import { useLoading } from "../components/Loading";
import { message } from "antd";
import { cloneDeep, map } from "lodash";
import { IArgContract, usePixelsMetaverse } from "../pixels-metaverse";

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
  const { accounts, contract } = usePixelsMetaverse()
  const { closeDelayLoading, openLoading, closeLoading } = useLoading()

  return useCallback(async (arg?: any) => {
    if (!contract || !accounts) return
    try {
      !arg?.closeLoading && openLoading()
      fetch({ accounts, contract }, arg).then(() => {
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
  }, [contract, accounts, ...delay])
}

export const fetchUserInfo = async (argContract: IArgContract, arg: { address: string, setUserInfo: Dispatch<any> }) => {
  const info = await argContract?.contract?.methods.user(arg.address).call();
  arg.setUserInfo && arg.setUserInfo(info)
}

export const fetchRegister = async (argContract: IArgContract) => {
  await argContract?.contract.methods.register().send({ from: argContract?.accounts?.address });
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

export const fetchGetGoodsIdList = async (argContract: IArgContract, arg?: { setValue: Dispatch<React.SetStateAction<any[]>>, newNumber?: number }) => {
  console.log(argContract?.contract, "idList")
  const idList = await argContract?.contract?.methods.getGoodsList().call();
  console.log(idList)
  
  const len = idList.length || 0;
  if (arg?.newNumber === -1) {
    for (let i = len - 1; i >= 0; i--) {
      let item = await argContract?.contract?.methods.goods(Number(idList[i])).call()
      arg?.setValue && arg?.setValue((pre) => {
        if (i === len - 1) {
          return [item]
        }
        return [...pre, item]
      })
    }
  } else {
    for (let i = len - 1; i >= len - (arg?.newNumber || len); i--) {
      let item = await argContract?.contract?.methods.goods(Number(idList[i])).call()
      arg?.setValue && !arg.newNumber && arg?.setValue((pre) => ([...pre, item]))
      arg?.setValue && arg.newNumber && arg?.setValue((pre) => ([item, ...pre]))
    }
  }
}

export const fetchSetConfig = async (argContract: IArgContract, arg: { value: any }) => {
  await argContract?.contract.methods.setConfig(arg.value.bgColor, arg.value.gridColor, arg.value.withGrid).send({ from: argContract?.accounts?.address });
}

export const fetchApplication = async (argContract: IArgContract, arg: { name: string }) => {
  await argContract?.contract.methods.application(arg?.name).send({ from: argContract?.accounts?.address });
}

export const fetchPostGoods = async (argContract: IArgContract, arg: { value: IMerchandise }) => {
  await argContract?.contract.methods.postGoods(
    arg?.value?.name,
    arg?.value?.category,
    arg?.value?.data,
    String(Number(arg?.value?.price) * (10 ** 18)),
    Number(arg?.value?.amount),
    arg?.value?.bgColor
  ).send({ from: argContract?.accounts?.address });
}

export const fetchBuyGoods = async (argContract: IArgContract, arg: { id: number, price: number, setGoodsList: Dispatch<React.SetStateAction<any[]>> }) => {
  await argContract?.contract.methods.buyGoods(arg.id).send({ from: argContract?.accounts?.address, value: arg.price });
  fetchGetGoodsInfo(argContract, { id: arg?.id, setGoodsList: arg?.setGoodsList })
}

export const fetchOutfit = async (argContract: IArgContract, arg: { value: any, setGoodsList: Dispatch<React.SetStateAction<any[]>> }) => {
  await argContract?.contract.methods.outfit(arg?.value.id, arg?.value.isOutfit).send({ from: argContract?.accounts?.address });
  fetchGetGoodsInfo(argContract, { id: arg?.value.id, setGoodsList: arg?.setGoodsList })
}

export const fetchSetPMT721 = async (argContract: IArgContract) => {
  await argContract?.contract.methods.setPMT721("0xE13d961d6Fb3BADE2A64372360C348bD80C1075e").send({ from: argContract?.accounts?.address });
}
import { Dispatch, useCallback } from "react";
import { IMerchandise } from "../pages/produced/components/Submit";
import { useLoading } from "../components/Loading";
import { message } from "antd";
import { cloneDeep, every, findIndex, isEmpty, isUndefined, map } from "lodash";
import { usePixelsMetaverse } from "../pixels-metaverse";
import { useWeb3Info } from "./web3";
import { Contract } from 'web3-eth-contract';
import { MaterialItem } from "../components/Card";

export interface IArgContract { contract: any, accounts?: any, address?: any }

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
    if (!contract) return
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

export const fetchGetMaterialInfo = async (argContract: IArgContract, arg: { id: number, setGoodsList: Dispatch<React.SetStateAction<any[]>> }) => {
  const material = await argContract?.contract.methods.getMaterial(arg?.id).call();
  arg?.setGoodsList && arg?.setGoodsList((pre) => {
    const list = cloneDeep(pre)
    return map(list, item => {
      if (item?.material?.id === arg?.id) {
        return material
      }
      return item
    })
  })
}

export const fetchCollectList = async (argContract: IArgContract, arg: { address: string, setValue: Dispatch<React.SetStateAction<any[]>> }) => {
  const list = await argContract?.contract.methods.getCollection(arg?.address).call();
  arg?.setValue && arg?.setValue(list)
}

export const fetchGetMaterialLength = async (argContract: IArgContract, arg?: { setValue: Dispatch<React.SetStateAction<any>> }) => {
  const len = await argContract?.contract.methods.getMaterialLength().call();
  arg?.setValue && arg?.setValue(Number(len))
}

const arrayToObject = (item: MaterialItem) => {
  return {
    baseInfo: {
      category: item?.baseInfo?.category,
      data: item?.baseInfo?.data,
      decode: item?.baseInfo?.decode,
      name: item?.baseInfo?.name,
      userId: item?.baseInfo?.userId,
    },
    composes: item?.composes,
    material: {
      compose: item?.material?.compose,
      data: item?.material?.data,
      id: item?.material?.id,
      owner: item?.material?.owner,
      position: item?.material?.position,
      time: item?.material?.time,
      zIndex: item?.material?.zIndex
    },
    composeData: []
  }
}

export const fetchGetGoodsIdList = async (argContract: IArgContract, arg?: { setValue: Dispatch<React.SetStateAction<any[]>>, createAmount?: number, list: string[], burnID?: string }) => {
  const len = await argContract?.contract?.methods.getMaterialLength().call();
  if (arg?.list && !isUndefined(arg?.createAmount)) {
    const list = [...arg?.list]
    for (let i = 0; i < arg?.createAmount; i++) {
      list.push(String(len - i));
    }
    for (let i = 0; i < list?.length; i++) {
      let item = await argContract?.contract?.methods.getMaterial(list[i]).call()
      if (item?.material?.owner === "0x0000000000000000000000000000000000000000" && item?.material?.id === "0") continue
      if (!isEmpty(item?.composes) && every(item?.composes, ite => ite === "0")) continue
      const obj = arrayToObject(item)
      arg?.setValue && arg?.setValue((pre) => {
        const data = cloneDeep(pre) as MaterialItem[];
        const index = findIndex(data, ite => ite?.material?.id === list[i]);
        if (index >= 0) data[index] = obj;
        else data.unshift(obj)
        return data
      })
    }
  } else {
    for (let i = len; i >= 1; i--) {
      let item = await argContract?.contract?.methods.getMaterial(i).call()
      if (item?.material?.owner === "0x0000000000000000000000000000000000000000" && item?.material?.id === "0") continue
      if (!isEmpty(item?.composes) && every(item?.composes, ite => ite === "0")) continue
      const obj = arrayToObject(item)
      arg?.setValue && arg?.setValue((pre) => {
        if (i === len) {
          return [obj]
        }
        return [...pre, obj]
      })
    }
  }
  arg?.setValue && arg?.burnID && arg?.setValue((pre) => {
    const data = cloneDeep(pre) as MaterialItem[];
    const index = findIndex(data, ite => ite?.material?.id === arg?.burnID);
    data.splice(index, 1);
    return data
  })
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
  fetchGetMaterialInfo(argContract, { id: arg?.id, setGoodsList: arg?.setGoodsList })
}

export const fetchCollect = async (argContract: IArgContract, arg: { id: number, setCollectList: Dispatch<React.SetStateAction<any[]>> }) => {
  await argContract?.contract.methods.collect(arg.id).send({ from: argContract?.address });
  fetchCollectList(argContract, { address: argContract?.address, setValue: arg?.setCollectList })
}

export const fetchCancelCollect = async (argContract: IArgContract, arg: { id: number, index: number, setCollectList: Dispatch<React.SetStateAction<any[]>> }) => {
  await argContract?.contract.methods.cancelCollect(arg.id, arg?.index).send({ from: argContract?.address });
  fetchCollectList(argContract, { address: argContract?.address, setValue: arg?.setCollectList })
}

export const fetchCompose = async (argContract: IArgContract, arg: { ids: string[], name: string, category: string }) => {
  await argContract?.contract.methods.compose(arg.ids, arg.name, arg.category, "", "").send({ from: argContract?.address });
}

export const fetchCancelCompose = async (argContract: IArgContract, arg: { ids: string }) => {
  await argContract?.contract.methods.cancelCompose(arg.ids).send({ from: argContract?.address });
}

export const fetchSubjoin = async (argContract: IArgContract, arg: { ids: string, idList: string[] }) => {
  await argContract?.contract.methods.addition(arg.ids, arg.idList).send({ from: argContract?.address });
}

export const fetchSubtract = async (argContract: IArgContract, arg: { ids: string, id: string, index: number }) => {
  await argContract?.contract.methods.subtract(arg.ids, arg.id, arg?.index).send({ from: argContract?.address });
}

export const fetchSetUserConfig = async (argContract: IArgContract, arg: { role: string, id: string, other: number }) => {
  await argContract?.contract.methods.setConfig(arg.role, arg.id, arg?.other).send({ from: argContract?.address });
}

export const fetchOutfit = async (argContract: IArgContract, arg: { value: any, setGoodsList: Dispatch<React.SetStateAction<any[]>> }) => {
  await argContract?.contract.methods.outfit(arg?.value.id, arg?.value.isOutfit).send({ from: argContract?.address });
  fetchGetMaterialInfo(argContract, { id: arg?.value.id, setGoodsList: arg?.setGoodsList })
}

export const fetchSetPMT721 = async (argContract: IArgContract) => {
  await argContract?.contract.methods.setPMT721("0xE13d961d6Fb3BADE2A64372360C348bD80C1075e").send({ from: argContract?.address });
}
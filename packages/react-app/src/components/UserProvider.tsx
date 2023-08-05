import React, { useCallback, useMemo } from "react";
import { Dictionary, isEmpty, keyBy, map } from "lodash";
import { ReactNode, useContext, useEffect, useState } from "react";
import { createContext, Dispatch } from "react";
import { MaterialItem } from "./Card";
import { useContractRequest, useReadContractRequest, useWeb3Info } from "abi-to-request";
import { useLoading, useSmallLoading } from "./Loading";
import { QueryResult, useQuery } from "@apollo/client";
import {
  COMPOSE_LIST,
  MATERIAL_ALL_LIST,
  AVATER_LIST,
  MATERIAL_ADDRESS_LIST,
  MATERIAL_ADDRESS_ID_LIST,
  MATERIAL_ID_LIST,
  MATERIAL_LEN_LIST
} from "../gql";
import { currentID } from "../client/PMT721";
import { useQueryString } from "../helpers/utilities";
import { BigNumber } from "ethers";

export const UserInfoContext = createContext(
  {} as {
    userInfo: any;
    materialList: MaterialItem[];
    materialId?: number;
    getMaterials: QueryResult<any, {
      first: number;
      orderDirection: string;
      createID: string;
    }>;
    setMaterialId: Dispatch<React.SetStateAction<number | undefined>>;
    composeList: string[];
    setComposeList: Dispatch<React.SetStateAction<string[]>>;
    materialListObj: Dictionary<MaterialItem>;
    setSmallLoading: React.Dispatch<React.SetStateAction<boolean>>;
    SmallLoading: (props: {
      size: number;
      color?: string | undefined;
    }) => JSX.Element
  },
);

export const useUserInfo = () => useContext(UserInfoContext);

const convertedData = (item: any) => {
  return {
    composes: item?.composes || [],
    material: {
      id: item?.id,
      compose: item?.composed,
      time: "time",
      position: "position",
      zIndex: "zIndex",
      owner: item?.owner,
      data: item?.dataBytes
    },
    baseInfo: {
      data: item?.rawData,
      category: "category",
      decode: "decode",
      name: item?.config?.name,
      userId: "userId"
    },
    composeData: []
  } as MaterialItem
}

const useMaterialObj = (list: MaterialItem[]) => {
  return useMemo(() => {
    if (isEmpty(list)) return {} as Dictionary<MaterialItem>
    const obj: Dictionary<MaterialItem> = keyBy(list, (item: MaterialItem) => item?.material?.id);
    const getData = (items: MaterialItem) => {
      const data: MaterialItem[] = []
      const fun = (item: MaterialItem) => {
        if (item?.composes?.length === 0) return
        map(item?.composes, (ite: number) => {
          if (obj[ite]) data.push(obj[ite])
          fun(obj[ite])
        })
      }
      fun(items)
      return data
    }
    map(list, (item: MaterialItem) => {
      const data = getData(item)
      if (isEmpty(data)) obj[item?.material?.id].composeData = [item]
      obj[item?.material?.id].composeData = data;
    })
    return obj as Dictionary<MaterialItem>
  }, [list])
}

const useMaterialAndCompose = (data: any[]) => {
  return useMemo(() => {
    if (!data?.length) return {
      list: [],
      composes: []
    } as { list: MaterialItem[], composes: string[] }

    const composes: string[] = []
    const list = map(data, item => {
      composes.push(...(item?.composes || []))
      return convertedData(item)
    })
    return {
      list,
      composes
    } as { list: MaterialItem[], composes: string[] }
  }, [data])
}

const useComposeList = (composes: string[]) => {
  return useQuery(COMPOSE_LIST, {
    variables: { ids: composes },
    skip: composes?.length === 0
  })
}

const useGetData = (materials: any[]) => {
  const { list, composes } = useMaterialAndCompose(materials);
  const getComposes = useComposeList(composes);

  const mergeList = useMemo(() => {
    if (!list) return []
    return [...list, ...map(getComposes?.data?.materials, item => convertedData(item))]
  }, [getComposes?.data?.materials, list]);

  const materialObj = useMaterialObj(mergeList);

  return [list, materialObj] as const
}

export type TQuery = {
  owner?: string,
  id?: string[],
  createID: string,
  pollInterval?: number
}

//没找到条件合并查询的例子和文档，如果后续找到了，则直接更换回来。
const useQueryMaterials = (variables: TQuery) => {
  const [type, setType] = useState<string>("all")
  useEffect(() => {
    if (variables?.owner && !variables?.id) setType("address");
    else if (variables?.id && !variables?.owner) setType("id");
    else if (variables?.id && variables?.owner) setType("address-id");
    else setType("all");
  }, [variables?.owner, variables?.id])

  const getAllMaterials = useQuery(MATERIAL_ALL_LIST, {
    variables: {
      first: 10,
      orderDirection: 'desc',
      createID: variables?.createID
    },
    skip: type !== "all" || !variables?.createID,
    pollInterval: variables?.pollInterval || 0
  })

  const getAddressMaterials = useQuery(MATERIAL_ADDRESS_LIST, {
    variables: {
      first: 10,
      orderDirection: 'desc',
      createID: variables?.createID,
      owner: variables?.owner
    },
    skip: type !== "address" || !variables?.createID,
    pollInterval: variables?.pollInterval || 0
  })

  const getIdMaterials = useQuery(MATERIAL_ID_LIST, {
    variables: {
      first: 10,
      orderDirection: 'desc',
      createID: variables?.createID,
      id: variables?.id
    },
    skip: type !== "id" || !variables?.createID,
    pollInterval: variables?.pollInterval || 0
  })

  const getAddressAndIdMaterials = useQuery(MATERIAL_ADDRESS_ID_LIST, {
    variables: {
      first: 10,
      orderDirection: 'desc',
      createID: variables?.createID,
      owner: variables?.owner,
      id: variables?.id
    },
    skip: type !== "address-id" || !variables?.createID,
    pollInterval: variables?.pollInterval || 0
  })

  const getMaterials = useMemo(() => {
    if (variables?.owner && !variables?.id) return getAddressMaterials;
    if (variables?.id && !variables?.owner) return getIdMaterials;
    if (variables?.id && variables?.owner) return getAddressAndIdMaterials;
    else return getAllMaterials;
  }, [variables, getAllMaterials, getAddressMaterials, getIdMaterials, getAddressAndIdMaterials])

  return getMaterials
}

export const useCreateID = () => {
  const getMaterialLens = useQuery(MATERIAL_LEN_LIST);
  const tokenID = useMemo(() => getMaterialLens?.data?.materials ? getMaterialLens?.data?.materials[0]?.id : {}, [getMaterialLens?.data?.materials])
  const { searchString } = useQueryString();

  return useMemo(() => {
    const createID = searchString?.createID ? Number(searchString?.createID) + 1 : (tokenID ? Number(tokenID) + 1 : tokenID)
    return createID ? String(createID) : ""
  }, [searchString, tokenID])
}

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [materialId, setMaterialId] = useState<number | undefined>();
  const [composeList, setComposeList] = React.useState<string[]>([])
  const { openLoading, closeDelayLoading } = useLoading();
  const { address, chainId } = useWeb3Info();
  const { searchString } = useQueryString();
  const { contracts } = useContractRequest()
  const { setSmallLoading, SmallLoading } = useSmallLoading()

  //const str = window?.location?.hash?.split("?")
  //const searchInit = useMemo(() => str[1] ? getSearchObj(window?.location?.hash?.split("?")[1]) : {}, [])
  //console.log(searchInit)

  const addresss = searchString?.address || address
  const getAvater = useQuery(AVATER_LIST, { variables: { address: addresss?.toLowerCase() }, skip: !addresss });
  const userInfo = useMemo(() => getAvater?.data?.avaters ? getAvater?.data?.avaters[0]?.avater : {}, [getAvater?.data?.avaters])
  const createID = useCreateID();

  const getMaterials = useQueryMaterials({
    createID,
    owner: searchString?.owner || "",
    id: searchString?.id ? searchString?.id?.split(",") : undefined
  })

  useEffect(() => {
    if (getMaterials?.loading) openLoading()
    else closeDelayLoading()
  }, [getMaterials?.loading])

  const [materialList, materialListObj] = useGetData(getMaterials?.data?.materials);

  useEffect(() => {
    getMaterials?.stopPolling()
    setSmallLoading(false)
  }, [materialList])

  useEffect(() => {
    const contract = contracts["PixelsMetaverse"];
    (contract as any)?.on("AvaterEvent", (owner: string) => {
      if (owner?.toLowerCase() === address?.toLowerCase()) {
        getAvater.startPolling(1000);
        setSmallLoading(true)
      }
    })
  }, [contracts, address])

  useEffect(() => {
    const contract = contracts["PixelsMetaverse"]
    let timer: any = null;
    (contract as any)?.on("MaterialEvent", (_: string, id: BigNumber) => {
      getMaterials.refetch({
        ...getMaterials.variables,
        createID: id?.add(1)?.toString()
      })
      if (timer) {
        clearTimeout(timer)
        getMaterials.stopPolling();
      }
      timer = setTimeout(() => {
        getMaterials.startPolling(1000);
        setSmallLoading(true)
      }, 1000)
    })
    return () => {
      clearTimeout(timer)
    }
  }, [contracts])

  useEffect(() => {
    const contract = contracts["PixelsMetaverse"];
    let timer: any = null;
    (contract as any)?.on("ComposeEvent", (_: string, id: string, ids: string, isAdd: boolean) => {
      if (!getMaterials.variables?.createID || isAdd) return
      getMaterials.refetch()
      if (timer) {
        clearTimeout(timer)
        getMaterials.stopPolling();
      }
      timer = setTimeout(() => {
        getMaterials.startPolling(1000);
      }, 1000)
    })
    return () => {
      clearTimeout(timer)
    }
  }, [contracts, getMaterials.variables])

  useEffect(() => {
    getAvater?.stopPolling()
    setSmallLoading(false)
  }, [getAvater?.data?.avaters])

  return (
    <UserInfoContext.Provider value={{
      getMaterials,
      userInfo,
      materialList,
      materialId,
      setMaterialId,
      composeList,
      setComposeList,
      materialListObj,
      setSmallLoading,
      SmallLoading
    } as any}>
      {children}
    </UserInfoContext.Provider>
  )
}
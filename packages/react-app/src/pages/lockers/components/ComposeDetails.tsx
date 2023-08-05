import React, { Dispatch, InputHTMLAttributes, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Select, message, Tabs, Button, Radio } from 'antd';
import { isEmpty, map } from 'lodash';
import { useUserInfo } from '../../../components/UserProvider';
import { PixelsMetaverseImgByPositionData } from '../../../pixels-metaverse';
import { ClearIcon } from './SearchQuery';
import { MaterialItem } from '../../../components/Card';
import { categoryData, IMerchandise } from '../../produced/components/Submit';
import { useRequest } from 'abi-to-request';
import { addition, compose } from '../../../client/PixelsMetaverse';
const { Option } = Select;
const { TabPane } = Tabs;

interface ICompose {
  singles: string[],
  composes: string[],
  composesData: MaterialItem[],
}

const Label = ({ children, noNeed }: { children: ReactNode, noNeed?: boolean }) => {
  return <div className="pd-4 mb-1">{children}{!noNeed && <span className="text-red-500">*</span>}</div>
}

export const ComposeDetails = ({ setIsModalVisible }: { setIsModalVisible: Dispatch<React.SetStateAction<boolean>> }) => {
  const [type, setType] = useState<ICompose>()
  const [tab, setTab] = useState<string>("new")
  const [value, setValue] = React.useState<string>("-1");
  const { composeList, setComposeList, materialListObj, userInfo, setSmallLoading } = useUserInfo()
  const [{ name }, setMerchandies] = React.useState<IMerchandise>({ name: "", num: "" })

  const [composeFun] = useRequest(compose, {
    isGlobalTransactionHookValid: true,
    onSuccess: () => {
      setIsModalVisible(false)
      setSmallLoading(true);
    },
    onTransactionSuccess: () => {
      message.success("合成成功！正在获取链上新数据...")
      setComposeList && setComposeList([])
    }
  }, [])

  const [join] = useRequest(addition, {
    isGlobalTransactionHookValid: true,
    onSuccess: () => {
      setIsModalVisible(false)
      setSmallLoading(true);
    },
    onTransactionSuccess: () => {
      message.success(`合成至 ${value} 成功！正在获取链上新数据...`)
      setComposeList && setComposeList([])
      setIsModalVisible(false)
    }
  }, [value, composeList])

  useEffect(() => {
    if (isEmpty(composeList) || isEmpty(materialListObj)) return
    const type: ICompose = {
      singles: [],
      composes: [],
      composesData: []
    }
    map(composeList, item => {
      if (isEmpty(materialListObj[item]?.composes)) {
        type?.singles.push(item)
        type?.composesData.push(materialListObj[item]);
      } else {
        type?.composes.push(item)
        type.composesData = [...type?.composesData, ...materialListObj[item]?.composeData];
      }
    })
    setType(type)
  }, [composeList, materialListObj])

  const data = useMemo(() => {
    if (isEmpty(type?.composesData)) return []
    return map(type?.composesData, it => ({ ...it, data: it?.baseInfo?.data } as any))
  }, [type?.composesData])

  const checkData = useCallback(() => {
    if (!name) {
      message.warn("请输入物品名称");
      return;
    }
    return true;
  }, [name]);

  const isUser = useMemo(() => userInfo?.id !== "0", [userInfo]);

  return (
    <div className="rounded-md text-black text-opacity-70 bg-white bg-opacity-10 flex items-center justify-between" style={{ height: 400 }}>
      <PixelsMetaverseImgByPositionData
        data={{ positions: "", materialData: data }}
        size={400}
        style={{ background: "#323945", cursor: "pointer", boxShadow: "0px 0px 5px rgba(225,225,225,0.3)", marginRight: 20 }} />
      <div className="flex flex-col justify-between h-full">
        {
          isEmpty(type?.composes)
            ? <CreateMaterial name={name} setMerchandies={setMerchandies} />
            : <Tabs defaultActiveKey="1" centered onChange={(key) => {
              setTab(key)
            }}>
              <TabPane tab="合并为新的物品" key="new">
                <CreateMaterial name={name} setMerchandies={setMerchandies} />
              </TabPane>
              <TabPane tab="合并至已存在的物品" key="exist">
                <MergeMaterial composes={type?.composes} value={value} setValue={setValue} />
              </TabPane>
            </Tabs>
        }
        <Button
          type="primary"
          size="large" onClick={() => {
            if (!isUser) return
            if (tab === "new") {
              const is = checkData()
              if (!is) return
            }
            if (tab === "exist") {
              if (!isNaN(Number(value)) && Number(value) <= 0) {
                message.warn("请选择你要合并到的目标ID");
                return
              }
            }

            if (tab === "new") {
              composeFun({ idList: composeList, name, decode: "", time: "", position: "", zIndex: "" })
            } else {
              const idList = [...composeList];
              idList.splice(idList?.indexOf(value), 1);
              join({ ids: Number(value), idList })
            }
          }}>确定</Button>
      </div>
    </div >
  );
};

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className="pl-2 inputPlaceholder outline-none :focus:outline-none h-10 bg-black bg-opacity-10 rounded-sm w-full"
      {...props}
      placeholder={`请输入${props.placeholder}`}
    />
  )
}

export const CreateMaterial = ({
  name,
  category,
  setMerchandies
}: {
  name: string;
  category?: string,
  setMerchandies: Dispatch<React.SetStateAction<IMerchandise>>
}) => {
  return (
    <div id="create-material" className="overflow-y-scroll" style={{ width: 400 }}>
      <Label>名称</Label>
      <Input value={name} placeholder="物品名称" maxLength={15} onChange={(e) => setMerchandies((pre) => ({ ...pre, name: e.target.value }))} />
      <div className="h-8"></div>
      {/* <Label>种类</Label>
      <Select
        className="select outline-none :focus:outline-none h-10 bg-black bg-opacity-10 rounded w-full"
        bordered={false}
        dropdownClassName="bg-gray-300"
        size="large"
        allowClear
        style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.7) !important" }}
        value={category}
        placeholder="请选择种类"
        optionFilterProp="children"
        onChange={(e: string) => { setMerchandies((pre) => ({ ...pre, category: e })) }}
        clearIcon={ClearIcon}
      >
        {map(categoryData, item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
      </Select> */}
    </div>
  )
}

export const MergeMaterial = ({ composes, value, setValue }: { composes?: string[], value?: string, setValue: Dispatch<React.SetStateAction<string>> }) => {
  const { materialListObj } = useUserInfo()

  return <div className="overflow-y-scroll" style={{ width: 400, height: 280 }}>
    <Radio.Group onChange={(e) => {
      setValue(e.target.value)
    }} value={value}>
      {map(composes, item => {
        return (
          <Radio value={item} key={item} style={{ marginTop: 20 }}>
            <div className="flex items-center">
              <div className="inline-block" style={{ width: 50 }}>ID:{item} </div>
              <div className="ellipsis inline-block" style={{ width: 300 }}>&emsp;{materialListObj[item]?.baseInfo?.name}</div>
            </div>
          </Radio>
        )
      })}
    </Radio.Group>
  </div>
}
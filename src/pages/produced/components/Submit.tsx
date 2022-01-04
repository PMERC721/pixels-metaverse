import { ChangeEvent, InputHTMLAttributes, ReactNode, useCallback, useMemo, useState } from 'react';
import { Tooltip, Select, message, Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Dictionary, keys, map } from 'lodash';
import { useUserInfo } from '../../../components/UserProvider';
import { usePixelsMetaverseHandleImg } from '../../../pixels-metaverse';
import { fetchGetGoodsIdList, fetchMake, useRequest } from '../../../hook/api';
import { useWeb3Info } from '../../../hook/web3';
import { ClearIcon } from '../../lockers/components/SearchQuery';
import React from 'react';
const { Option } = Select;

export const Label = ({ children, noNeed }: { children: ReactNode, noNeed?: boolean }) => {
  return <div className="pt-4 mb-1">{children}{!noNeed && <span className="text-red-500">*</span>}</div>
}

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className="pl-2 inputPlaceholder outline-none :focus:outline-none h-10 bg-white bg-opacity-20 rounded-sm w-full"
      {...props}
      placeholder={`请输入${props.placeholder}`}
    />
  )
}

export const mustNum = (e: ChangeEvent<HTMLInputElement>) => {
  const val = Number(e?.target?.value);
  if (Number(e.target.value) >= 0 && !isNaN(val)) {
    return e.target.value
  }
  if (isNaN(parseFloat(e.target.value))) {
    return ""
  }
  return `${parseFloat(e.target.value)}`
}

export const categoryData = [
  {
    label: "脸",
    value: "face"
  }, {
    label: "头发",
    value: "hair"
  }, {
    label: "眼睛",
    value: "eye"
  }, {
    label: "鼻子",
    value: "nose"
  }, {
    label: "嘴巴",
    value: "mouth"
  }, {
    label: "耳朵",
    value: "ear"
  }, {
    label: "脖子",
    value: "neck"
  }, {
    label: "胡子",
    value: "beard"
  }, {
    label: "饰品",
    value: "accessories"
  }, {
    label: "其他",
    value: "other"
  }
]

export interface IMerchandise {
  name: string;
  category?: string,
  amount: string;
  data?: string;
  price: string;
  weight?: string;
  bgColor?: string
}

export const Submit = () => {
  const { positionsArr, setPositionsArr, config, dealClick: { value, clear } } = usePixelsMetaverseHandleImg()
  const [{
    name,
    category,
    amount,
    price,
    weight,
  }, setMerchandies] = React.useState<IMerchandise>({
    name: "",
    category: undefined,
    amount: "",
    price: "",
    weight: "",
  })
  const [positionData, setPostionData] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { address: addresss } = useWeb3Info()
  const { userInfo, setGoodsList, register } = useUserInfo()
  const address = addresss
  const getGoodsIdList = useRequest(fetchGetGoodsIdList)

  const postGoods = useRequest(fetchMake, {
    onSuccess: () => {
      message.success("物品制造成功！")
      getGoodsIdList({ setValue: setGoodsList, createAmount: Number(amount) })
      setIsModalVisible(false)
      setMerchandies({
        name: "",
        category: "",
        amount: "",
        price: "",
        weight: "",
      })
      clear()
      setPositionsArr([])
    },
    onFail: () => {
      setIsModalVisible(false)
    }
  }, [
    address,
    name,
    category,
    amount,
    price,
    weight,
    config?.bgColor,
    setGoodsList
  ])

  const min = useMemo(() => Math.min(...positionsArr), [positionsArr])

  const handleOk = useCallback(() => {
    const nftData = `${positionData}${min}`
    const data = {
      name,
      category,
      amount,
      data: nftData,
      decode: ""
    }
    postGoods({
      value: data
    })
    setIsModalVisible(false)
  }, [positionData, min]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const colorsObj = useMemo(() => {
    const colors: Dictionary<number[]> = {}
    map(positionsArr, item => {
      colors[value[item]] ? colors[value[item]].push(item) : colors[value[item]] = [item]
    })
    return colors
  }, [value, positionsArr])

  const getPositionStr = useCallback(() => {
    let str = ""
    let min = Math.min(...positionsArr)
    const colorsArrBySort = keys(colorsObj).sort((a, b) => parseInt(a.slice(1), 16) - parseInt(b.slice(1), 16))
    for (let i = 0; i < colorsArrBySort.length; i++) {
      //再对颜色排个序 小的放前面
      const position = map(colorsObj[colorsArrBySort[i]], ite => (ite - min).toString(36)).join("|")
      str += `${parseInt(colorsArrBySort[i].slice(1), 16).toString(36)}-${position}-`
    }
    return `${str}`
  }, [value, positionsArr, colorsObj, min])

  const checkData = useCallback(() => {
    if (!name) {
      message.warn("请输入物品名称");
      return;
    }
    if (!category) {
      message.warn("请选择物品种类");
      return;
    }
    if (!amount) {
      message.warn("请输入物品数量");
      return;
    }
    return true;
  }, [name, category, amount, price]);

  const isUser = useMemo(() => userInfo?.id !== "0", [userInfo]);

  return (
    <div className="rounded-md text-gray-300 w-72 p-4 bg-white bg-opacity-10">
      <div className="flex items-center text-2xl text-gray-300">制作虚拟物品&nbsp;
          <Tooltip placement="right" className="cursor-pointer" title={`建议各部位分开创建，组合性更强。`} color="#29303d">
          <ExclamationCircleOutlined />
        </Tooltip>
      </div>
      <div className="overflow-y-scroll" style={{ height: 480 }}>
        <Label>名称</Label>
        <Input value={name} placeholder="物品名称" maxLength={15} onChange={(e) => setMerchandies((pre) => ({ ...pre, name: e.target.value }))} />
        <Label>种类</Label>
        <Select
          className="select outline-none :focus:outline-none h-10 bg-white bg-opacity-20 rounded w-full"
          bordered={false}
          dropdownClassName="bg-gray-300"
          size="large"
          allowClear
          style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.1) !important" }}
          value={category}
          placeholder="请选择种类"
          optionFilterProp="children"
          onChange={(e: string) => { setMerchandies((pre) => ({ ...pre, category: e })) }}
          clearIcon={ClearIcon}
        >
          {map(categoryData, item => <Option key={item.value} value={item.value}>{item.label}</Option>)}
        </Select>
        <Label>数量(最多可制作99个)</Label>
        <Input value={amount} placeholder="物品数量" maxLength={2} onChange={(e) => setMerchandies((pre) => ({ ...pre, amount: mustNum(e) }))} />
        {/* <Label noNeed>开始时间(毫秒)</Label>
        <Input value={amount} placeholder="物品数量" maxLength={1} onChange={(e) => setMerchandies((pre) => ({ ...pre, amount: mustNum(e) }))} />
        <div className="flex items-center mt-4 mb-1">
          <div>层级</div>
          <Tooltip placement="top" className="cursor-pointer" title={`当前绘制的物品显示的层级，越高越显示在外层`} color="#29303d">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <Input value={amount} placeholder="物品数量" maxLength={1} onChange={(e) => setMerchandies((pre) => ({ ...pre, amount: mustNum(e) }))} />
        <div className="flex items-center mt-4 mb-1">
          <div>本体URL</div>
          <Tooltip placement="top" className="cursor-pointer" title={`当前绘制的图片的URL地址`} color="#29303d">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <Input value={weight} placeholder="本体URL地址" maxLength={10} onChange={(e) => setMerchandies((pre) => ({ ...pre, weight: mustNum(e) }))} />
         */}<Button
          type="primary"
          size="large"
          className="mt-6 w-full rounded"
          style={{ cursor: isUser ? "pointer" : "no-drop" }}
          onClick={() => {
            if (!isUser) return
            const is = checkData()
            if (!is) return
            const positionData = getPositionStr()
            setPostionData(positionData)
            if (!positionData) {
              message.warn("请绘制虚拟物品");
              return;
            }
            setIsModalVisible(true);
          }}
        >提交</Button>
        {!isUser && <div className="mt-4">你还不是宇宙创始居民，请
        <span className="text-red-500 cursor-pointer" onClick={register}>激活</span>自己的元宇宙身份！</div>}
      </div>

      <Modal
        title="是否发布物品"
        okText={positionData?.length >= 64 ? "不用担心，硬核提交" : "确认"}
        cancelText="取消"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>是否确认发布该物品？</p>
        <p>{positionData?.length >= 50 && "当前数据量较大，可能消耗的GAS较多，且有可能提交不成功，请问是否继续提交数据？"}</p>
      </Modal>
    </div >
  );
};
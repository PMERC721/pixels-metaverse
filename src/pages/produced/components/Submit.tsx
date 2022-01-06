import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { Tooltip, Select, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Dictionary, isEmpty, keys, map } from 'lodash';
import { useUserInfo } from '../../../components/UserProvider';
import { fetchUserInfo, usePixelsMetaverseContract, usePixelsMetaverseHandleImg } from '../../../pixels-metaverse';
import { fetchApplication, fetchGetGoodsIdList, fetchPostGoods, fetchRegister, useRequest } from '../../../helpers/api';
const { Option } = Select;

const Label = ({ children }: { children: ReactNode }) => {
  return <div className="pt-4">{children}<span className="text-red-500">&nbsp;*</span></div>
}

const mustNum = (e: ChangeEvent<HTMLInputElement>) => {
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
  category: string,
  amount: string;
  data?: string;
  price: string;
  weight?: string;
  bgColor?: string
}

export const Submin = () => {
  const { positionsArr, setPositionsArr, config, dealClick: { value, clear } } = usePixelsMetaverseHandleImg()
  const [{
    name,
    category,
    amount,
    price,
    weight,
  }, setMerchandies] = useState<IMerchandise>({
    name: "",
    category: "",
    amount: "",
    price: "",
    weight: "",
  })
  const [positionData, setPostionData] = useState("")
  const [shopName, setShopName] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { accounts } = usePixelsMetaverseContract()
  const { userInfo, setUserInfo, setGoodsList } = useUserInfo()
  const address = accounts?.address
  const getUserInfo = useRequest(fetchUserInfo)
  const getGoodsIdList = useRequest(fetchGetGoodsIdList)

  const getInfo = () => {
    if (isEmpty(address)) return
    getUserInfo({ address, setUserInfo })
  }

  const application = useRequest(fetchApplication, {
    onSuccess: () => {
      message.success("入驻成功！")
      getInfo()
    }
  }, [address])

  const postGoods = useRequest(fetchPostGoods, {
    onSuccess: () => {
      message.success("商品发布成功！")
      getGoodsIdList({ setValue: setGoodsList, newNumber: Number(amount) })
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

  const register = useRequest(fetchRegister, {
    onSuccess: () => {
      getInfo()
    }
  }, [address])

  const min = useMemo(() => Math.min(...positionsArr), [positionsArr])

  const handleOk = useCallback(() => {
    const nftData = `${positionData}${min}`
    const data = {
      name,
      category,
      amount,
      price,
      weight,
      data: nftData,
      bgColor: config?.bgColor || ""
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
      message.warn("请输入商品名称");
      return;
    }
    if (!category) {
      message.warn("请选择商品种类");
      return;
    }
    if (!amount) {
      message.warn("请输入商品数量");
      return;
    }
    if (!price) {
      message.warn("请输入商品价格");
      return;
    }
    return true;
  }, [name, category, amount, price]);

  return (
    <div className="rounded-md text-gray-300"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        overflowY: "auto",
        width: 300,
        padding: 20
      }}>
      <div className="flex items-center text-2xl text-gray-300">发布商品&nbsp;
          <Tooltip placement="right" className="cursor-pointer" title={`建议各部位分开创建，组合性更强。`} color="#29303d">
          <ExclamationCircleOutlined />
        </Tooltip>
      </div>
      { !userInfo?.account?.includes("0000000000000000000000000") && userInfo?.isMerchant ? <div>
        <Label>商品名称</Label>
        <input
          className="search p-2 mt-1 pl-3 shangping"
          style={{ width: "calc(300px - 40px)", background: "rgba(255, 255, 255, 0.2)", borderRadius: 4 }}
          placeholder="请输入商品名称"
          value={name}
          maxLength={15}
          onChange={(e) => { setMerchandies((pre) => ({ ...pre, name: e.target.value })) }}
        />
        <Label>商品种类</Label>
        <Select
          className="search select"
          bordered={false}
          dropdownClassName="bg-gray-300"
          size="large"
          style={{
            width: "calc(300px - 40px)",
            background: "rgba(255, 255, 255, 0.2)",
            height: 40,
            outline: "none", borderRadius: 4,
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.1) !important",
            paddingLeft: 0
          }}
          value={category}
          placeholder="请选择商品种类"
          optionFilterProp="children"
          onChange={(e: string) => { setMerchandies((pre) => ({ ...pre, category: e })) }}
        >
          {
            map(categoryData, item => <Option key={item.value} value={item.value}>{item.label}</Option>)
          }
        </Select>
        <Label>商品数量(最多可发行9个)</Label>
        <input
          className="search p-2 mt-1 pl-3 shangping"
          style={{ width: "calc(300px - 40px)", background: "rgba(255, 255, 255, 0.2)", borderRadius: 4 }}
          placeholder="请输入商品数量"
          value={amount}
          maxLength={1}
          onChange={(e) => { setMerchandies((pre) => ({ ...pre, amount: mustNum(e) })) }}
        />
        <Label>商品价格(ETH)</Label>
        <input
          className="search p-2 mt-1 pl-3 shangping"
          style={{ width: "calc(300px - 40px)", background: "rgba(255, 255, 255, 0.2)", borderRadius: 4 }}
          placeholder="请输入商品价格"
          value={price}
          maxLength={5}
          onChange={(e) => { setMerchandies((pre) => ({ ...pre, price: mustNum(e) })) }}
        />
        <div className="flex items-center mt-4 shangping">
          <div>商品权重</div>
          <Tooltip placement="top" className="cursor-pointer" title={`商品权重指当前商品在商家自己的商店中的排名，权重越高排名越靠前。`} color="#29303d">
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <input
          className="search p-2 mt-1 pl-3 shangping"
          style={{ width: "calc(300px - 40px)", background: "rgba(255, 255, 255, 0.2)", borderRadius: 4 }}
          placeholder="请输入商品权重"
          value={weight}
          maxLength={10}
          onChange={(e) => { setMerchandies((pre) => ({ ...pre, weight: mustNum(e) })) }}
        />
        <div className="flex justify-center items-center h-10 mt-6 text-white cursor-pointer bg-red-500" style={{ width: "100%", borderRadius: 4 }}
          onClick={() => {
            const is = checkData()
            if (!is) return
            const positionData = getPositionStr()
            setPostionData(positionData)
            if (!positionData) {
              message.warn("请绘制商品");
              return;
            }
            setIsModalVisible(true);
          }}
        >发布</div>
      </div> : <div>
        <Label>店铺名称</Label>
        <input
          className="search p-2 mt-1 pl-3 shangping"
          style={{ width: "calc(300px - 40px)", background: "rgba(255, 255, 255, 0.2)", borderRadius: 4 }}
          placeholder="请输入店铺名称"
          value={shopName}
          maxLength={15}
          onChange={(e) => { setShopName(e.target.value) }}
        />
        <button className="flex justify-center items-center h-10 mt-6 text-white cursor-pointer bg-red-500" style={{ width: "100%", borderRadius: 4, cursor: userInfo?.account?.includes("0000000000000000000000000") ? "no-drop" : "pointer" }}
          onClick={() => {
            if (!shopName) {
              message.warn("请输入店铺名称");
              return;
            }
            application({
              name: shopName
            })
          }}
          disabled={userInfo?.account?.includes("0000000000000000000000000")}
        >申请入驻</button>
        {userInfo?.account?.includes("0000000000000000000000000") && <div className="mt-4">你还不是宇宙创始居民，请
        <span className="text-red-500 cursor-pointer" onClick={() => {
            register()
          }}>激活</span>自己的元宇宙身份！</div>}
      </div>}

      <Modal title="是否发布商品" okText={positionData?.length >= 64 ? "资产多，我不担心，硬核提交" : "确认"} cancelText="取消" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>是否确认发布该商品？</p>
        <p>{positionData?.length >= 50 && "当前数据量较大，可能消耗的GAS较多，且有可能提交不成功，请问是否继续提交数据？"}</p>
      </Modal>
    </div >
  );
};
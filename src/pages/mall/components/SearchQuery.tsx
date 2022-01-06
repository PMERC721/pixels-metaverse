import React, { Dispatch, useEffect, useMemo, useState } from "react";
import { Dictionary, filter, groupBy, keys, map, orderBy } from "lodash";
import { Select } from "antd";
import { useUserInfo } from "../../../components/UserProvider";
import { categoryData } from "../../produced/components/Submit";
const { Option } = Select;

export const SearchQuery = ({ setData }: { setData: Dispatch<React.SetStateAction<any[]>> }) => {
  const { goodsList } = useUserInfo()
  const [{
    sort,
    owner,
    sale,
    category
  }, setList] = useState<Dictionary<any>>({
    sort: "",
    owner: "",
    sale: "",
    category: ""
  })

  const onSearch = (val: any) => {
    setList((pre) => ({ ...pre, owner: val }))
  }

  const shopList = useMemo(() => {
    return groupBy(goodsList, item => item?.owner)
  }, [goodsList])

  const goodsCatagoryList = useMemo(() => {
    return groupBy(goodsList, item => item?.category)
  }, [goodsList])

  const saleList = useMemo(() => {
    return groupBy(goodsList, item => item?.isSale)
  }, [goodsList])

  const sortList = [
    {
      label: "按时间降序",
      value: "id-desc",
    },
    {
      label: "按时间升序",
      value: "id-asc",
    },
    {
      label: "按金额降序",
      value: "price-desc",
    },
    {
      label: "按金额升序",
      value: "price-asc",
    },
  ]

  useEffect(() => {
    const ownerList = owner ? filter(goodsList, item => item?.owner === owner) : goodsList
    const categoryList = category ? filter(ownerList, item => item?.category === category) : ownerList
    const saleList = sale ? filter(categoryList, item => String(item?.isSale) === sale) : categoryList
    let sortList;
    if (sort) {
      sortList = orderBy(saleList, [sort?.split("-")[0]], [sort?.split("-")[1]]);
    } else {
      sortList = saleList
    }
    setData(sortList)
  }, [goodsList, owner, category, sale, sort])

  return (
    <div className="flex justify-between items-center">
      <Select
        showSearch
        style={{ width: 330 }}
        allowClear
        placeholder="选择地址"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, owner: val }))
        }}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {map(keys(shopList), item => <Option key={item} value={item}>{item}</Option>)}
      </Select>
      <Select
        style={{ width: 150, marginLeft: 20 }}
        allowClear
        placeholder="选择商品种类"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, category: val }))
        }}
      >
        {map(keys(goodsCatagoryList), item => <Option key={item} value={item}>{filter(categoryData, ite => ite.value === item)[0]?.label}</Option>)}
      </Select>
      <Select
        style={{ width: 150, marginLeft: 20 }}
        allowClear
        placeholder="选择是否出售"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sale: val }))
        }}
      >
        {map(keys(saleList), item => <Option key={item} value={item}>{item === "true" ? "未出售" : "已出售"}</Option>)}
      </Select>
      <Select
        style={{ width: 200, marginLeft: 20 }}
        allowClear
        placeholder="选择排序"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sort: val }))
        }}
      >
        {map(sortList, item => <Option key={item.value} value={item?.value}>{item?.label}</Option>)}
      </Select>
    </div>
  )
}
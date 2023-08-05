import { useState } from "react";
import { map } from "lodash";
import { Button, Input, Modal } from "antd";
import { useUserInfo } from "../../../components/UserProvider";
import { CloseSquareOutlined } from "@ant-design/icons";
import { ComposeDetails } from "./ComposeDetails";
import { useQueryString } from "../../../helpers/utilities";

export const ClearIcon = () => <div className="relative bg-white bg-opacity-10"><CloseSquareOutlined className="absolute" style={{ top: -2, left: -2, fontSize: 16 }} /></div>

export const SearchQuery = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { composeList } = useUserInfo();
  const { searchString, setSearchString } = useQueryString();
  const [{
    id,
    owner
  }, setFilter] = useState({
    owner: searchString?.owner || "",
    id: searchString?.id || "",
  })

  const query = ()=>{
    const data = {
      ...searchString,
      id: id.trim() ? id?.split(",") : undefined,
      owner: owner.trim() || undefined,
      createID: ""
    }
    setSearchString(data)
  }

  return (
    <div className="flex justify-between items-center">
      <Button
        type="primary"
        disabled={composeList?.length < 2}
        onClick={() => { setIsModalVisible(true); }}
      >一键合成</Button>
      <Modal
        title="合成虚拟物品"
        okText={"合成"}
        cancelText="取消"
        width={1000}
        visible={isModalVisible}
        footer={null}
        onCancel={() => { setIsModalVisible(false); }}
      >
        <ComposeDetails setIsModalVisible={setIsModalVisible} />
      </Modal>
      <Input
        style={{ width: 350, marginLeft: 10 }}
        allowClear
        placeholder="所有者地址"
        value={owner}
        onPressEnter={query}
        onChange={(val) => {
          setFilter((pre) => ({ ...pre, owner: val?.target?.value?.trim() }))
        }}
      >
      </Input>
      <Input
        style={{ width: 350, marginLeft: 10, marginRight: 10 }}
        allowClear
        placeholder="物品ID，查询多个ID请用英文逗号隔开"
        value={id}
        onPressEnter={query}
        onChange={(val) => {
          const value = val?.target?.value
          if (value === "") setFilter((pre) => ({ ...pre, id: "" }))
          const lastStr = value?.slice(-1), last2Str = value?.slice(-2);
          if (lastStr?.trim() === "" || last2Str === ",,") return
          if (isNaN(Number(lastStr)) && lastStr !== ",") return
          setFilter((pre) => ({ ...pre, id: value }))
        }}
      >
      </Input>
      <Button
        type="primary"
        onClick={query}>查询</Button>
      {/* <Select
        showSearch
        style={{ width: 330, marginLeft: 10 }}
        allowClear
        placeholder="所有者地址"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, owner: val }))
        }}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        clearIcon={ClearIcon}
      >
        {map(keys(shopList), item => <Option key={item} value={item}>{item}</Option>)}
      </Select>
      <Select
        style={{ width: 120, marginLeft: 10 }}
        allowClear
        placeholder="物品类别"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, category: val }))
        }}
        clearIcon={ClearIcon}
      >
        {map(filter(keys(materialCatagoryList), item=>!!item), item => <Option key={item} value={item}>{filter(categoryData, ite => ite.value === item)[0]?.label}</Option>)}
      </Select>
       */}{/* <Select
        style={{ width: 120, marginLeft: 10 }}
        allowClear
        placeholder="是否收藏"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sale: val }))
        }}
        clearIcon={ClearIcon}
      >
        {map(keys(saleList), item => <Option key={item} value={item}>{item === "true" ? "未收藏" : "已收藏"}</Option>)}
      </Select> */}
      {/* <Select
        style={{ width: 120, marginLeft: 10 }}
        allowClear
        placeholder="排序"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sort: val }))
        }}
        clearIcon={ClearIcon}
      >
        {map(sortList, item => <Option key={item.value} value={item?.value}>{item?.label}</Option>)}
      </Select> */}
    </div>
  )
}
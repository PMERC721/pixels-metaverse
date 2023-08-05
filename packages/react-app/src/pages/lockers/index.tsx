import React, { useEffect, useState } from "react";
import { SearchQuery } from "./components/SearchQuery";
import { MaterialCard } from "./components/MaterialCard";
import { DataStateBox } from "../../components/DataStateBox";
import { isEmpty, last, map } from "lodash";
import { useUserInfo } from "../../components/UserProvider";
import { useQueryString } from "../../helpers/utilities";
import RightOutlined from "@ant-design/icons/lib/icons/RightOutlined";
import { Input } from "antd";

export const Lockers = () => {
  const { materialList } = useUserInfo()
  const { searchString, setSearchString } = useQueryString();
  const [createID, setCreateID] = useState("")
  useEffect(() => { setCreateID(searchString?.createID) }, [searchString?.createID])

  return (
    <main className="pt-20">
      <div className="m-auto p-6 rounded-md w-5/6"
        style={{
          background: "rgba(225,225,225, 0.05)",
          height: "calc(100vh - 90px)",
          color: "rgba(225, 225, 225, 0.8)",
          minWidth: 1200
        }}>
        <div className="mb-4 flex justify-between">
          <div className="text-2xl">储物室</div>
          <SearchQuery />
        </div>
        <DataStateBox data={materialList} styleCSS={{ height: "calc(100vh - 200px)" }}>
          <div>
            <div className="flex flex-wrap overflow-scroll" style={{ height: "calc(100vh - 200px)" }}>
              {map(materialList, (item, i) => {
                if (item?.baseInfo?.userId === "0" && item?.material?.id === "0") return null
                return <MaterialCard key={`${i}`} item={item} />
              })}
            </div>
          </div>
        </DataStateBox>
        {!searchString?.id && !isEmpty(materialList) && <div className="flex justify-center mt-2">
          <div className="flex justify-between items-center">
            <Input
              style={{ width: 100, marginLeft: 10, marginRight: 10 }}
              size="small"
              allowClear
              placeholder="跳转至ID"
              value={createID}
              onPressEnter={() => {
                setSearchString({ ...searchString, createID });
              }}
              onChange={(val) => {
                setCreateID(val?.target?.value)
              }}
            ></Input>
            {materialList?.length >= 10 && <RightOutlined className="cursor-pointer mx-4" onClick={() => {
              const data = {
                ...searchString,
                createID: last(materialList)?.material?.id ? String(Number(last(materialList)?.material?.id) - 1) : ""
              }
              setSearchString(data);
              //getMaterials?.refetch(data as TQuery)
            }} />}
          </div>
        </div>}
      </div>
    </main>
  )
}
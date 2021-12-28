import React, { useMemo } from "react";
import { SearchQuery } from "./components/SearchQuery";
import { GoodsCard } from "./components/GoodsCard";
import { DataStateBox } from "../../components/DataStateBox";
import { isEmpty, map } from "lodash";
import { Button, message } from "antd";
import { fetchCompose, useRequest } from "../../hook/api";

export const Lockers = () => {
  const [data, setData] = React.useState<any[]>([])
  const [composeList, setComposeList] = React.useState<number[]>([])
  const compose = useRequest(fetchCompose, {
    onSuccess: () => {
      message.success("合成成功！")
    }
  }, [])
  console.log(composeList)

  return (
    <main className="pt-20">
      <div className="m-auto p-6 rounded-md w-5/6"
        style={{
          background: "rgba(225,225,225, 0.05)",
          height: "calc(100vh - 90px)",
          color: "rgba(225, 225, 225, 0.8)"
        }}>
        <div className="mb-4 flex justify-between">
          <div className="text-2xl">储物室</div>
          <SearchQuery setData={setData} />
        </div>
        {!isEmpty(data) && <div className="flex justify-end mb-4">
          <Button
            type="primary"
            disabled={composeList?.length < 2}
            style={{}}
            onClick={() => {
              compose({
                ids: composeList
              })
            }}>一键合成</Button></div>}
        <DataStateBox data={data}>
          <div
            className="flex flex-wrap overflow-scroll" style={{
              height: "calc(100vh - 220px)"
            }}>
            {map(data, (item, i) => <GoodsCard key={i} item={item} i={i} setComposeList={setComposeList} />)}
          </div>
        </DataStateBox>
      </div>
    </main>
  )
}
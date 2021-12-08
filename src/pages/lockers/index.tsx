import React from "react";
import { SearchQuery } from "./components/SearchQuery";
import { GoodsCard } from "./components/GoodsCard";
import { DataStateBox } from "../../components/DataStateBox";
import { map } from "lodash";

export const Lockers = () => {
  const [data, setData] = React.useState<any[]>([])

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
        <DataStateBox
          data={data}
          classCSS="flex flex-wrap overflow-y-scroll"
          styleCSS={{ height: "calc(100vh - 170px)" }}
        >
          {map(data, (item, i) => <GoodsCard key={i} item={item} i={i} />)}
        </DataStateBox>
      </div>
    </main>
  )
}
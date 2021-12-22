import { map } from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import { AvatarCard } from "../../../components/AvatarCard";
import { DataStateBox } from "../../../components/DataStateBox";

export const PersonCenter = ({
  outfitEdList,
  noOutfitEdList
}: {
  noOutfitEdList: any[],
  outfitEdList: any[]
}) => {
  const history = useHistory()
  const { search } = useLocation()
  const address = search ? search.split("=")[1] : ""

  return (
    <div className="border m-4 p-4 card">
      <div className="mb-2 flex justify-between">
        <div>个人中心</div>
        <div
          className="cursor-pointer hover:text-red-500"
          onClick={() => { history.push(`/person-center${address ? "?address=" + address : ""}`) }}
        >查看更多</div>
      </div>
      <DataStateBox data={[...outfitEdList, ...noOutfitEdList]}>
        <div
          className="overflow-y-scroll"
          style={{ height: "calc(100% - 30px)" }}>
          <div className="mt-2 pb-4">
            <div className="">已使用</div>
            {map(outfitEdList, item => <AvatarCard key={item?.id} item={item} type="assets" />)}
          </div>
          <div className="mt-4">
            <div className="">未使用</div>
            {map(noOutfitEdList, item => <AvatarCard key={item?.id} item={item} type="assets" />)}
          </div>
        </div>
      </DataStateBox>
    </div>
  );
};
import { isEmpty, map } from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import { AvatarCard } from "../../../components/AvatarCard";
import { MaterialItem } from "../../../components/Card";
import { DataStateBox } from "../../../components/DataStateBox";

export const PersonCenter = ({
  avater,
  colectionList,
  onwerList
}: {
  avater?: MaterialItem;
  colectionList: MaterialItem[];
  onwerList: MaterialItem[]
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
      <DataStateBox data={[...colectionList, ...onwerList]}>
        <div
          className="overflow-y-scroll"
          style={{ height: "calc(100% - 30px)" }}>
          {avater && <div className="mt-2 pb-4">
            <div className="">Avater</div>
            {map([avater], item => <AvatarCard key={item?.material.id} item={item} />)}
          </div>}
          {!isEmpty(onwerList) && <div className="mt-4">
            <div className="">Your Material</div>
            {map(onwerList, item => <AvatarCard key={item?.material?.id} item={item} />)}
          </div>}
          {!isEmpty(colectionList) && <div className="mt-4">
            <div className="">Your Star</div>
            {map(colectionList, item => <AvatarCard key={item?.material?.id} item={item} star/>)}
          </div>}
        </div>
      </DataStateBox>
    </div>
  );
};
import { map } from "lodash";
import { useHistory } from "react-router-dom";
import { AvatarCard } from "../../../components/AvatarCard";
import { MaterialItem } from "../../../components/Card";
import { DataStateBox } from "../../../components/DataStateBox";

export const Collections = ({ noCollectionList }: { noCollectionList: MaterialItem[] }) => {
  const history = useHistory()

  return (
    <div className="border m-4 p-4 card" style={{ boxShadow: "5px 5px 10px rgba(225,225,225,0.3)" }}>
      <div className="mb-2 flex justify-between">
        <div>未收藏</div>
        <div className="cursor-pointer hover:text-red-500" onClick={() => { history.push("/lockers") }}>去收藏更多</div>
      </div>
      <DataStateBox data={noCollectionList}>
        <div className="overflow-y-scroll" style={{ height: "calc(100% - 30px)" }}>
          {map(noCollectionList, item => <AvatarCard key={item?.material?.id} item={item} star/>)}
        </div>
      </DataStateBox>
    </div>
  );
};
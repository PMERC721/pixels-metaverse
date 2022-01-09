import { isEmpty, map } from "lodash";
import { AvatarCard } from "../../../components/AvatarCard";
import { DataStateBox } from "../../../components/DataStateBox";
import { useGetPersonData } from "../../play";

export const AssetsInfo = () => {
  const { colectionList, onwerList, avater } = useGetPersonData()

  return (
    <DataStateBox data={[...onwerList, ...colectionList ]}>
      <div className="flex-1 flex justify-between">
        {!isEmpty(onwerList) && <div className="overflow-y-scroll flex-1 pr-4 border-r mr-4"
          style={{ borderColor: onwerList?.length > 0 ? "rgba(225,225,225, 0.3" : "transparent", height: "calc(100vh - 170px)" }}>
          {avater && <div className="pb-8">
            <div className="">Avater</div>
            {map([avater], item => <AvatarCard key={item?.material.id} item={item} />)}
          </div>}
          <div className="pb-8">
            <div>Your Material</div>
            {map(onwerList, item => <AvatarCard key={item?.material?.id} item={item} />)}
          </div>
        </div>}
        {!isEmpty(colectionList) && <div className="flex-1 overflow-y-scroll" style={{ height: "calc(100vh - 170px)" }}>
          <div>Your Star</div>
          {map(colectionList, item => <AvatarCard key={item?.material?.id} item={item} star />)}
        </div>}
      </div>
    </DataStateBox>
  )
}
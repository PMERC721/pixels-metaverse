import { map } from "lodash";
import { AvatarCard } from "../../../components/AvatarCard";
import { DataStateBox } from "../../../components/DataStateBox";
import { useUserInfo } from "../../../components/UserProvider";

export const AssetsInfo = () => {
  const { materialList } = useUserInfo()

  return (
    <DataStateBox data={materialList}>
      <div className="flex-1 flex">
        {map(materialList, item => <AvatarCard key={item?.material?.id} item={item} />)}
      </div>
    </DataStateBox>
  )
}
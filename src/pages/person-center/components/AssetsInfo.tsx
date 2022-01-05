import React from "react";
import { useLocation } from "react-router";
import { filter, isEmpty, map } from "lodash";
import { useWeb3Info } from "../../../hook/web3";
import { useUserInfo } from "../../../components/UserProvider";
import { AvatarCard } from "../../../components/AvatarCard";
import { DataStateBox } from "../../../components/DataStateBox";
import { MaterialItem } from "../../../components/Card";
import { useGetPersonData } from "../../play";

export const AssetsInfo = () => {
  const { address: addresss } = useWeb3Info()
  const { search } = useLocation()
  const { goodsList } = useUserInfo()
  const address = search ? search.split("=")[1] : addresss
  const shopGoods = React.useMemo(() => filter(goodsList, item => item?.owner === address && item?.isSale), [goodsList])
  const { colectionList, onwerList, avater } = useGetPersonData()

  return (
    <DataStateBox data={[...onwerList, ...onwerList, ...shopGoods]}>
      <div className="flex-1 flex justify-between">
        {!isEmpty(onwerList) && <div className="overflow-y-scroll flex-1 pr-4 border-r mr-4"
          style={{ borderColor: shopGoods?.length > 0 ? "rgba(225,225,225, 0.3" : "transparent", height: "calc(100vh - 170px)" }}>
          {avater && <div className="mt-2 pb-4">
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
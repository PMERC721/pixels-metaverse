import React from "react";
import { useLocation } from "react-router";
import { filter, isEmpty, map } from "lodash";
import { useWeb3Info } from "../../../hook/web3";
import { useUserInfo } from "../../../components/UserProvider";
import { AvatarCard } from "../../../components/AvatarCard";
import { DataStateBox } from "../../../components/DataStateBox";
import { MaterialItem } from "../../../components/Card";

export const AssetsInfo = ({ outfitEdList, noOutfitEdList }: {
  noOutfitEdList: MaterialItem[], outfitEdList: MaterialItem[]
}) => {
  const { address: addresss } = useWeb3Info()
  const { search } = useLocation()
  const { goodsList } = useUserInfo()
  const address = search ? search.split("=")[1] : addresss
  const shopGoods = React.useMemo(() => filter(goodsList, item => item?.owner === address && item?.isSale), [goodsList])

  return (
    <DataStateBox data={[...outfitEdList, ...noOutfitEdList, ...shopGoods]}>
      <div className="flex-1 flex justify-between">
        {!isEmpty(outfitEdList) && <div className="overflow-y-scroll flex-1 pr-4 border-r mr-4"
          style={{ borderColor: shopGoods?.length > 0 ? "rgba(225,225,225, 0.3" : "transparent", height: "calc(100vh - 170px)" }}>
          <div className="pb-8">
            <div>Your Material</div>
            {map(outfitEdList, item => <AvatarCard key={item?.material?.id} item={item} type="assets" />)}
          </div>
        </div>}
        {!isEmpty(noOutfitEdList) && <div className="flex-1 overflow-y-scroll" style={{ height: "calc(100vh - 170px)" }}>
          <div>Your Star</div>
          {map(noOutfitEdList, item => <AvatarCard key={item?.material?.id} item={item} type="" />)}
        </div>}
      </div>
    </DataStateBox>
  )
}
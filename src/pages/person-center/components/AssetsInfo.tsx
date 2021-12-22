import React from "react"
import { filter, isEmpty, map } from "lodash";
import { useLocation } from "react-router";
import { useUserInfo } from "../../../components/UserProvider";
import { AvatarCard } from "../../../components/AvatarCard";
import { useWeb3Info } from "../../../hook/web3";
import { DataStateBox } from "../../../components/DataStateBox";

export const AssetsInfo = ({ outfitEdList, noOutfitEdList }: {
  noOutfitEdList: any[], outfitEdList: any[]
}) => {
  const { address: addresss } = useWeb3Info()
  const { search } = useLocation()
  const { goodsList } = useUserInfo()
  const address = search ? search.split("=")[1] : addresss
  const shopGoods = React.useMemo(() => filter(goodsList, item => item?.owner === address && item?.isSale), [goodsList])

  return (
    <DataStateBox data={[...outfitEdList, ...noOutfitEdList, ...shopGoods]}>
      <div className="flex-1 flex justify-between">
        <div className="overflow-y-scroll flex-1 pr-4 border-r mr-4"
          style={{ borderColor: shopGoods?.length > 0 ? "rgba(225,225,225, 0.3" : "transparent", height: "calc(100vh - 170px)" }}>
          {!isEmpty(outfitEdList) && <div className="pb-8">
            <div>已使用</div>
            {map(outfitEdList, item => <AvatarCard key={item?.id} item={item} type="assets" />)}
          </div>}
          {!isEmpty(noOutfitEdList) && <div>
            <div>未使用</div>
            {map(noOutfitEdList, item => <AvatarCard key={item?.id} item={item} type="assets" />)}
          </div>}
        </div>
        {!isEmpty(shopGoods) && <div className="flex-1 overflow-y-scroll" style={{ height: "calc(100vh - 170px)" }}>
          <div>收藏夹</div>
          {map(shopGoods, item => <AvatarCard key={item?.id} item={item} type="buyGoods" />)}
        </div>}
      </div>
    </DataStateBox>
  )
}
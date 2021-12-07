import React from "react"
import { filter, isEmpty, map } from "lodash";
import { useLocation } from "react-router";
import { useUserInfo } from "../../../components/UserProvider";
import { usePixelsMetaverse } from "../../../pixels-metaverse";
import { AvatarCard } from "../../../components/AvatarCard";
import { NoData } from "../../../components/NoData";

export const AssetsInfo = ({ outfitEdList, noOutfitEdList }: {
  noOutfitEdList: any[], outfitEdList: any[]
}) => {
  const { accounts } = usePixelsMetaverse()
  const { search } = useLocation()
  const { goodsList } = useUserInfo()
  const address = search ? search.split("=")[1] : accounts.address
  const shopGoods = React.useMemo(() => filter(goodsList, item => item?.owner === address && item?.isSale), [goodsList])

  return (
    <>
      { (!isEmpty(outfitEdList) || !isEmpty(noOutfitEdList) || !isEmpty(shopGoods))
        ? <div className="flex-1 flex justify-between">
          {(!isEmpty(outfitEdList) || !isEmpty(noOutfitEdList)) && <div className="overflow-y-scroll flex-1 pr-4 border-r mr-4" style={{ borderColor: "rgba(225,225,225, 0.3" }}>
            {!isEmpty(outfitEdList) && <div className="pb-8">
              <div className="">已使用</div>
              {map(outfitEdList, item => <AvatarCard key={item?.id} item={item} type="assets" />)}
            </div>}
            {!isEmpty(noOutfitEdList) && <div>
              <div className="">未使用</div>
              {map(noOutfitEdList, item => <AvatarCard key={item?.id} item={item} type="assets" />)}
            </div>}
          </div>}
          {!isEmpty(shopGoods) && <div className="flex-1 overflow-y-scroll">
            <div>
              <div className="">收藏夹</div>
              {map(shopGoods, item => <AvatarCard key={item?.id} item={item} type="buyGoods" />)}
            </div>
          </div>}
        </div> : <NoData />}
    </>
  )
}
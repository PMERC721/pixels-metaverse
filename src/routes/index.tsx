import { map } from "lodash"
import { Route, Switch } from "react-router-dom"
import { Website } from "../pages/home"
import { Lockers } from "../pages/lockers"
import { PersonCenter } from "../pages/person-center"
import { PixelsMetaverse } from "../pages/play"
import { Produced } from "../pages/produced"

export const routes = [
  { name: "首页", path: "/app", component: PixelsMetaverse },
  { name: "制作虚拟物品", path: "/produced", component: Produced },
  { name: "储物柜", path: "/lockers", component: Lockers },
  { name: "个人中心", path: "/person-center", component: PersonCenter },
  { name: "首页", path: "/", component: Website },
]

export const Routes = () => {
  return (
    <Switch>
      {map(routes, item => <Route key={item.path} path={item?.path} component={item.component} />)}
      <Route exact component={Website} />
    </Switch>
  )
}
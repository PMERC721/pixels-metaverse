import { map } from "lodash"
import { Route, Switch } from "react-router-dom"
import { Website } from "../pages/home"
import { Mall } from "../pages/mall"
import { PersonCenter } from "../pages/person-center"
import { PixelsMetaverse } from "../pages/play"
import { Produced } from "../pages/produced"

export const routes = [
    { name: "首页", path: "/app", component: PixelsMetaverse },
    { name: "制作虚拟物品", path: "/produced", component: Produced },
    { name: "商城", path: "/mall", component: Mall },
    { name: "个人中心", path: "/person-center", component: PersonCenter },
    { name: "首页", path: "/", component: Website }
]

export const Routes = () => {
    return (
        <Switch>
            {map(routes, item => <Route key={item.path} path={item?.path} component={item.component} />)}
            <Route exact component={Website} />
        </Switch>
    )
}
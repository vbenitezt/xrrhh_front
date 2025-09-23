import { Divider } from "antd";
import getRoutes from "../../routes";


export const sidebarItems = ({ profile, collapsed }) => {
  const routes = getRoutes({profile}).map((route, index) => {
    if (route.type === "divider") {
      return {
        type: "group",
        path: route.path,
        label: <Divider style={{ marginBottom: "0px" }} orientation="left">{!collapsed && route.label}</Divider>
      }
    }
    if (route.insideBar) {
      return {
        key: String(index + 1),
        icon: <route.icon className={`${collapsed && "w-full h-full p-0 m-0"}`} size="1.5em" />,
        path: route.path,
        label: <a href={route.path}>{route.label}</a>,
        ...(route.children && route.children.length > 0 ? {
          children: route.children.map((subRoute, subIndex) => {
            return {
              key: `${index + 1}${subIndex + 1}`,
              label: <a href={subRoute.path}>{subRoute.label}</a>,
              icon: route.icon,
            }
          })
        } : {}),
      };
    }
  })
  return routes;
}
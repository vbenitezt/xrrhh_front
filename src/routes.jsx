import { TiHomeOutline } from "react-icons/ti";
import Home from "./pages/home/Home";
import Cargo from "./pages/maestros/cargos/Cargo";


const getRoutes = ({ profile }) => {
  let routes = [
    {
      type: "divider",
      label: "Sistema",
    },
    {
      component: Home,
      type: "route",
      path: "/home",
      label: "Home",
      icon: TiHomeOutline,
      insideBar: true,
    },
    {
      type: "divider",
      label: "Maestros",
    },
    {
      component: Cargo,
      type: "route",
      path: "/maestros/cargos",
      label: "Cargos",
      icon: TiHomeOutline,
      insideBar: true,
    },
  ];
  return routes;
};

export default getRoutes;

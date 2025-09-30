import { TiHomeOutline } from "react-icons/ti";
import Home from "./pages/home/Home";
import Empleado from "./pages/maestros/empleados/Empleado";
import GenericMaster from "./pages/maestros/generic_master/GenericMaster"


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
      component: GenericMaster,
      type: "route",
      path: "/maestros/cargos",
      label: "Cargos",
      icon: TiHomeOutline,
      props: {pk:"cod_cargo", path:"gm/cargo", title:"Cargo", title_plural:"Cargos"},
      insideBar: true,
    },
    {
      component: GenericMaster,
      type: "route",
      path: "/maestros/tipo_contrato",
      label: "Tipo Contrato",
      icon: TiHomeOutline,
      props: {pk:"cod_tipo_contrato", path:"gm/tipo_contrato", title:"Contrato", title_plural:"Contratos"},
      insideBar: true,
    },
    {
      component: GenericMaster,
      type: "route",
      path: "/maestros/tipo_hd",
      label: "Tipo Haber Descuento",
      icon: TiHomeOutline,
      props: {pk:"cod_tipo_h_d", path:"gm/tipo_h_d", title:"Tipo Haber Descuento", title_plural:"Tipos Haber Descuento"},
      insideBar: true,
    },
    {
      component: GenericMaster,
      type: "route",
      path: "/maestros/salud",
      label: "Salud",
      icon: TiHomeOutline,
      props: {pk:"cod_salud", path:"gm/salud", title:"Salud", title_plural:"Intituciones de Salud"},
      insideBar: true,
    },
    ,
    {
      component: GenericMaster,
      type: "route",
      path: "/maestros/leyes_sociales",
      label: "Leyes Sociales",
      icon: TiHomeOutline,
      props: {pk:"cod_contantes", path:"gm/constantes", title:"LS", title_plural:"Leyes Sociales"},
      insideBar: true,
    },{
      component: GenericMaster,
      type: "route",
      path: "/maestros/tope_asignacion",
      label: "Asignacion Familiar",
      icon: TiHomeOutline,
      props: {pk:"cod_tope_asignacion", path:"gm/tope_asignacion", title:"Asignacion Familiar", title_plural:"Asignaciones Fam"},
      insideBar: true,
    },
    {
      component: Empleado,
      type: "route",
      path: "/maestros/empleados",
      label: "Empleados",
      icon: TiHomeOutline,
      insideBar: true,
    },
  ];
  return routes;
};

export default getRoutes;

import * as MdIcons from 'react-icons/md';
import * as TiIcons from 'react-icons/ti';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as AntIcons from '@ant-design/icons';
import Home from "../pages/home/Home";
import { DashboardEmpleado, DashboardAdmin, DashboardMobile } from "../pages/dashboard";
import { 
  GenericMaster,
  GenericMasterDetail,
  GenericMasterDetailMobile,
  MainMobile,
  PerfilMobile
} from "@xsolutioncl/ruibernate";

// Componentes personalizados del proyecto
// import MiComponente from "../pages/MiComponente";

/**
 * Mapeo de componentes disponibles
 * Agrega aquí tus componentes personalizados
 */
const componentMap = {
  Home: Home,
  GenericMaster: GenericMaster,
  GenericMasterDetail: GenericMasterDetail,
  GenericMasterDetailMobile: GenericMasterDetailMobile,
  MainMobile: MainMobile,
  PerfilMobile: PerfilMobile,
  // Dashboards
  DashboardEmpleado: DashboardEmpleado,
  DashboardAdmin: DashboardAdmin,
  DashboardMobile: DashboardMobile,
  // Agrega aquí tus componentes personalizados:
  // MiComponente: MiComponente,
};

/**
 * Mapeo de iconos alternativos para casos donde el nombre del API no coincide exactamente
 * Solo agrega aliases aquí si el icono NO existe en ninguna librería
 */
const iconAliases = {
  // Ejemplo: Si tu API envía 'arbol' y quieres usar TiTree
  // 'arbol': 'TiTree',
  // Agrega más aliases según necesites
};

/**
 * Convierte un string de nombre de icono a componente React
 */
const getIconComponent = (iconName) => {
  if (!iconName || typeof iconName !== 'string') return undefined;
  if (typeof iconName === 'function') return iconName;
  
  // Intentar con el nombre original primero
  let actualIconName = iconName;
  
  // Buscar en Ant Design Icons
  if (AntIcons[iconName]) {
    return AntIcons[iconName];
  }
  
  // Buscar en Material Design Icons
  if (MdIcons[iconName]) {
    return MdIcons[iconName];
  }
  
  // Buscar en Typicons
  if (TiIcons[iconName]) {
    return TiIcons[iconName];
  }
  
  // Buscar en Font Awesome
  if (FaIcons[iconName]) {
    return FaIcons[iconName];
  }
  
  // Buscar en Feather Icons
  if (FiIcons[iconName]) {
    return FiIcons[iconName];
  }
  
  // Si no se encontró, intentar con alias
  if (iconAliases[iconName]) {
    const aliasName = iconAliases[iconName];
    return getIconComponent(aliasName); // Recursivo con el alias
  }
  
  // Si aún no se encuentra, intentar buscar variantes comunes
  const variants = [
    iconName + 'Outlined',
    iconName + 'Filled',
    iconName + 'TwoTone',
    iconName.replace('Outlined', ''),
    iconName.replace('Filled', ''),
    iconName.replace('TwoTone', '')
  ];
  
  for (const variant of variants) {
    if (MdIcons[variant]) {
      return MdIcons[variant];
    }
    if (AntIcons[variant]) {
      return AntIcons[variant];
    }
  }
  
  // Retornar un icono por defecto de Ant Design
  return AntIcons.AppstoreOutlined;
};

/**
 * Procesa una ruta del API y la convierte al formato de React Router
 */
const processRoute = (route, index = 0) => {
  // Si es un menú con hijos, procesar recursivamente
  if (route.type === 'menu' && route.children) {
    const processedChildren = mapApiRoutesToReactRouter(route.children);
    return {
      ...route,
      children: processedChildren,
      icon: route.icon ? getIconComponent(route.icon) : undefined,
    };
  }

  // Si es un layout (como MainMobile) con hijos, procesar recursivamente
  if (route.type === 'layout' && route.children) {
    const ComponentClass = componentMap[route.component];
    
    if (!ComponentClass) {
      return null;
    }

    const processedChildren = mapApiRoutesToReactRouter(route.children);
    return {
      ...route,
      component: ComponentClass,
      children: processedChildren,
      icon: route.icon ? getIconComponent(route.icon) : undefined,
    };
  }

  // Si es una ruta normal, mapear el componente
  const ComponentClass = componentMap[route.component];
  
  if (!ComponentClass) {
    return null;
  }

  return {
    ...route,
    component: ComponentClass,
    icon: route.icon ? getIconComponent(route.icon) : undefined,
  };
};

/**
 * Mapea rutas del API al formato de React Router
 * @param {Array} apiRoutes - Array de rutas desde el API
 * @returns {Array} - Array de rutas en formato React Router
 */
export const mapApiRoutesToReactRouter = (apiRoutes) => {
  if (!Array.isArray(apiRoutes) || apiRoutes.length === 0) {
    return [];
  }

  return apiRoutes
    .map((route, index) => processRoute(route, index))
    .filter(Boolean); // Filtrar rutas nulas
};

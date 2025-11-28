import Home from "./pages/home/Home";
import { DashboardMobile } from "./pages/dashboard";
import { MainMobile, PerfilMobile } from "@xsolutioncl/ruibernate";

/**
 * Rutas estáticas de la aplicación
 * 
 * ⚠️ IMPORTANTE: Las rutas que requieren permisos (como /dashboard/admin o /dashboard/empleado)
 * NO deben ir aquí. Deben venir desde el API para respetar los permisos del usuario.
 * 
 * Aquí solo deben ir:
 * - Rutas públicas (accesibles sin login)
 * - Rutas base que todos los usuarios autenticados pueden ver
 * - Layouts móviles base
 */
export default function getStaticRoutes() {
  return [
    // Ruta de inicio (accesible para todos los usuarios autenticados)
    {
      type: 'route',
      path: '/home',
      label: 'Inicio',
      insideBar: false,
      component: Home,
    },
    // Layout móvil base - las rutas hijas deben venir del API
    {
      type: 'layout',
      path: '/mobile',
      component: MainMobile,
      children: [
        {
          type: 'route',
          path: '/mobile',
          label: 'Inicio',
          icon: 'HomeOutlined',
          insideBar: true,
          index: true,
          component: DashboardMobile,
        },
        {
          type: 'route',
          path: '/mobile/perfil',
          label: 'Mi Perfil',
          icon: 'UserOutlined',
          insideBar: false, // No mostrar en bottom nav
          component: PerfilMobile,
        },
      ],
    },
  ];
}


import Home from "./pages/home/Home";

/**
 * Rutas estáticas de la aplicación
 * Estas rutas no se cargan desde el API
 */
export default function getStaticRoutes() {
  return [
    {
      type: 'route',
      path: '/home',
      label: 'Inicio',
      insideBar: false, // No mostrar en el menú lateral
      component: Home,
    },
    // Agrega aquí más rutas estáticas si las necesitas
  ];
}


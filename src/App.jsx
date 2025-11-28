import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd";
import { 
  AxiosProvider, 
  ReactQueryProvider, 
  Login, 
  Layer,
  ProtectedRoute,
  MobileRedirect,
  NotFound,
  useAuthStore,
  useRoutesStore,
  createAxiosInstance
} from "@xsolutioncl/ruibernate";
import esES from "antd/locale/es_ES";
import config from "./config/config";
import { mapApiRoutesToReactRouter } from "./utils/routeMapper";
import getStaticRoutes from "./routes";

const axiosInstance = createAxiosInstance(config);

/**
 * Procesa las rutas para manejar layouts (como MainMobile) y rutas normales
 */
const flattenRoutes = (routes = []) =>
  routes.reduce((acc, route) => {
    // Si es un layout (como MainMobile), procesar sus children
    if (route?.type === "layout" && route?.children) {
      return [
        ...acc,
        {
          ...route,
          children: flattenRoutes(route.children)
        }
      ];
    }

    if (route?.type === "route") {
      return [...acc, route];
    }

    if (route?.children?.length) {
      return [...acc, ...flattenRoutes(route.children)];
    }

    return acc;
  }, []);

function App() {
  const { isAuth, profile } = useAuthStore();
  const { routes: dynamicRoutesFromAPI } = useRoutesStore();
  
  // Mapear rutas dinámicas del API
  const dynamicRoutes = mapApiRoutesToReactRouter(dynamicRoutesFromAPI);
  
  // Obtener rutas estáticas
  const staticRoutes = getStaticRoutes();
  
  // Combinar y aplanar todas las rutas
  const allRoutes = [...dynamicRoutes, ...staticRoutes];
  const routes = flattenRoutes(allRoutes).map((route, index) => {
    // Si es un layout (MainMobile), crear ruta con Outlet
    if (route.type === "layout") {
      return (
        <Route
          path={route.path}
          element={<route.component config={config} />}
          key={index}
        >
          {route.children?.map((child, childIndex) => (
            <Route
              path={child.path}
              element={<child.component {...(child.props ?? {})} />}
              key={`${index}-${childIndex}`}
              index={child.index}
            />
          ))}
        </Route>
      );
    }
    
    // Rutas normales con Layer
    return (
      <Route
        path={route.path}
        element={
          <Layer config={config}>
            <route.component {...(route.props ?? {})} />
          </Layer>
        }
        key={index}
        exact
      />
    );
  });

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AxiosProvider axios={axiosInstance}>
        <ConfigProvider locale={esES}>
          <AntApp>
            <ReactQueryProvider>
              <MobileRedirect>
                <Routes>
                  {/* Ruta de login */}
                  <Route 
                    exact 
                    path="/" 
                    element={<Login axios={axiosInstance} config={config} />} 
                  />
                  
                  {/* Rutas protegidas */}
                  <Route element={<ProtectedRoute isAllowed={isAuth} />}>
                    {routes}
                    
                    {/* Ruta 404 - Captura rutas no válidas */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </MobileRedirect>
            </ReactQueryProvider>
          </AntApp>
        </ConfigProvider>
      </AxiosProvider>
    </BrowserRouter>
  );
}

export default App;


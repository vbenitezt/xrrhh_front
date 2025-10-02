import Layer from "./common/Layout";
import getRoutes from "./routes";
import locale from "antd/locale/es_ES";
import ReactQueryProvider from "./components/ReactQueryProvider/ReactQueryProvider";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useAuthStore } from "./common/store/authStore";
import { ProtectedRoute } from "./middleware/ProtectedRoutes";
import { ConfigProvider, theme, App as AntApp } from "antd";
import { useThemeStore } from "./common/store/themeStore";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "antd/dist/reset.css";

const flattenRoutes = (routes = []) =>
  routes.reduce((acc, route) => {
    if (route?.type === "route") {
      return [...acc, route];
    }

    if (route?.children?.length) {
      return [...acc, ...flattenRoutes(route.children)];
    }

    return acc;
  }, []);

function App() {
  const { defaultAlgorithm, darkAlgorithm } = theme;

  const { isAuth, profile } = useAuthStore((state) => state);

  const { theme: currentTheme } = useThemeStore();

  const routes = flattenRoutes(getRoutes({ profile })).map((route, index) => (
    <Route
      path={route.path}
      element={
        <Layer>
          <route.component {...(route.props ?? {})} />
        </Layer>
      }
      key={index}
      exact
    />
  ));

  return (
    <BrowserRouter>
      <ConfigProvider
        locale={locale}
        theme={{
          token: {
            colorPrimary: "#16c1ab",
            colorInfo: "#16c1ab",
            borderRadius: 1
          },
          algorithm: currentTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
          components: {
            Table: {
              fontSize: 12,
              cellFontSize: 12,
              cellFontSizeMD: 12,
              cellFontSizeSM: 12,
              fontSizeSM: 14
            }
          }
        }}
      >
        <AntApp>
          <ReactQueryProvider>
            <Routes>
              <Route exact path="/" element={<Login />} />
              {/* <Route element={<ProtectedRoute isAllowed={isAuth} />}> */}
              {routes}
              {/* </Route> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProvider>
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl text-gray-500">Página no encontrada!!!</p>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-4 py-2 mt-8 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Regresar a página anterior
      </button>
    </div>
  );
}

export default App;

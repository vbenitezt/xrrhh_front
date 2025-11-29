import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import config from "./config/config.js";

// Establecer título del documento
document.title = config.app.name;

// Configuración de Day.js
import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extender Day.js con plugins necesarios
dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

// Estilos
import "@xsolutioncl/ruibernate/styles";
import "./index.css";

// Registrar Service Worker para PWA
if (config.pwa?.enabled && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch(() => {
        // Service Worker registration failed silently
      });
  });
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import { localeEsDayjs } from "./utils/localeFormat.jsx";
import "dayjs/locale/es";
import "./index.css";

    
localeEsDayjs();


createRoot(document.getElementById("root")).render(<App />);
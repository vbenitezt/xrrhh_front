import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { localeEsDayjs } from "./utils/localeFormat.jsx";
import "dayjs/locale/es";
import "./index.css";

    
localeEsDayjs();


ReactDOM.createRoot(document.getElementById("root")).render(<App />);
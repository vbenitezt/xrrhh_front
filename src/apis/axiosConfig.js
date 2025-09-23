import axios from "axios";
import config from "../common/config/config";
import { useAuthStore } from "../common/store/authStore";

const axiosConfig = axios.create({
  baseURL: config.api.baseUrl,
});

axiosConfig.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
    config.withCredentials = true;
  }
  return config;
});

export default axiosConfig;

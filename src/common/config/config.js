export default {
  env: import.meta.env.NODE_ENV,
  isDev: import.meta.env.NODE_ENV === 'development',
  api: {
    baseUrl: import.meta.env.VITE_API_URL,
  },
};

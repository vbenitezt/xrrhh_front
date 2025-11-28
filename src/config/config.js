const config = {
  // Environment
  env: import.meta.env.NODE_ENV,
  isDev: import.meta.env.NODE_ENV === 'development',
  isProd: import.meta.env.PROD,
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Mi Aplicación',
    company: import.meta.env.VITE_APP_COMPANY || 'Mi Empresa',
    logo: import.meta.env.VITE_APP_LOGO || '/logo.png',
  },
  
  // User Configuration - Mapeo de campos del usuario
  user: {
    fields: {
      name: import.meta.env.VITE_USER_NAME_FIELD || 'desc_user',
      lastLogin: import.meta.env.VITE_USER_LAST_LOGIN_FIELD || 'last_login',
      lastLogout: import.meta.env.VITE_USER_LAST_LOGOUT_FIELD || 'last_logout',
      email: import.meta.env.VITE_USER_EMAIL_FIELD || 'email',
      username: import.meta.env.VITE_USER_USERNAME_FIELD || 'login_usuario',
      company: import.meta.env.VITE_USER_COMPANY_FIELD || 'desc_empresa',
      company_id: import.meta.env.VITE_USER_COMPANY_ID_FIELD || 'id_empresa',
    },
    messages: {
      welcome: import.meta.env.VITE_WELCOME_MESSAGE || 'Bienvenid@',
      welcomeBack: import.meta.env.VITE_WELCOME_BACK_MESSAGE || 'nuevamente!',
      logout: import.meta.env.VITE_LOGOUT_MESSAGE || 'Sesión cerrada correctamente',
    }
  },
  
  // Utility methods
  getAppTitle: (subtitle = '') => {
    const appName = import.meta.env.VITE_APP_NAME || 'Mi Aplicación';
    return subtitle ? `${appName} - ${subtitle}` : appName;
  },
  
  getCopyright: () => {
    const currentYear = new Date().getFullYear();
    const appName = import.meta.env.VITE_APP_NAME || 'Mi Aplicación';
    const company = import.meta.env.VITE_APP_COMPANY || 'Mi Empresa';
    return `${appName} ©${currentYear} Desarrollado por ${company}`;
  },
  
  // User utility methods
  getUserField: (user, fieldName) => {
    const fieldMapping = {
      name: import.meta.env.VITE_USER_NAME_FIELD || 'desc_user',
      lastLogin: import.meta.env.VITE_USER_LAST_LOGIN_FIELD || 'last_login',
      lastLogout: import.meta.env.VITE_USER_LAST_LOGOUT_FIELD || 'last_logout',
      email: import.meta.env.VITE_USER_EMAIL_FIELD || 'email',
      username: import.meta.env.VITE_USER_USERNAME_FIELD || 'username',
    };
    return user?.[fieldMapping[fieldName]];
  },
  
  getWelcomeMessage: (user) => {
    const welcomeMsg = import.meta.env.VITE_WELCOME_MESSAGE || 'Bienvenid@';
    const welcomeBackMsg = import.meta.env.VITE_WELCOME_BACK_MESSAGE || 'nuevamente!';
    const lastLogoutField = import.meta.env.VITE_USER_LAST_LOGOUT_FIELD || 'last_logout';
    return `${welcomeMsg} ${user?.[lastLogoutField] ? welcomeBackMsg : ''}`;
  }
};

export default config;


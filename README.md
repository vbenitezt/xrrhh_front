# XRRHH Frontend

Sistema de gestión empresarial para compras, inventario y documentación desarrollado con React y Vite.

## 🚀 Características

### Módulos Principales
- **Sistema de Compras**: Gestión de solicitudes, órdenes de compra, facturas y guías
- **Inventario**: Control de stock y gestión de productos
- **Maestros**: Administración de contribuyentes, centros de costo, familias de productos, items y usuarios
- **Administración**: Gestión de empresas, cuentas y configuraciones del sistema

### Funcionalidades Técnicas
- 🔐 **Autenticación**: Sistema de login con protección de rutas
- 🎨 **Tema Dinámico**: Soporte para modo claro y oscuro
- 📊 **Gráficos**: Visualización de datos con Chart.js y Recharts
- 📄 **Editor de Texto**: Integración con Ace Editor
- 📋 **Tablas Avanzadas**: Componentes de tabla con filtros y paginación
- 📱 **Responsive**: Diseño adaptativo con Tailwind CSS
- 🔄 **Estado Global**: Gestión de estado con Zustand
- ⚡ **React Query**: Caché y sincronización de datos

## 🛠️ Tecnologías

- **Frontend**: React 18, Vite
- **UI Framework**: Ant Design
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Charts**: Chart.js, Recharts
- **Code Editor**: Ace Editor
- **HTTP Client**: Axios
- **Icons**: React Icons

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd xhhrr-front
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   VITE_API_URL=http://localhost:8018/api/v1
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter ESLint

## 🏗️ Estructura del Proyecto

```
src/
├── apis/                 # Configuración de Axios y llamadas API
├── assets/              # Imágenes e iconos
├── common/              # Componentes y stores compartidos
│   ├── Layout/         # Layout principal y sidebar
│   └── store/          # Stores de Zustand
├── components/          # Componentes reutilizables
│   ├── Charts/         # Componentes de gráficos
│   ├── Forms/          # Formularios personalizados
│   ├── Tables/         # Tablas y filtros
│   └── ...
├── hooks/              # Custom hooks
├── middleware/          # Middleware de autenticación
├── pages/              # Páginas de la aplicación
│   ├── admin/          # Páginas administrativas
│   ├── masters/        # Páginas de maestros
│   ├── modules/        # Módulos principales
│   └── tools/          # Herramientas de desarrollo
├── services/           # Servicios de API
└── utils/              # Utilidades y helpers
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```env
VITE_API_URL=http://localhost:8018/api/v1
```

### Configuración de Vite
El proyecto utiliza Vite como bundler con las siguientes configuraciones:
- Plugin de React
- Soporte para SVG como componentes
- Configuración de PostCSS y Tailwind

## 🚀 Despliegue

### Despliegue Manual
1. Construir la aplicación:
   ```bash
   npm run build
   ```

2. Copiar los archivos de `dist/` al servidor web

### Despliegue Automatizado
El proyecto incluye un script de despliegue (`deploy.sh`) que puede ser configurado para:
- Construir la aplicación
- Copiar archivos al servidor via SCP
- Configurar nginx

### Configuración de Nginx
```nginx
server {
    server_name compras.flujappi.cl;
    
    location / {
        root /var/www/xhhrr;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8018/api/v1;
        # ... configuración de proxy
    }
}
```

## 🔐 Autenticación

El sistema utiliza JWT para la autenticación con las siguientes características:
- Protección de rutas
- Almacenamiento seguro de tokens
- Redirección automática al login

## 📊 Módulos Disponibles

### Sistema Principal
- **Home**: Dashboard principal del sistema
- **Gestión de Documentos**: Sistema integral para manejo de documentos empresariales
- **Control de Inventario**: Gestión y seguimiento de productos y stock

### Administración
- **Maestros**: Gestión de datos maestros del sistema
- **Usuarios**: Administración de usuarios y permisos
- **Configuraciones**: Ajustes y parámetros del sistema

### Herramientas de Desarrollo
- **Herramientas**: Utilidades para desarrollo y debugging (solo en ambiente de desarrollo)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y de uso interno.

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ por el equipo de XRRHH**
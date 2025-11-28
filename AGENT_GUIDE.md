# 🤖 Guía para Agentes de IA - create-ruibernate-app

Esta guía está diseñada para agentes de IA (como Claude, GPT, etc.) que asisten en el desarrollo de proyectos creados con `create-ruibernate-app`. Proporciona contexto sobre la arquitectura, patrones y mejores prácticas del ecosistema ruiBernate.

---

## 📋 Tabla de Contenidos

1. [Contexto General](#contexto-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Arquitectura y Patrones](#arquitectura-y-patrones)
4. [Componentes de ruiBernate](#componentes-de-ruibernate)
5. [Sistema de Rutas Dinámicas](#sistema-de-rutas-dinámicas)
6. [Sistema de Iconos](#sistema-de-iconos)
7. [Gestión de Estado](#gestión-de-estado)
8. [Configuración](#configuración)
9. [Estilos y Temas](#estilos-y-temas)
10. [Mejores Prácticas](#mejores-prácticas)
11. [Solución de Problemas Comunes](#solución-de-problemas-comunes)
12. [Comandos Útiles](#comandos-útiles)

---

## 🎯 Contexto General

### ¿Qué es ruiBernate?

**ruiBernate** es una librería de componentes React para aplicaciones ERP que proporciona:
- Componentes genéricos reutilizables (GenericMaster, GenericMasterDetail)
- Sistema de autenticación integrado
- Gestión de rutas dinámicas desde API
- Layout responsivo (desktop y mobile)
- Gestión de estado con Zustand
- Integración con Ant Design y Tailwind CSS

### ¿Qué es create-ruibernate-app?

**create-ruibernate-app** es un CLI que genera proyectos React preconfigurados con ruiBernate, similar a `create-react-app` pero específico para aplicaciones ERP.

### Principio Fundamental

**NO MODIFICAR ruiBernate**: Los proyectos deben extender y personalizar ruiBernate sin modificar la librería. Toda personalización se hace en el proyecto mediante:
- Componentes personalizados en `src/pages/`
- Estilos personalizados en `src/styles/`
- Configuración en `src/config/config.js`
- Variables de entorno en `.env`

---

## 📁 Estructura del Proyecto

```
mi-proyecto/
├── public/                          # Archivos públicos estáticos
├── src/
│   ├── App.jsx                      # ⚠️ CRÍTICO: Componente principal
│   ├── main.jsx                     # Punto de entrada
│   ├── index.css                    # Estilos globales base
│   │
│   ├── config/
│   │   └── config.js                # ⚠️ CRÍTICO: Configuración de la app
│   │
│   ├── pages/                       # 📝 Componentes personalizados del proyecto
│   │   ├── home/
│   │   │   └── Home.jsx             # Página de inicio
│   │   └── mobile/                  # Componentes móviles personalizados
│   │       ├── HomeMobile.jsx
│   │       └── [OtrosComponentes].jsx
│   │
│   ├── routes.jsx                   # ⚠️ Rutas estáticas (opcional)
│   │
│   ├── styles/                      # 🎨 Estilos personalizados (opcional)
│   │   └── custom-theme.css
│   │
│   └── utils/
│       └── routeMapper.js           # ⚠️ CRÍTICO: Mapeo de rutas dinámicas
│
├── .env                             # ⚠️ Variables de entorno
├── .npmrc                           # Configuración de npm (GitHub Packages)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

### 🔴 Archivos Críticos (NO modificar sin entender)

1. **`src/App.jsx`**: Configuración de rutas, providers, y layout
2. **`src/config/config.js`**: Configuración central de la aplicación
3. **`src/utils/routeMapper.js`**: Mapeo de componentes y rutas dinámicas
4. **`.env`**: Variables de entorno sensibles

### 🟢 Archivos para Personalizar

1. **`src/pages/**/*.jsx`**: Componentes personalizados del proyecto
2. **`src/styles/**/*.css`**: Estilos personalizados
3. **`src/index.css`**: Estilos globales adicionales

---

## 🏗️ Arquitectura y Patrones

### Patrón de Rutas Dinámicas

Las rutas se obtienen desde una API y se mapean a componentes React:

```
API Backend → JSON de rutas → routeMapper.js → React Router → Componentes
```

**Flujo**:
1. Usuario se loguea
2. `Login` llama a `/auth/login` y obtiene token
3. `Login` llama a `/routes` y obtiene estructura de menús
4. `routeMapper.js` convierte strings a componentes React
5. `App.jsx` renderiza las rutas con React Router

### Patrón de Componentes Genéricos

ruiBernate proporciona componentes que se configuran mediante props:

```jsx
// En lugar de crear un componente específico
<GenericMaster 
  endpoint="/api/productos"
  columns={[...]}
  title="Productos"
/>
```

### Patrón de Layout Dual (Desktop/Mobile)

```
Desktop: Login → Layer (sidebar + header) → Contenido
Mobile:  Login → MobileRedirect → MainMobile → Contenido móvil
```

---

## 🧩 Componentes de ruiBernate

### Componentes Principales

#### 1. **Login**
```jsx
import { Login } from "@xsolutioncl/ruibernate";

<Login axios={axiosInstance} config={config} />
```
- Maneja autenticación
- Carga rutas dinámicas
- Redirige a `/home` después del login

#### 2. **Layer** (Desktop)
```jsx
import { Layer } from "@xsolutioncl/ruibernate";

<Layer config={config} routes={mappedRoutes}>
  <MiComponente />
</Layer>
```
- Sidebar con menú dinámico
- Header con perfil y logout
- Selector de empresa
- Toggle de tema claro/oscuro

#### 3. **MainMobile** (Mobile)
```jsx
import { MainMobile } from "@xsolutioncl/ruibernate";

// En routeMapper.js
{
  type: "layout",
  path: "/mobile",
  component: MainMobile,
  children: [...]
}
```
- Bottom navigation
- Menú móvil optimizado
- Navegación táctil

#### 4. **GenericMaster**
```jsx
import { GenericMaster } from "@xsolutioncl/ruibernate";

<GenericMaster 
  endpoint="/api/productos"
  config={config}
/>
```
- Tabla con CRUD completo
- Búsqueda y filtros
- Paginación
- Exportación

#### 5. **GenericMasterDetail**
```jsx
import { GenericMasterDetail } from "@xsolutioncl/ruibernate";

<GenericMasterDetail 
  endpoint="/api/ordenes"
  config={config}
/>
```
- Maestro-detalle (header + lines)
- Edición inline
- Validaciones

#### 6. **ProtectedRoute**
```jsx
import { ProtectedRoute } from "@xsolutioncl/ruibernate";

<Route element={<ProtectedRoute isAllowed={isAuth} />}>
  <Route path="/home" element={<Home />} />
</Route>
```
- Protege rutas autenticadas
- Redirige a login si no autenticado

#### 7. **MobileRedirect**
```jsx
import { MobileRedirect } from "@xsolutioncl/ruibernate";

<MobileRedirect>
  <Routes>...</Routes>
</MobileRedirect>
```
- Detecta dispositivos móviles
- Redirige a `/mobile` automáticamente

### Hooks de ruiBernate

#### `useAuthStore`
```jsx
import { useAuthStore } from "@xsolutioncl/ruibernate";

const { isAuth, profile, login, logout } = useAuthStore();
```

#### `useRoutesStore`
```jsx
import { useRoutesStore } from "@xsolutioncl/ruibernate";

const { routes, setRoutes } = useRoutesStore();
```

#### `useThemeStore`
```jsx
import { useThemeStore } from "@xsolutioncl/ruibernate";

const { theme, changeTheme } = useThemeStore();
// theme: 'light' | 'dark'
```

#### `useIsMobile`
```jsx
import { useIsMobile } from "@xsolutioncl/ruibernate";

const { isMobile } = useIsMobile();
```

---

## 🗺️ Sistema de Rutas Dinámicas

### Formato de Respuesta del API

```json
{
  "routes": [
    {
      "type": "route",
      "path": "/home",
      "label": "Inicio",
      "component": "Home",
      "icon": "HomeOutlined",
      "insideBar": false
    },
    {
      "type": "menu",
      "key": "productos",
      "label": "Productos",
      "icon": "ShoppingOutlined",
      "insideBar": true,
      "children": [
        {
          "type": "route",
          "path": "/gm/productos",
          "label": "Lista de Productos",
          "component": "GenericMaster",
          "icon": "UnorderedListOutlined",
          "insideBar": true,
          "props": {
            "endpoint": "/api/productos"
          }
        }
      ]
    },
    {
      "type": "layout",
      "path": "/mobile",
      "component": "MainMobile",
      "children": [
        {
          "type": "route",
          "path": "",
          "component": "HomeMobile",
          "label": "Inicio",
          "icon": "HomeOutlined",
          "index": true
        }
      ]
    }
  ]
}
```

### Tipos de Rutas

1. **`type: "route"`**: Ruta normal
   - Requiere: `path`, `component`, `label`
   - Opcional: `icon`, `insideBar`, `props`

2. **`type: "menu"`**: Menú con submenús
   - Requiere: `key`, `label`, `children`
   - Opcional: `icon`, `insideBar`

3. **`type: "layout"`**: Layout con rutas hijas
   - Requiere: `path`, `component`, `children`
   - Usado para: MainMobile, layouts personalizados

### Mapeo de Componentes

En `src/utils/routeMapper.js`:

```javascript
const componentMap = {
  // Componentes de ruiBernate
  Home: Home,
  GenericMaster: GenericMaster,
  GenericMasterDetail: GenericMasterDetail,
  GenericMasterDetailMobile: GenericMasterDetailMobile,
  MainMobile: MainMobile,
  PerfilMobile: PerfilMobile,
  
  // ⚠️ Componentes personalizados del proyecto
  MiComponente: MiComponente,
  // Agregar aquí nuevos componentes
};
```

**Regla**: Si el API devuelve `"component": "MiComponente"`, debe existir en `componentMap`.

---

## 🎨 Sistema de Iconos

### Librerías Soportadas

El proyecto puede usar múltiples librerías de iconos:

1. **Ant Design Icons** (`@ant-design/icons`)
   - Ejemplo: `HomeOutlined`, `UserOutlined`

2. **Material Design Icons** (`react-icons/md`)
   - Ejemplo: `MdHome`, `MdDashboard`

3. **Typicons** (`react-icons/ti`)
   - Ejemplo: `TiHome`, `TiUser`

4. **Font Awesome** (`react-icons/fa`)
   - Ejemplo: `FaHome`, `FaUser`

5. **Feather Icons** (`react-icons/fi`)
   - Ejemplo: `FiHome`, `FiUser`

### Mapeo de Iconos

En `src/utils/routeMapper.js`:

```javascript
const getIconComponent = (iconName) => {
  if (!iconName) return undefined;
  
  // 1. Buscar en aliases
  const aliasedIconName = iconAliases[iconName];
  if (aliasedIconName) iconName = aliasedIconName;
  
  // 2. Buscar en Ant Design
  if (AntIcons[iconName]) return AntIcons[iconName];
  
  // 3. Buscar en Material Design
  if (MdIcons[iconName]) return MdIcons[iconName];
  
  // 4. Intentar variantes (Outlined, Filled, TwoTone)
  if (MdIcons[`${iconName}Outlined`]) return MdIcons[`${iconName}Outlined`];
  
  // 5. Fallback a icono por defecto
  return AntIcons['AppstoreOutlined'];
};
```

### Sistema de Aliases

Para iconos con nombres diferentes entre librerías:

```javascript
const iconAliases = {
  'MdAccountTree': 'TiTree',  // Si MdAccountTree no existe, usar TiTree
  // Agregar más aliases según necesidad
};
```

### Solución de Problemas con Iconos

**Problema**: Icono no se muestra
**Solución**:
1. Verificar que la librería esté instalada
2. Verificar el nombre exacto del icono
3. Agregar un alias si es necesario
4. Usar el fallback por defecto

---

## 🗄️ Gestión de Estado

### Zustand Stores

ruiBernate usa Zustand para gestión de estado global:

#### 1. **authStore** - Autenticación
```javascript
{
  isAuth: boolean,
  profile: object,
  token: string,
  login: (data) => void,
  logout: () => void,
  setProfile: (profile) => void
}
```

#### 2. **routesStore** - Rutas Dinámicas
```javascript
{
  routes: array,
  setRoutes: (routes) => void
}
```

#### 3. **themeStore** - Tema
```javascript
{
  theme: 'light' | 'dark',
  changeTheme: () => void
}
```

#### 4. **globalFiltersStore** - Filtros Globales
```javascript
{
  selectedCompany: object,
  setSelectedCompany: (company) => void,
  search: string,
  setSearch: (search) => void
}
```

#### 5. **menuStore** - Estado del Menú
```javascript
{
  collapsed: boolean,
  setCollapsed: (collapsed) => void
}
```

### Persistencia

- **authStore**: Se guarda en `localStorage` (token, profile)
- **themeStore**: Se guarda en `localStorage` (theme)
- **routesStore**: Solo en memoria (se recarga desde API)

---

## ⚙️ Configuración

### Archivo `src/config/config.js`

```javascript
const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
    timeout: 30000,
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || "Mi App",
    version: "1.0.0",
  },

  // User Field Mapping
  getUserField: (profile, field) => {
    const fieldMap = {
      name: profile?.nombre || profile?.name || "Usuario",
      email: profile?.correo || profile?.email || "",
      avatar: profile?.avatar || profile?.foto || null,
      company: profile?.empresa || profile?.company || null,
    };
    return fieldMap[field] || profile?.[field];
  },

  // Company Field Mapping
  getCompanyField: (company, field) => {
    const fieldMap = {
      id: company?.id_empresa || company?.id,
      name: company?.desc_empresa || company?.name,
      rut: company?.rut_empresa || company?.rut,
    };
    return fieldMap[field] || company?.[field];
  },

  // Endpoints
  endpoints: {
    login: "/auth/login",
    logout: "/auth/logout",
    routes: "/routes",
    profile: "/auth/profile",
    companies: "/companies",
  },
};

export default config;
```

### Variables de Entorno (`.env`)

```bash
# API Configuration
VITE_API_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=Mi Aplicación ERP

# GitHub Packages (si usas ruiBernate privado)
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

**⚠️ Importante**: Las variables deben empezar con `VITE_` para ser accesibles en el frontend.

---

## 🎨 Estilos y Temas

### Sistema de Temas

El proyecto soporta tema claro/oscuro mediante:

1. **Ant Design Algorithm**:
```jsx
<ConfigProvider 
  theme={{
    algorithm: currentTheme === 'dark' 
      ? theme.darkAlgorithm 
      : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#8b5cf6',
    },
  }}
>
```

2. **Variables CSS**:
```css
:root {
  --primary-color: #8b5cf6;
  --bg-dark: #0f172a;
  --text-primary: #f1f5f9;
}

:root:has([data-theme="light"]) {
  --bg-dark: #f8fafc;
  --text-primary: #0f172a;
}
```

### Personalización de Estilos

**Opción 1**: Crear `src/styles/custom-theme.css`
```css
/* Sobrescribir estilos de Ant Design */
.ant-btn-primary {
  background: var(--primary-gradient) !important;
}
```

**Opción 2**: Usar Tailwind CSS
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Contenido
</div>
```

**Opción 3**: Styled Components o CSS Modules
```jsx
import styles from './MiComponente.module.css';

<div className={styles.container}>...</div>
```

---

## ✅ Mejores Prácticas

### 1. NO Modificar ruiBernate

❌ **Incorrecto**:
```javascript
// Modificar node_modules/@xsolutioncl/ruibernate
```

✅ **Correcto**:
```javascript
// Crear componente personalizado en src/pages/
import { GenericMaster } from "@xsolutioncl/ruibernate";

function MiMasterPersonalizado(props) {
  return (
    <div className="mi-wrapper">
      <GenericMaster {...props} />
    </div>
  );
}
```

### 2. Usar Componentes Genéricos

❌ **Incorrecto**:
```javascript
// Crear componente desde cero para cada tabla
function ProductosTable() {
  const [data, setData] = useState([]);
  // ... 200 líneas de código ...
}
```

✅ **Correcto**:
```javascript
// Usar GenericMaster
<GenericMaster 
  endpoint="/api/productos"
  config={config}
/>
```

### 3. Mapear Componentes Correctamente

❌ **Incorrecto**:
```javascript
// En routeMapper.js
const componentMap = {
  // Falta mapear componente
};
```

✅ **Correcto**:
```javascript
// En routeMapper.js
import MiComponente from "../pages/MiComponente";

const componentMap = {
  GenericMaster: GenericMaster,
  MiComponente: MiComponente,  // ✅ Mapeado
};
```

### 4. Pasar Rutas Mapeadas al Layer

❌ **Incorrecto**:
```jsx
<Layer config={config}>
  {/* El sidebar no tendrá iconos */}
</Layer>
```

✅ **Correcto**:
```jsx
const dynamicRoutes = useMemo(() => 
  mapApiRoutesToReactRouter(dynamicRoutesFromAPI), 
  [dynamicRoutesFromAPI]
);

<Layer config={config} routes={dynamicRoutes}>
  {/* El sidebar tendrá iconos correctos */}
</Layer>
```

### 5. Usar Variables CSS para Estilos

❌ **Incorrecto**:
```css
.mi-componente {
  background: #1e293b;  /* Hardcoded */
  color: #f1f5f9;
}
```

✅ **Correcto**:
```css
.mi-componente {
  background: var(--bg-card);  /* Se adapta al tema */
  color: var(--text-primary);
}
```

### 6. Manejar Errores de Iconos

❌ **Incorrecto**:
```javascript
// Dejar que el icono falle silenciosamente
const Icon = getIconComponent(iconName);
return <Icon />;  // Puede ser undefined
```

✅ **Correcto**:
```javascript
const Icon = getIconComponent(iconName);
if (!Icon) {
  console.warn(`Icono "${iconName}" no encontrado`);
  const DefaultIcon = getIconComponent('AppstoreOutlined');
  return <DefaultIcon />;
}
return <Icon />;
```

### 7. Configurar Correctamente el API

❌ **Incorrecto**:
```javascript
// Hardcodear URLs
axios.get('http://localhost:8000/api/productos');
```

✅ **Correcto**:
```javascript
// Usar config
const { api } = config;
axios.get(`${api.baseUrl}/api/productos`);
```

---

## 🐛 Solución de Problemas Comunes

### Problema 1: "Componente no encontrado en componentMap"

**Síntoma**:
```
⚠️ Componente "MiComponente" no encontrado en componentMap
```

**Solución**:
1. Importar el componente en `routeMapper.js`
2. Agregarlo a `componentMap`
```javascript
import MiComponente from "../pages/MiComponente";

const componentMap = {
  MiComponente: MiComponente,
};
```

### Problema 2: "Icono no se muestra"

**Síntoma**: Espacio vacío donde debería estar el icono

**Solución**:
1. Verificar que la librería esté instalada
2. Verificar el nombre del icono en la documentación
3. Agregar alias si es necesario
4. Ver `ICON_TROUBLESHOOTING.md`

### Problema 3: "TypeError: Cannot read properties of undefined (reading 'baseUrl')"

**Síntoma**: Error al acceder a `config.api.baseUrl`

**Solución**:
1. Verificar que `config` se pase como prop
2. Verificar que `.env` tenga `VITE_API_URL`
3. Verificar que `config.js` esté correctamente configurado

### Problema 4: "Loop infinito al mapear rutas"

**Síntoma**: La aplicación se congela al cargar

**Solución**:
```javascript
// ❌ Incorrecto: Mapear y actualizar store en cada render
const dynamicRoutes = mapApiRoutesToReactRouter(dynamicRoutesFromAPI);
setRoutes(dynamicRoutes);  // Causa loop

// ✅ Correcto: Usar useMemo
const dynamicRoutes = useMemo(() => 
  mapApiRoutesToReactRouter(dynamicRoutesFromAPI), 
  [dynamicRoutesFromAPI]
);
```

### Problema 5: "Tema no cambia"

**Síntoma**: El botón de tema no hace nada

**Solución**:
1. Verificar que `ConfigProvider` tenga `algorithm` configurado
2. Verificar que `AntApp` tenga `data-theme={currentTheme}`
3. Verificar que las variables CSS usen `:root:has([data-theme="light"])`

### Problema 6: "Error 401 al llamar API"

**Síntoma**: Todas las llamadas API fallan con 401

**Solución**:
1. Verificar que el token esté en `localStorage`
2. Verificar que `axiosInstance` incluya el token en headers
3. Verificar que el backend acepte el token

### Problema 7: "Mobile no redirige"

**Síntoma**: En móvil no se redirige a `/mobile`

**Solución**:
1. Verificar que `MobileRedirect` esté envolviendo las rutas
2. Verificar que exista una ruta `/mobile` con `MainMobile`
3. Verificar que `useIsMobile` detecte correctamente el dispositivo

---

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Limpiar caché de Vite
rm -rf node_modules/.vite && npm run dev

# Verificar linter
npm run lint
```

### Build
```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

### Configuración
```bash
# Regenerar .env interactivamente
npx regenerate-env

# Instalar dependencias
npm install

# Actualizar ruiBernate
npm update @xsolutioncl/ruibernate
```

### Git
```bash
# Ver cambios
git status

# Commit
git add .
git commit -m "feat: descripción del cambio"

# Push
git push
```

---

## 📝 Checklist para Agentes

Cuando trabajes en un proyecto ruiBernate, verifica:

### Antes de Modificar Código
- [ ] ¿Entiendo la estructura del proyecto?
- [ ] ¿He leído `config.js` y `.env`?
- [ ] ¿He revisado `routeMapper.js`?
- [ ] ¿Conozco qué componentes están disponibles en ruiBernate?

### Al Agregar Componentes
- [ ] ¿El componente está en `src/pages/`?
- [ ] ¿Está importado en `routeMapper.js`?
- [ ] ¿Está agregado a `componentMap`?
- [ ] ¿El API devuelve el nombre correcto?

### Al Trabajar con Iconos
- [ ] ¿La librería de iconos está instalada?
- [ ] ¿El nombre del icono es correcto?
- [ ] ¿Hay un fallback si el icono no existe?
- [ ] ¿He consultado `ICON_TROUBLESHOOTING.md`?

### Al Personalizar Estilos
- [ ] ¿Estoy usando variables CSS?
- [ ] ¿Los estilos se adaptan al tema claro/oscuro?
- [ ] ¿No estoy modificando ruiBernate directamente?

### Antes de Commit
- [ ] ¿El código funciona en desarrollo?
- [ ] ¿No hay errores en consola?
- [ ] ¿He probado en móvil y desktop?
- [ ] ¿He documentado cambios importantes?

---

## 🎓 Recursos Adicionales

### Documentación del Proyecto
- `README.md` - Introducción general
- `QUICK_START.md` - Tutorial paso a paso
- `COMPONENTS_AND_ICONS_GUIDE.md` - Guía de componentes
- `ICON_TROUBLESHOOTING.md` - Solución de problemas con iconos
- `REGENERATE_ENV_GUIDE.md` - Guía de configuración
- `DOCUMENTATION_INDEX.md` - Índice completo

### Documentación Externa
- [Ant Design](https://ant.design/) - Componentes UI
- [React Router](https://reactrouter.com/) - Enrutamiento
- [Zustand](https://github.com/pmndrs/zustand) - Gestión de estado
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Estilos utility
- [React Icons](https://react-icons.github.io/react-icons/) - Iconos

---

## 💡 Consejos Finales para Agentes

1. **Lee primero, codifica después**: Entiende la estructura antes de modificar.

2. **Sigue los patrones existentes**: No inventes nuevas formas de hacer las cosas.

3. **No modifiques ruiBernate**: Extiende, no modifiques.

4. **Usa componentes genéricos**: Evita reinventar la rueda.

5. **Documenta cambios importantes**: Ayuda al siguiente desarrollador (o agente).

6. **Prueba en móvil y desktop**: La aplicación debe funcionar en ambos.

7. **Consulta la documentación**: Antes de preguntar, lee los docs.

8. **Mantén la consistencia**: Usa los mismos patrones que el resto del código.

9. **Piensa en mantenibilidad**: El código debe ser fácil de entender y modificar.

10. **Comunica claramente**: Explica qué hiciste y por qué.

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025  
**Mantenido por**: Equipo ruiBernate

---

¿Tienes dudas? Consulta `DOCUMENTATION_INDEX.md` para encontrar la guía adecuada.


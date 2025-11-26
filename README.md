# Aplicación ruiBernate

Esta aplicación fue creada con [create-ruibernate-app](https://github.com/xsolution/create-ruibernate-app).

## 🚀 Inicio rápido

### 1. Configurar variables de entorno y GitHub Packages

El proyecto ya tiene `.env` y `.npmrc` configurados, pero necesitas agregar tu token de GitHub:

**a) Configurar token de GitHub:**

```bash
# Crear token en: https://github.com/settings/tokens
# Permisos necesarios: read:packages, repo

# Configurar el token
export GITHUB_TOKEN=ghp_tu_token_aqui
echo 'export GITHUB_TOKEN=ghp_tu_token_aqui' >> ~/.zshrc
source ~/.zshrc
```

**b) Edita `.env` con la URL de tu API backend:**

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Mi Aplicación
VITE_APP_COMPANY=Mi Empresa
GITHUB_TOKEN=ghp_tu_token_aqui
```

**Nota:** El archivo `.npmrc` ya está configurado para usar GitHub Packages.

### 2. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 3. Construir para producción

```bash
npm run build
```

Los archivos optimizados se generarán en el directorio `dist/`.

## 📁 Estructura del proyecto

```
src/
├── config/
│   └── config.js         # Configuración de la app
├── pages/
│   └── home/
│       └── Home.jsx      # Página de inicio
├── utils/
│   └── routeMapper.js    # Mapeo de rutas del API
├── App.jsx               # Componente principal
├── main.jsx              # Punto de entrada
├── routes.jsx            # Rutas estáticas
└── index.css             # Estilos globales
```

## 🎨 Personalización

### Agregar un nuevo componente

1. Crea tu componente en `src/pages/`:

```jsx
// src/pages/MiComponente.jsx
export default function MiComponente() {
  return <div>Mi Componente</div>;
}
```

2. Regístralo en `src/utils/routeMapper.js`:

```javascript
import MiComponente from "../pages/MiComponente";

const componentMap = {
  Home: Home,
  GenericMaster: GenericMaster,
  GenericMasterDetail: GenericMasterDetail,
  MiComponente: MiComponente, // ← Agregar aquí
};
```

3. Configura la ruta en tu backend para que la devuelva en `/routes`:

```json
{
  "component": "MiComponente",
  "type": "route",
  "path": "/mi-ruta",
  "label": "Mi Componente",
  "insideBar": true,
  "icon": "MdDashboard"
}
```

### Usar GenericMaster

Para crear una vista tipo tabla con CRUD, simplemente configura la ruta en tu backend:

```json
{
  "component": "GenericMaster",
  "type": "route",
  "path": "/gm/usuarios",
  "label": "Usuarios",
  "insideBar": true,
  "icon": "MdPeople",
  "props": {
    "pk": "id_usuario",
    "path": "usuarios",
    "title": "Usuario",
    "title_plural": "Usuarios"
  }
}
```

### Usar GenericMasterDetail

Para crear una vista maestro-detalle:

```json
{
  "component": "GenericMasterDetail",
  "type": "route",
  "path": "/gmd/pedidos",
  "label": "Pedidos",
  "insideBar": true,
  "icon": "MdShoppingCart",
  "props": {
    "pk": "id_pedido",
    "path": "pedidos",
    "title": "Pedido"
  }
}
```

## 📚 Documentación

- [ruiBernate Docs](https://ruibernate.xsolution.cl/docs)
- [Ant Design Components](https://ant.design/components/overview/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

## 🐛 Problemas

Si encuentras algún problema, por favor repórtalo en:
- [ruiBernate Issues](https://github.com/xsolution/ruibernate/issues)
- [create-ruibernate-app Issues](https://github.com/xsolution/create-ruibernate-app/issues)

## 📄 Licencia

MIT


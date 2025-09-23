# Etapa de construcción
FROM oven/bun:latest as build

WORKDIR /app

# ARG API_URL
ENV VITE_API_URL="https://api.subcheck.cl/"

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json bun.lockb ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación con optimizaciones
RUN bun run build

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"] 
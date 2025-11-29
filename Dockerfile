# ================================
# Dockerfile para proyectos ruiBernate
# Multi-stage build optimizado para producción
# ================================

# === Stage 1: Build ===
FROM node:20-alpine AS builder

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias primero (mejor uso de cache)
COPY package.json ./

# Variables de entorno para el build
ARG GITHUB_TOKEN

# Variables VITE para la aplicación
ARG VITE_API_URL
ARG VITE_APP_NAME
ARG VITE_APP_COMPANY
ARG VITE_APP_LOGO
ARG VITE_USER_NAME_FIELD
ARG VITE_USER_LAST_LOGIN_FIELD
ARG VITE_USER_LAST_LOGOUT_FIELD
ARG VITE_USER_EMAIL_FIELD
ARG VITE_USER_USERNAME_FIELD
ARG VITE_USER_COMPANY_FIELD
ARG VITE_USER_COMPANY_ID_FIELD
ARG VITE_WELCOME_MESSAGE
ARG VITE_WELCOME_BACK_MESSAGE
ARG VITE_LOGOUT_MESSAGE

# PWA Configuration
ARG VITE_PWA_ENABLED
ARG VITE_PWA_SHORT_NAME
ARG VITE_PWA_THEME_COLOR
ARG VITE_PWA_BACKGROUND_COLOR
ARG VITE_VAPID_PUBLIC_KEY
ARG VITE_PUSH_SUBSCRIBE_ENDPOINT
ARG VITE_PUSH_UNSUBSCRIBE_ENDPOINT

# Convertir ARG a ENV para que Vite las use durante el build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_COMPANY=$VITE_APP_COMPANY
ENV VITE_APP_LOGO=$VITE_APP_LOGO
ENV VITE_USER_NAME_FIELD=$VITE_USER_NAME_FIELD
ENV VITE_USER_LAST_LOGIN_FIELD=$VITE_USER_LAST_LOGIN_FIELD
ENV VITE_USER_LAST_LOGOUT_FIELD=$VITE_USER_LAST_LOGOUT_FIELD
ENV VITE_USER_EMAIL_FIELD=$VITE_USER_EMAIL_FIELD
ENV VITE_USER_USERNAME_FIELD=$VITE_USER_USERNAME_FIELD
ENV VITE_USER_COMPANY_FIELD=$VITE_USER_COMPANY_FIELD
ENV VITE_USER_COMPANY_ID_FIELD=$VITE_USER_COMPANY_ID_FIELD
ENV VITE_WELCOME_MESSAGE=$VITE_WELCOME_MESSAGE
ENV VITE_WELCOME_BACK_MESSAGE=$VITE_WELCOME_BACK_MESSAGE
ENV VITE_LOGOUT_MESSAGE=$VITE_LOGOUT_MESSAGE
ENV VITE_PWA_ENABLED=$VITE_PWA_ENABLED
ENV VITE_PWA_SHORT_NAME=$VITE_PWA_SHORT_NAME
ENV VITE_PWA_THEME_COLOR=$VITE_PWA_THEME_COLOR
ENV VITE_PWA_BACKGROUND_COLOR=$VITE_PWA_BACKGROUND_COLOR
ENV VITE_VAPID_PUBLIC_KEY=$VITE_VAPID_PUBLIC_KEY
ENV VITE_PUSH_SUBSCRIBE_ENDPOINT=$VITE_PUSH_SUBSCRIBE_ENDPOINT
ENV VITE_PUSH_UNSUBSCRIBE_ENDPOINT=$VITE_PUSH_UNSUBSCRIBE_ENDPOINT

# Crear .npmrc con el token de GitHub
RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc && \
    echo "@xsolutioncl:registry=https://npm.pkg.github.com/" >> .npmrc

# Instalar dependencias (npm install resuelve binarios nativos correctamente)
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# === Stage 2: Production ===
FROM nginx:alpine AS production

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos estáticos desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nextjs:nodejs /var/run/nginx.pid

# Exponer puerto
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]


#!/bin/bash
# ================================
# Script para construir imagen Docker
# Usa .env.prod por defecto para producción
# ================================

set -e

# Determinar qué archivo .env usar
ENV_FILE=${1:-.env.prod}

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Archivo $ENV_FILE no encontrado"
    echo "   Uso: ./build-docker.sh [archivo_env]"
    echo "   Ejemplo: ./build-docker.sh .env.prod"
    exit 1
fi

echo "📦 Cargando variables desde $ENV_FILE..."
export $(grep -v '^#' "$ENV_FILE" | grep -v '^$' | xargs)

# Nombre de la imagen
IMAGE_NAME=${IMAGE_NAME:-"xrrhh-front"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}

echo ""
echo "🐳 Construyendo imagen: $IMAGE_NAME:$IMAGE_TAG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   API URL:     $VITE_API_URL"
echo "   App Name:    $VITE_APP_NAME"
echo "   Company:     $VITE_APP_COMPANY"
echo "   Logo:        $VITE_APP_LOGO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Construir imagen con todas las variables (para AMD64)
docker build --platform linux/amd64 -t "$IMAGE_NAME:$IMAGE_TAG" \
  --build-arg GITHUB_TOKEN="${GITHUB_TOKEN}" \
  --build-arg VITE_API_URL="${VITE_API_URL}" \
  --build-arg VITE_APP_NAME="${VITE_APP_NAME}" \
  --build-arg VITE_APP_COMPANY="${VITE_APP_COMPANY}" \
  --build-arg VITE_APP_LOGO="${VITE_APP_LOGO}" \
  --build-arg VITE_USER_NAME_FIELD="${VITE_USER_NAME_FIELD}" \
  --build-arg VITE_USER_LAST_LOGIN_FIELD="${VITE_USER_LAST_LOGIN_FIELD}" \
  --build-arg VITE_USER_LAST_LOGOUT_FIELD="${VITE_USER_LAST_LOGOUT_FIELD}" \
  --build-arg VITE_USER_EMAIL_FIELD="${VITE_USER_EMAIL_FIELD}" \
  --build-arg VITE_USER_USERNAME_FIELD="${VITE_USER_USERNAME_FIELD}" \
  --build-arg VITE_USER_COMPANY_FIELD="${VITE_USER_COMPANY_FIELD}" \
  --build-arg VITE_USER_COMPANY_ID_FIELD="${VITE_USER_COMPANY_ID_FIELD}" \
  --build-arg VITE_WELCOME_MESSAGE="${VITE_WELCOME_MESSAGE}" \
  --build-arg VITE_WELCOME_BACK_MESSAGE="${VITE_WELCOME_BACK_MESSAGE}" \
  --build-arg VITE_LOGOUT_MESSAGE="${VITE_LOGOUT_MESSAGE}" \
  --build-arg VITE_PWA_ENABLED="${VITE_PWA_ENABLED}" \
  --build-arg VITE_PWA_SHORT_NAME="${VITE_PWA_SHORT_NAME}" \
  --build-arg VITE_PWA_THEME_COLOR="${VITE_PWA_THEME_COLOR}" \
  --build-arg VITE_PWA_BACKGROUND_COLOR="${VITE_PWA_BACKGROUND_COLOR}" \
  --build-arg VITE_VAPID_PUBLIC_KEY="${VITE_VAPID_PUBLIC_KEY}" \
  --build-arg VITE_PUSH_SUBSCRIBE_ENDPOINT="${VITE_PUSH_SUBSCRIBE_ENDPOINT}" \
  --build-arg VITE_PUSH_UNSUBSCRIBE_ENDPOINT="${VITE_PUSH_UNSUBSCRIBE_ENDPOINT}" \
  .

echo ""
echo "✅ Imagen construida exitosamente: $IMAGE_NAME:$IMAGE_TAG"
echo ""
echo "Para ejecutar localmente:"
echo "  docker run -d -p 3000:80 --name xrrhh $IMAGE_NAME:$IMAGE_TAG"
echo ""
echo "Para ver los logs:"
echo "  docker logs -f xrrhh"
echo ""
echo "Para publicar en Docker Hub:"
echo "  ./publish-docker.sh"

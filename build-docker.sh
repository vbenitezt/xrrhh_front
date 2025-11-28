#!/bin/bash
# ================================
# Script para construir imagen Docker
# Lee automáticamente las variables del .env
# ================================

set -e

# Cargar variables del .env si existe
if [ -f .env ]; then
    echo "📦 Cargando variables desde .env..."
    export $(grep -v '^#' .env | grep -v '^$' | xargs)
fi

# Nombre de la imagen (puedes cambiarlo)
IMAGE_NAME=${IMAGE_NAME:-"xrrhh-front"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}

echo "🐳 Construyendo imagen: $IMAGE_NAME:$IMAGE_TAG"
echo "   API URL: $VITE_API_URL"
echo "   App Name: $VITE_APP_NAME"

# Construir imagen
docker build -t "$IMAGE_NAME:$IMAGE_TAG" \
  --build-arg VITE_API_URL="${VITE_API_URL}" \
  --build-arg VITE_APP_NAME="${VITE_APP_NAME}" \
  --build-arg VITE_APP_COMPANY="${VITE_APP_COMPANY}" \
  --build-arg GITHUB_TOKEN="${GITHUB_TOKEN}" \
  .

echo ""
echo "✅ Imagen construida exitosamente: $IMAGE_NAME:$IMAGE_TAG"
echo ""
echo "Para ejecutar:"
echo "  docker run -d -p 3000:80 $IMAGE_NAME:$IMAGE_TAG"
echo ""
echo "O con docker-compose:"
echo "  docker-compose up -d"


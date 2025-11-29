#!/bin/bash
# ================================
# Script para publicar imagen en Docker Hub
# ================================

set -e

# Configuración - CAMBIA ESTOS VALORES
DOCKERHUB_USER="${DOCKERHUB_USER:-vbenitezt}"
IMAGE_NAME="${IMAGE_NAME:-xrrhh-front}"
VERSION="${VERSION:-latest}"

# Nombre completo de la imagen
FULL_IMAGE_NAME="$DOCKERHUB_USER/$IMAGE_NAME"

echo "🐳 Publicando imagen en Docker Hub"
echo "   Usuario: $DOCKERHUB_USER"
echo "   Imagen: $IMAGE_NAME"
echo "   Versión: $VERSION"
echo ""

# Verificar si está logueado
if ! docker info 2>/dev/null | grep -q "Username"; then
    echo "⚠️  No estás logueado en Docker Hub"
    echo "   Ejecutando: docker login"
    docker login
fi

# Verificar que la imagen local existe
if ! docker image inspect "$IMAGE_NAME:latest" &> /dev/null; then
    echo "❌ La imagen local '$IMAGE_NAME:latest' no existe"
    echo "   Primero construye la imagen con: ./build-docker.sh"
    exit 1
fi

# Etiquetar imagen
echo "🏷️  Etiquetando imagen..."
docker tag "$IMAGE_NAME:latest" "$FULL_IMAGE_NAME:latest"
docker tag "$IMAGE_NAME:latest" "$FULL_IMAGE_NAME:$VERSION"

# Subir imagen
echo "📤 Subiendo imagen a Docker Hub..."
docker push "$FULL_IMAGE_NAME:latest"
docker push "$FULL_IMAGE_NAME:$VERSION"

echo ""
echo "✅ Imagen publicada exitosamente!"
echo ""
echo "Para descargar en otro servidor:"
echo "  docker pull $FULL_IMAGE_NAME:latest"
echo ""
echo "Para ejecutar:"
echo "  docker run -d -p 80:80 $FULL_IMAGE_NAME:latest"


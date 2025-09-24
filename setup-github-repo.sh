#!/bin/bash

# Script para crear repositorio en GitHub y hacer push inicial
# Para la organización radhikatmosphere

echo "🚀 Configurando repositorio en GitHub para radhikatmosphere..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "README.md" ]; then
    echo "❌ No estás en el directorio raíz del proyecto live-audio"
    exit 1
fi

# Verificar que git está inicializado
if [ ! -d ".git" ]; then
    echo "❌ Git no está inicializado. Ejecuta 'git init' primero"
    exit 1
fi

# Verificar que gh (GitHub CLI) está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) no está instalado"
    echo "Instálalo desde: https://cli.github.com/"
    exit 1
fi

# Verificar autenticación con GitHub
echo "🔐 Verificando autenticación con GitHub..."
gh auth status

if [ $? -ne 0 ]; then
    echo "📝 Por favor, autentícate con GitHub primero:"
    echo "   gh auth login"
    exit 1
fi

# Verificar acceso a la organización
echo "🏢 Verificando acceso a la organización radhikatmosphere..."
gh api orgs/radhikatmosphere --silent

if [ $? -ne 0 ]; then
    echo "❌ No tienes acceso a la organización radhikatmosphere"
    echo "   Asegúrate de ser miembro de la organización"
    exit 1
fi

# Crear repositorio en la organización
echo "📁 Creando repositorio 'live-audio' en radhikatmosphere..."
gh repo create radhikatmosphere/live-audio \
    --public \
    --description "Visualización interactiva de audio en tiempo real con efectos 3D y IA" \
    --homepage "https://radhikatmosphere.com" \
    --disable-wiki \
    --disable-issues

if [ $? -ne 0 ]; then
    echo "❌ Error al crear el repositorio"
    echo "   Puede que el repositorio ya exista o no tengas permisos"
    exit 1
fi

# Agregar remote y hacer push
echo "🔗 Agregando remote origin..."
git remote add origin https://github.com/radhikatmosphere/live-audio.git

echo "📤 Haciendo push del código inicial..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ ¡Éxito! El repositorio ha sido creado y el código subido"
    echo ""
    echo "🌐 URL del repositorio: https://github.com/radhikatmosphere/live-audio"
    echo "📝 Configura los secrets de GitHub Actions para el despliegue automático"
    echo "   - CLOUDFLARE_API_TOKEN"
    echo "   - CLOUDFLARE_ACCOUNT_ID"
else
    echo "❌ Error al hacer push"
    echo "   Verifica tu conexión y permisos"
    exit 1
fi
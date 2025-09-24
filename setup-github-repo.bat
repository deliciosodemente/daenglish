@echo off
REM Script para crear repositorio en GitHub y hacer push inicial
REM Para la organización radhikatmosphere

echo 🚀 Configurando repositorio en GitHub para radhikatmosphere...

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ No estás en el directorio raíz del proyecto live-audio
    exit /b 1
)

if not exist "README.md" (
    echo ❌ No estás en el directorio raíz del proyecto live-audio
    exit /b 1
)

REM Verificar que git está inicializado
if not exist ".git" (
    echo ❌ Git no está inicializado. Ejecuta 'git init' primero
    exit /b 1
)

REM Verificar que gh (GitHub CLI) está instalado
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ GitHub CLI (gh) no está instalado
    echo Instálalo desde: https://cli.github.com/
    exit /b 1
)

REM Verificar autenticación con GitHub
echo 🔐 Verificando autenticación con GitHub...
gh auth status

if %errorlevel% neq 0 (
    echo 📝 Por favor, autentícate con GitHub primero:
    echo    gh auth login
    exit /b 1
)

REM Verificar acceso a la organización
echo 🏢 Verificando acceso a la organización radhikatmosphere...
gh api orgs/radhikatmosphere --silent

if %errorlevel% neq 0 (
    echo ❌ No tienes acceso a la organización radhikatmosphere
    echo    Asegúrate de ser miembro de la organización
    exit /b 1
)

REM Crear repositorio en la organización
echo 📁 Creando repositorio 'live-audio' en radhikatmosphere...
gh repo create radhikatmosphere/live-audio --public --description "Visualización interactiva de audio en tiempo real con efectos 3D y IA" --homepage "https://radhikatmosphere.com" --disable-wiki --disable-issues

if %errorlevel% neq 0 (
    echo ❌ Error al crear el repositorio
    echo    Puede que el repositorio ya exista o no tengas permisos
    exit /b 1
)

REM Agregar remote y hacer push
echo 🔗 Agregando remote origin...
git remote add origin https://github.com/radhikatmosphere/live-audio.git

echo 📤 Haciendo push del código inicial...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ ¡Éxito! El repositorio ha sido creado y el código subido
    echo.
    echo 🌐 URL del repositorio: https://github.com/radhikatmosphere/live-audio
    echo 📝 Configura los secrets de GitHub Actions para el despliegue automático
    echo    - CLOUDFLARE_API_TOKEN
    echo    - CLOUDFLARE_ACCOUNT_ID
) else (
    echo ❌ Error al hacer push
    echo    Verifica tu conexión y permisos
    exit /b 1
)
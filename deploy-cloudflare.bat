@echo off
REM Cloudflare Workers Deployment Script for Live Audio v0.0.1

echo 🚀 Deploying Live Audio to Cloudflare Workers...

REM Check if npm/npx is available
where npx >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm/npx is required but not installed.
    exit /b 1
)

REM Check if required files exist
echo 📋 Checking required files...
if not exist "wrangler.jsonc" (
    echo ❌ wrangler.jsonc not found
    exit /b 1
)

if not exist "src\index.ts" (
    echo ❌ src\index.ts not found
    exit /b 1
)

if not exist "dist" (
    echo ⚠️  dist directory not found, building...
    npm run build
)

REM Build the project
echo 🔨 Building project...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

REM Check if user is authenticated
echo 🔐 Checking Cloudflare authentication...
npx wrangler whoami

if %errorlevel% neq 0 (
    echo 📝 Please authenticate with Cloudflare first:
    echo    npx wrangler login
    exit /b 1
)

REM Deploy to Cloudflare Workers
echo ☁️  Deploying to Cloudflare Workers...
npx wrangler deploy

if %errorlevel% equ 0 (
    echo ✅ Successfully deployed to Cloudflare Workers!
    echo.
    echo 🌐 Your Live Audio application is now live!
    echo 📖 Check the deployment logs above for the URL
    echo.
    echo Next steps:
    echo 1. Set your GEMINI_API_KEY in the Cloudflare dashboard
    echo 2. Visit your worker URL to test the application
    echo 3. Monitor logs with: npx wrangler tail
) else (
    echo ❌ Deployment failed
    exit /b 1
)
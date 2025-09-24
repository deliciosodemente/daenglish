@echo off
REM Live Audio Application Deployment Script
REM Version 0.0.1

echo 🚀 Starting deployment of Live Audio v0.0.1

REM Check if required files exist
if not exist "package.json" (
    echo ❌ package.json not found
    exit /b 1
)

if not exist ".env.local" (
    echo ❌ .env.local not found
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci
if errorlevel 1 (
    echo ❌ Dependency installation failed
    exit /b 1
)

REM Build the application
echo 🔨 Building application...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

REM Check if build was successful
if not exist "dist" (
    echo ❌ Build failed - dist directory not found
    exit /b 1
)

echo ✅ Build completed successfully

REM Optional: Docker deployment
where docker >nul 2>nul
if %errorlevel% == 0 (
    echo 🐳 Building Docker image...
    docker build -t live-audio:v0.0.1 .
    if errorlevel 1 (
        echo ❌ Docker build failed
    ) else (
        echo ✅ Docker image built successfully
    )
)

echo 🎉 Deployment ready!
echo    - Local preview: npm run preview
echo    - Docker: docker-compose up -d
echo    - Production: Configure your web server to serve the 'dist' folder
pause
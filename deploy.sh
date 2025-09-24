#!/bin/bash

# Live Audio Application Deployment Script
# Version 0.0.1

set -e

echo "🚀 Starting deployment of Live Audio v0.0.1"

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Optional: Docker deployment
if command -v docker &> /dev/null; then
    echo "🐳 Building Docker image..."
    docker build -t live-audio:v0.0.1 .
    echo "✅ Docker image built successfully"
fi

echo "🎉 Deployment ready!"
echo "   - Local preview: npm run preview"
echo "   - Docker: docker-compose up -d"
echo "   - Production: Configure your web server to serve the 'dist' folder"
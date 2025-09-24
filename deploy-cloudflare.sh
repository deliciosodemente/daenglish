#!/bin/bash

# Cloudflare Workers Deployment Script for Live Audio v0.0.1

echo "🚀 Deploying Live Audio to Cloudflare Workers..."

# Check if Wrangler is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npm/npx is required but not installed."
    exit 1
fi

# Check if required files exist
echo "📋 Checking required files..."
if [ ! -f "wrangler.jsonc" ]; then
    echo "❌ wrangler.jsonc not found"
    exit 1
fi

if [ ! -f "src/index.ts" ]; then
    echo "❌ src/index.ts not found"
    exit 1
fi

if [ ! -d "dist" ]; then
    echo "⚠️  dist directory not found, building..."
    npm run build
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Check if user is authenticated
echo "🔐 Checking Cloudflare authentication..."
npx wrangler whoami

if [ $? -ne 0 ]; then
    echo "📝 Please authenticate with Cloudflare first:"
    echo "   npx wrangler login"
    exit 1
fi

# Deploy to Cloudflare Workers
echo "☁️  Deploying to Cloudflare Workers..."
npx wrangler deploy

if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed to Cloudflare Workers!"
    echo ""
    echo "🌐 Your Live Audio application is now live!"
    echo "📖 Check the deployment logs above for the URL"
    echo ""
    echo "Next steps:"
    echo "1. Set your GEMINI_API_KEY in the Cloudflare dashboard"
    echo "2. Visit your worker URL to test the application"
    echo "3. Monitor logs with: npx wrangler tail"
else
    echo "❌ Deployment failed"
    exit 1
fi
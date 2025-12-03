#!/bin/bash

# SAKEC ACM Website - cPanel Deployment Script
# This script builds the project and prepares it for cPanel upload

echo "🚀 Starting deployment process..."
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with your Supabase credentials"
    exit 1
fi

# Check if Supabase key is added
if grep -q "ADD_YOUR_ANON_KEY_HERE" .env; then
    echo "⚠️  Warning: Supabase anon key not added!"
    echo "Please add your Supabase anon key to .env file"
    echo "Get it from: https://supabase.com/dashboard/project/dhxzkzdlsszwuqjkicnv/settings/api"
    exit 1
fi

echo "✅ Environment variables found"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📁 Files ready in 'dist/' folder"
    echo ""
    echo "📋 Next steps:"
    echo "1. Log into your cPanel"
    echo "2. Open File Manager"
    echo "3. Navigate to public_html/"
    echo "4. Upload all files from 'dist/' folder"
    echo "5. Upload '.htaccess' file from project root"
    echo "6. Visit your domain to verify"
    echo ""
    echo "🎉 Deployment package ready!"
else
    echo ""
    echo "❌ Build failed!"
    echo "Please check the errors above and try again"
    exit 1
fi

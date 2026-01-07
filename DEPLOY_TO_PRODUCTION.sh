#!/bin/bash

# Deployment script for production fix
# This fixes the 500 error by pulling latest code and rebuilding

echo "🚀 Deploying admin route fix to production..."

# Navigate to production directory (adjust path as needed)
cd /home/forge/transport.on-forge.com/current || exit

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing Composer dependencies..."
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

echo "📦 Installing Node dependencies..."
npm ci --prefer-offline --no-audit || npm install --prefer-offline --no-audit

echo "🏗️  Building frontend assets..."
npm run build

echo "🧹 Clearing all caches..."
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Deployment complete!"
echo ""
echo "Verify the fix:"
echo "1. Login page: https://transport.on-forge.com/login"
echo "2. Admin dashboard: https://transport.on-forge.com/admin/dashboard"
echo "3. Admin redirect: https://transport.on-forge.com/admin"










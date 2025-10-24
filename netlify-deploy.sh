#!/bin/bash

# 🚀 Money Tracker - Netlify Deployment Script

echo "🎯 Money Tracker - Netlify Deployment Assistant"
echo "=============================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check if user is logged in
if ! netlify whoami &> /dev/null; then
    echo "🔐 Please login to Netlify:"
    netlify login
fi

# Check build
echo "🔨 Testing production build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

echo ""
echo "🌐 Netlify Deployment Options:"
echo "1) Deploy to Netlify (Manual)"
echo "2) Setup GitHub Auto-Deploy"
echo "3) Deploy Preview"
echo "4) Environment Setup Guide"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Netlify..."
        echo "📋 Make sure you have:"
        echo "   ✅ Netlify account"
        echo "   ✅ External database (PostgreSQL/MySQL)"
        echo "   ✅ Environment variables configured"
        echo ""
        echo "🔧 Deploy command:"
        echo "   netlify deploy --prod --dir=.next"
        echo ""
        echo "📱 After deployment:"
        echo "   - Open app in mobile browser"
        echo "   - Add to Home Screen for PWA experience"
        ;;
    2)
        echo "🔗 Setup GitHub Auto-Deploy..."
        echo "📋 Steps:"
        echo "   1. Push code to GitHub"
        echo "   2. Connect Netlify to GitHub"
        echo "   3. Configure build settings:"
        echo "      - Build command: npm run build"
        echo "      - Publish directory: .next"
        echo "      - Functions directory: netlify/functions"
        echo "   4. Set environment variables"
        echo "   5. Deploy! 🚀"
        echo ""
        echo "🔧 Git commands:"
        echo "   git add ."
        echo "   git commit -m 'Ready for Netlify deployment'"
        echo "   git push origin main"
        ;;
    3)
        echo "👀 Creating Deploy Preview..."
        netlify deploy --dir=.next
        ;;
    4)
        echo "⚙️ Environment Setup Guide:"
        echo ""
        echo "🗄️ Database Options (Required):"
        echo "   1. Supabase (Recommended - Free tier available)"
        echo "      - Create project at supabase.com"
        echo "      - Get connection string"
        echo "      - DATABASE_URL=postgresql://user:pass@host:port/db"
        echo ""
        echo "   2. PlanetScale (MySQL - Free tier available)"
        echo "      - Create database at planetscale.com"
        echo "      - Get connection string"
        echo "      - DATABASE_URL=mysql://user:pass@host:port/db"
        echo ""
        echo "   3. Railway (PostgreSQL - Free tier available)"
        echo "      - Create database at railway.app"
        echo "      - Get connection string"
        echo "      - DATABASE_URL=postgresql://user:pass@host:port/db"
        echo ""
        echo "🔧 Netlify Environment Variables:"
        echo "   1. Go to Netlify dashboard → Site settings → Build & deploy → Environment"
        echo "   2. Add these variables:"
        echo "      - DATABASE_URL=your_database_connection_string"
        echo "      - NODE_ENV=production"
        echo "      - NEXTAUTH_URL=https://yoursite.netlify.app"
        echo "      - NEXTAUTH_SECRET=your_secret_key"
        echo ""
        echo "🔑 Generate NEXTAUTH_SECRET:"
        echo "   openssl rand -base64 32"
        echo ""
        echo "📱 Mobile Optimization:"
        echo "   ✅ PWA manifest configured"
        echo "   ✅ Service worker ready"
        echo "   ✅ Responsive design"
        echo "   ✅ Touch-friendly interface"
        ;;
    *)
        echo "❌ Invalid choice. Please run script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Money Tracker is ready for Netlify deployment!"
echo ""
echo "📊 App Features:"
echo "   ✅ Progressive Web App (PWA)"
echo "   ✅ Mobile-first responsive design"
echo "   ✅ Real-time transaction tracking"
echo "   ✅ Budget management"
echo "   ✅ Savings goals"
echo "   ✅ Cash flow charts"
echo "   ✅ Data export functionality"
echo "   ✅ Dark theme support"
echo ""
echo "🚀 Deploy now and start tracking your finances!"
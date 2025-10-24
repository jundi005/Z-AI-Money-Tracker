#!/bin/bash

# 🚀 Personal Finance App - Deployment Script

echo "🎯 Personal Finance App - Deployment Assistant"
echo "============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Personal Finance App with Next.js 15"
    echo "✅ Git repository initialized"
fi

# Check build
echo "🔨 Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo ""
echo "🌐 Choose Deployment Option:"
echo "1) Vercel (Recommended - Free & Easy)"
echo "2) Netlify (Free & Easy)"
echo "3) Self-Hosting (VPS/Dedicated Server)"
echo "4) PWA Setup (Mobile App-like Experience)"
echo "5) Capacitor (Native Android App)"
echo "6) Local Network Testing"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        echo "📋 Prerequisites:"
        echo "   - Install Vercel CLI: npm install -g vercel"
        echo "   - Login: vercel login"
        echo "   - Setup DATABASE_URL in Vercel dashboard"
        echo ""
        echo "🔧 Commands:"
        echo "   vercel --prod"
        echo ""
        echo "📱 After deployment, open app on mobile and 'Add to Home Screen'"
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        echo "📋 Prerequisites:"
        echo "   - Install Netlify CLI: npm install -g netlify-cli"
        echo "   - Login: netlify login"
        echo "   - Setup environment variables in Netlify dashboard"
        echo ""
        echo "🔧 Commands:"
        echo "   netlify deploy --prod --dir=.next"
        echo ""
        echo "📱 After deployment, open app on mobile and 'Add to Home Screen'"
        ;;
    3)
        echo "🖥️ Self-Hosting Setup..."
        echo "📋 Prerequisites:"
        echo "   - VPS or dedicated server"
        echo "   - Node.js 18+ installed"
        echo "   - Domain name (optional)"
        echo ""
        echo "🔧 Setup Commands:"
        echo "   git clone <your-repo>"
        echo "   cd finance-app"
        echo "   npm install"
        echo "   npm run build"
        echo "   npm install -g pm2"
        echo "   pm2 start npm --name 'finance-app' -- start"
        echo "   pm2 startup && pm2 save"
        echo ""
        echo "🔧 Nginx Configuration (optional):"
        echo "   sudo apt install nginx"
        echo "   # Configure reverse proxy in /etc/nginx/sites-available/"
        ;;
    4)
        echo "📱 PWA Setup..."
        echo "✅ PWA is already configured!"
        echo ""
        echo "📋 To test PWA:"
        echo "   1. Deploy app using option 1 or 2"
        echo "   2. Open app in mobile browser"
        echo "   3. Look for 'Add to Home Screen' prompt"
        echo "   4. Install as PWA"
        echo ""
        echo "🎯 PWA Features:"
        echo "   - Offline support"
        echo "   - App-like experience"
        echo "   - Push notifications ready"
        echo "   - Auto-updates"
        ;;
    5)
        echo "📲 Capacitor Setup for Android App..."
        echo "📋 Prerequisites:"
        echo "   - Android Studio installed"
        echo "   - Java JDK 11+"
        echo "   - Android SDK"
        echo ""
        echo "🔧 Setup Commands:"
        echo "   npm install @capacitor/core @capacitor/cli @capacitor/android"
        echo "   npx cap init finance-app com.example.financeapp"
        echo "   npm run build"
        echo "   npx cap add android"
        echo "   npx cap sync android"
        echo "   npx cap open android"
        echo ""
        echo "📱 Build APK in Android Studio:"
        echo "   Build > Build Bundle(s) / APK(s) > Build APK(s)"
        ;;
    6)
        echo "📡 Local Network Testing..."
        echo "🔧 Finding your IP address..."
        
        # Get IP address
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
        else
            # Linux
            IP=$(hostname -I | awk '{print $1}')
        fi
        
        echo "📡 Your IP address: $IP"
        echo ""
        echo "📱 Access from mobile:"
        echo "   1. Connect mobile and computer to same WiFi"
        echo "   2. Open browser on mobile"
        echo "   3. Go to: http://$IP:3000"
        echo ""
        echo "🔧 Make sure server is running:"
        echo "   npm run dev"
        echo ""
        echo "🌐 Or test with: http://localhost:3000 on computer"
        ;;
    *)
        echo "❌ Invalid choice. Please run script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment guide ready! Check DEPLOYMENT.md for detailed instructions."
echo ""
echo "📊 App Features Ready for Production:"
echo "   ✅ Responsive design for all devices"
echo "   ✅ PWA support (install as mobile app)"
echo "   ✅ SQLite database (for local/self-hosting)"
echo "   ✅ API endpoints for mobile apps"
echo "   ✅ Real-time updates with Socket.IO"
echo "   ✅ Modern UI with shadcn/ui components"
echo "   ✅ Cash flow charts and statistics"
echo "   ✅ Category management"
echo "   ✅ Budget tracking"
echo "   ✅ Savings goals"
echo ""
echo "🚀 Ready to deploy! Choose your preferred option above."
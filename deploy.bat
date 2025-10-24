@echo off
REM 🚀 Personal Finance App - Deployment Script for Windows

echo 🎯 Personal Finance App - Deployment Assistant
echo =============================================

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: Personal Finance App with Next.js 15"
    echo ✅ Git repository initialized
)

REM Check build
echo 🔨 Testing production build...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix errors before deploying.
    pause
    exit /b 1
)

echo ✅ Build successful!

echo.
echo 🌐 Choose Deployment Option:
echo 1) Vercel (Recommended - Free ^&^ Easy)
echo 2) Netlify (Free ^&^ Easy)
echo 3) PWA Setup (Mobile App-like Experience)
echo 4) Local Network Testing
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo 🚀 Deploying to Vercel...
    echo 📋 Prerequisites:
    echo    - Install Vercel CLI: npm install -g vercel
    echo    - Login: vercel login
    echo    - Setup DATABASE_URL in Vercel dashboard
    echo.
    echo 🔧 Commands:
    echo    vercel --prod
    echo.
    echo 📱 After deployment, open app on mobile and 'Add to Home Screen'
) else if "%choice%"=="2" (
    echo 🚀 Deploying to Netlify...
    echo 📋 Prerequisites:
    echo    - Install Netlify CLI: npm install -g netlify-cli
    echo    - Login: netlify login
    echo    - Setup environment variables in Netlify dashboard
    echo.
    echo 🔧 Commands:
    echo    netlify deploy --prod --dir=.next
    echo.
    echo 📱 After deployment, open app on mobile and 'Add to Home Screen'
) else if "%choice%"=="3" (
    echo 📱 PWA Setup...
    echo ✅ PWA is already configured!
    echo.
    echo 📋 To test PWA:
    echo    1. Deploy app using option 1 or 2
    echo    2. Open app in mobile browser
    echo    3. Look for 'Add to Home Screen' prompt
    echo    4. Install as PWA
    echo.
    echo 🎯 PWA Features:
    echo    - Offline support
    echo    - App-like experience
    echo    - Push notifications ready
    echo    - Auto-updates
) else if "%choice%"=="4" (
    echo 📡 Local Network Testing...
    echo 🔧 Finding your IP address...
    
    REM Get IP address
    ipconfig | findstr "IPv4" > temp.txt
    set /p IP=<temp.txt
    del temp.txt
    
    echo 📡 Your IP address: %IP%
    echo.
    echo 📱 Access from mobile:
    echo    1. Connect mobile and computer to same WiFi
    echo    2. Open browser on mobile
    echo    3. Go to: http://%IP%:3000
    echo.
    echo 🔧 Make sure server is running:
    echo    npm run dev
    echo.
    echo 🌐 Or test with: http://localhost:3000 on computer
) else (
    echo ❌ Invalid choice. Please run script again.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment guide ready! Check DEPLOYMENT.md for detailed instructions.
echo.
echo 📊 App Features Ready for Production:
echo    ✅ Responsive design for all devices
echo    ✅ PWA support (install as mobile app)
echo    ✅ SQLite database (for local/self-hosting)
echo    ✅ API endpoints for mobile apps
echo    ✅ Real-time updates with Socket.IO
echo    ✅ Modern UI with shadcn/ui components
echo    ✅ Cash flow charts and statistics
echo    ✅ Category management
echo    ✅ Budget tracking
echo    ✅ Savings goals
echo.
echo 🚀 Ready to deploy! Choose your preferred option above.
pause
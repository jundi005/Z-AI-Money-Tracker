# 📱 Personal Finance App - Deployment Guide

## 🌐 **Opsi 1: Deploy ke Vercel (Recommended & Gratis)**

### **Step 1: Setup GitHub Repository**
```bash
# Initialize git jika belum
git init
git add .
git commit -m "Initial commit: Personal Finance App"

# Push ke GitHub
git branch -M main
git remote add origin https://github.com/username/finance-app.git
git push -u origin main
```

### **Step 2: Deploy ke Vercel**
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Click "New Project"
4. Pilih repository Anda
5. **Environment Variables:**
   - `DATABASE_URL`: SQLite database URL (gunakan Vercel Postgres atau external DB)
6. Click "Deploy"

### **Step 3: Setup Database**
Karena SQLite tidak bekerja di Vercel, gunakan opsi ini:
- **Vercel Postgres** (Recommended)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)

Update `.env` di Vercel:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

## 🚀 **Opsi 2: Deploy ke Netlify**

### **Step 1: Build Configuration**
Buat `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### **Step 2: Deploy**
1. Push ke GitHub
2. Connect ke Netlify
3. Setup environment variables
4. Deploy

## 📱 **Opsi 3: Progressive Web App (PWA)**

### **Install PWA di HP**
1. Buka aplikasi di browser HP
2. Click "Add to Home Screen"
3. Aplikasi akan terinstall seperti native app

### **PWA Features**
- ✅ Offline support
- ✅ App-like experience
- ✅ Push notifications
- ✅ Auto-updates

## 📲 **Opsi 4: Convert ke APK dengan Capacitor**

### **Step 1: Install Capacitor**
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init finance-app com.example.financeapp
```

### **Step 2: Build untuk Mobile**
```bash
npm run build
npx cap add android
npx cap sync android
```

### **Step 3: Buka di Android Studio**
```bash
npx cap open android
```

### **Step 4: Build APK**
1. Buka project di Android Studio
2. Build > Build Bundle(s) / APK(s) > Build APK(s)
3. APK akan tersedia di `app/build/outputs/apk/`

## 🖥️ **Opsi 5: Self-Hosting (VPS/Dedicated Server)**

### **Step 1: Setup Server**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/username/finance-app.git
cd finance-app

# Install dependencies
npm install

# Setup database
npm run db:push
```

### **Step 2: Production Deployment**
```bash
# Build aplikasi
npm run build

# Start production server
npm start

# Setup PM2 untuk process management
npm install -g pm2
pm2 start npm --name "finance-app" -- start
pm2 startup
pm2 save
```

### **Step 3: Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 **Configuration Checklist**

### **Environment Variables**
```bash
# Database
DATABASE_URL=your_database_url

# Next.js
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret_key

# Optional: Redis untuk cache
REDIS_URL=redis://user:password@host:port
```

### **Security Headers**
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ];
}
```

## 📊 **Performance Optimization**

### **Image Optimization**
```javascript
// next.config.js
images: {
  domains: ['yourdomain.com'],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
},
```

### **Caching Strategy**
```javascript
// API routes dengan cache
export async function GET() {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

## 🚀 **Deployment Commands**

### **Quick Deploy**
```bash
# Vercel CLI
npm install -g vercel
vercel --prod

# Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 **Mobile Testing**

### **Chrome DevTools**
1. Buka Chrome DevTools (F12)
2. Click device icon (Toggle device toolbar)
3. Pilih device model
4. Test responsive design

### **Real Device Testing**
1. Connect HP dan komputer ke WiFi yang sama
2. Buka `http://[IP_KOMPUTER]:3000` di HP
3. Test semua fitur

## 🔍 **Troubleshooting**

### **Common Issues**
- **Database connection**: Check environment variables
- **Build errors**: Check Node.js version (minimum 18)
- **API errors**: Check CORS configuration
- **Mobile issues**: Check responsive design

### **Monitoring**
```bash
# Check logs
pm2 logs finance-app

# Monitor performance
pm2 monit

# Restart jika error
pm2 restart finance-app
```

## 📈 **Next Steps**

1. **Analytics**: Setup Google Analytics
2. **Error Tracking**: Setup Sentry
3. **Performance**: Setup Core Web Vitals monitoring
4. **Security**: Setup rate limiting dan security headers
5. **Backup**: Setup database backup strategy

---

## 🎯 **Recommended Deployment Flow**

1. **Development**: Local dengan SQLite
2. **Staging**: Vercel dengan test database
3. **Production**: Vercel/Netlify dengan production database
4. **Mobile**: PWA untuk instant access
5. **Native**: Capacitor untuk Google Play Store

Pilih opsi yang sesuai dengan kebutuhan dan budget Anda! 🚀
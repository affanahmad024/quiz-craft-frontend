# QuizCraft - Quick Deployment Guide

**5-Minute Deployment** | Production Ready ✅

---

## 🚀 Option 1: Vercel (Recommended)

### Step 1: Sign Up & Connect
```bash
# Visit: https://vercel.com
# Click "Sign Up" → Connect with GitHub
```

### Step 2: Import Project
```
1. Click "Add New" → "Project"
2. Select your repository: quiz-craft-frontend
3. Configure:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
```

### Step 3: Environment Variables
```
Add in Vercel Dashboard:
VITE_API_BASE_URL=https://your-api-url.com/api
```

### Step 4: Deploy
```
Click "Deploy" → Wait 1-2 minutes → Done! 🎉
```

**Your app is live!** Vercel provides a URL like: `your-app.vercel.app`

---

## 🚀 Option 2: Netlify

### Step 1: Sign Up & Connect
```bash
# Visit: https://netlify.com
# Click "Sign Up" → Connect with GitHub
```

### Step 2: Import Project
```
1. Click "Add new site" → "Import an existing project"
2. Connect to GitHub → Select repository
3. Configure:
   - Build command: npm run build
   - Publish directory: dist
```

### Step 3: Environment Variables
```
Go to: Site settings → Environment variables
Add:
VITE_API_BASE_URL=https://your-api-url.com/api
```

### Step 4: Deploy
```
Click "Deploy site" → Wait 1-2 minutes → Done! 🎉
```

**Your app is live!** Netlify provides a URL like: `your-app.netlify.app`

---

## ⚙️ Required Configuration

### Environment Variable (REQUIRED)
```env
VITE_API_BASE_URL=https://your-api-url.com/api
```

**Where to add:**
- **Vercel**: Dashboard → Project → Settings → Environment Variables
- **Netlify**: Site settings → Environment variables

---

## ✅ Post-Deployment Checklist

After deployment, verify these work:

```
□ Application loads at provided URL
□ Can navigate to login page
□ Can navigate to signup page
□ Can view public quizzes (if any)
□ Dark mode toggle works
□ No console errors (open DevTools)
□ API calls reach your backend
```

---

## 🔧 Optional: Custom Domain

### On Vercel:
```
1. Go to Project → Settings → Domains
2. Add your domain (e.g., quizcraft.com)
3. Follow DNS configuration instructions
4. SSL automatically configured ✅
```

### On Netlify:
```
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL automatically configured ✅
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check these:
□ Node version is 18+ in build settings
□ Build command is: npm run build
□ Output directory is: dist
□ All dependencies in package.json
```

### API Not Working
```bash
# Verify:
□ VITE_API_BASE_URL is set correctly
□ Backend API is accessible from deployment
□ CORS is configured on backend for your domain
□ API URL includes /api suffix if needed
```

### Page Not Found on Refresh
```bash
# Already configured! ✅
# vercel.json and netlify.toml handle SPA routing
# All routes redirect to index.html
```

---

## 📊 Expected Performance

After deployment, run Lighthouse audit:

```
Performance:     > 90
Accessibility:   > 95
Best Practices:  > 90
SEO:            > 80
```

---

## 🔄 Automatic Deployments

### Already Configured! ✅

```
Push to main branch → Automatic production deployment
Create pull request → Automatic preview deployment
```

GitHub Actions workflow handles:
- Build verification
- Automatic deployment
- Lighthouse CI performance checks

---

## 📁 What Was Deployed

```
dist/
├── index.html (0.81 kB)
└── assets/
    ├── index-[hash].css       (4.76 kB)
    ├── contexts-[hash].js    (26.35 kB)
    ├── vendor-react-[hash].js (48.27 kB)
    ├── vendor-utils-[hash].js (170.43 kB)
    ├── index-[hash].js       (308.96 kB)
    └── vendor-mui-[hash].js  (334.68 kB)

Total: ~889 KB (~273 KB gzipped)
```

---

## 🎯 Next Steps After Deployment

### Immediate
1. ✅ Test all core features
2. ✅ Verify API connectivity
3. ✅ Check mobile responsiveness
4. ✅ Test authentication flow

### Optional
5. ⚡ Setup custom domain
6. ⚡ Configure error tracking (Sentry)
7. ⚡ Enable analytics (Google Analytics)
8. ⚡ Setup monitoring

---

## 📖 Need More Help?

### Detailed Guides
- **Full Deployment**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Project Overview**: [README.md](README.md)
- **Project Summary**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

### Platform Documentation
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com

---

## 🎉 Success!

Your QuizCraft application is now live and accessible worldwide!

**What you deployed:**
- ✅ Full-featured quiz platform
- ✅ Modern React 19 application
- ✅ Material-UI 7 interface
- ✅ Dark mode support
- ✅ Fully responsive design
- ✅ Accessibility compliant
- ✅ Optimized performance
- ✅ Secure with HTTPS

---

**Share your deployment URL with users and start creating quizzes!** 🚀

---

**Platform**: Vercel or Netlify
**Build Time**: ~20 seconds
**SSL**: ✅ Automatic
**CDN**: ✅ Global
**Cost**: Free tier available
**Status**: 🎉 Production Ready

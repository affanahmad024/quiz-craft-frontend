# QuizCraft Frontend - Deployment Guide

Complete guide for deploying the QuizCraft frontend to production.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Build Optimization](#build-optimization)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Options](#deployment-options)
5. [CI/CD Setup](#cicd-setup)
6. [Post-Deployment](#post-deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- ✅ Phase 9 completed (testing & bug fixes)
- ✅ Production build successful
- ✅ Backend API deployed and accessible
- ✅ Git repository set up
- ✅ Domain name (optional but recommended)

### Accounts Needed
- **Hosting Platform**: Vercel, Netlify, or AWS account
- **Git Provider**: GitHub, GitLab, or Bitbucket
- **Error Tracking**: Sentry account (optional)
- **Analytics**: Google Analytics or Mixpanel (optional)

---

## Build Optimization

### Current Build Stats
```bash
npm run build

# Output:
✓ Production build successful
Bundle size: 889 KB → Optimized with code splitting
Gzipped: 271 KB
Chunks: Multiple vendor chunks for better caching
```

### Optimization Features
1. **Code Splitting**
   - Vendor chunks (React, MUI, utilities)
   - Context providers separated
   - Better caching strategy

2. **Minification**
   - Terser minification enabled
   - Console.logs removed in production
   - Debugger statements removed

3. **CSS Optimization**
   - CSS code splitting enabled
   - Unused styles tree-shaken

### Verify Build Locally
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Test at http://localhost:4173
```

---

## Environment Configuration

### 1. Create Production Environment File

Copy `.env.example` to `.env.production`:
```bash
cp .env.example .env.production
```

### 2. Configure Required Variables

Edit `.env.production`:
```env
# REQUIRED: Your production API URL
VITE_API_BASE_URL=https://api.yourapp.com

# OPTIONAL: Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true

# OPTIONAL: Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# OPTIONAL: Error tracking
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=production
```

### 3. Environment Variable Priority
```
.env.production (production build)
.env.development (development)
.env.local (local overrides, gitignored)
.env (defaults)
```

---

## Deployment Options

## Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Zero configuration
- ✅ Automatic deployments from Git
- ✅ Preview deployments for PRs
- ✅ Built-in CDN
- ✅ Free SSL certificates
- ✅ Excellent performance

### Deploy Steps

#### A. Via Vercel Dashboard (Easiest)

1. **Sign up/Login**: https://vercel.com
2. **Import Project**: Click "Add New" → "Project"
3. **Connect Git**: Select your repository
4. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables**: Add in project settings
   ```
   VITE_API_BASE_URL = https://api.yourapp.com
   ```

6. **Deploy**: Click "Deploy"

#### B. Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration
The `vercel.json` file is already configured with:
- SPA routing redirects
- Security headers
- Asset caching
- Production optimizations

---

## Option 2: Netlify

### Why Netlify?
- ✅ Easy setup
- ✅ Great for static sites
- ✅ Built-in forms (if needed)
- ✅ Free SSL certificates
- ✅ Good CDN performance

### Deploy Steps

#### A. Via Netlify Dashboard

1. **Sign up/Login**: https://netlify.com
2. **New Site from Git**: Click "Add new site"
3. **Connect Repository**: Select your Git provider
4. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Base directory: (leave empty)

5. **Environment Variables**: Site settings → Environment variables
   ```
   VITE_API_BASE_URL = https://api.yourapp.com
   ```

6. **Deploy**: Click "Deploy site"

#### B. Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Netlify Configuration
The `netlify.toml` file is already configured with:
- Build settings
- SPA redirects
- Security headers
- Caching rules

---

## Option 3: AWS S3 + CloudFront

### Why AWS?
- ✅ Maximum control
- ✅ Highly scalable
- ✅ Global CDN (CloudFront)
- ✅ Pay-as-you-go pricing

### Deploy Steps

#### 1. Build Application
```bash
npm run build
```

#### 2. Create S3 Bucket
```bash
aws s3 mb s3://your-app-name
aws s3 website s3://your-app-name --index-document index.html --error-document index.html
```

#### 3. Upload Files
```bash
aws s3 sync dist/ s3://your-app-name --delete
```

#### 4. Setup CloudFront
1. Create CloudFront distribution
2. Set origin to S3 bucket
3. Configure custom error responses (404 → /index.html)
4. Add SSL certificate
5. Update DNS

#### 5. Automate with GitHub Actions
See `.github/workflows/ci.yml` for automation setup.

---

## Option 4: GitHub Pages

### Why GitHub Pages?
- ✅ Free hosting
- ✅ Good for public repos
- ✅ Simple setup

### Deploy Steps

#### 1. Install gh-pages
```bash
npm install --save-dev gh-pages
```

#### 2. Add to package.json
```json
{
  "homepage": "https://yourusername.github.io/quiz-craft-frontend",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 3. Update vite.config.js
```javascript
export default defineConfig({
  base: '/quiz-craft-frontend/',
  // ... rest of config
})
```

#### 4. Deploy
```bash
npm run deploy
```

---

## CI/CD Setup

### GitHub Actions (Already Configured)

The repository includes two workflows:

#### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)
- Runs on push to `main` and `develop`
- Runs on pull requests
- **Jobs**:
  - Build and test
  - Deploy preview (for PRs)
  - Deploy production (for main branch)

#### 2. Lighthouse CI (`.github/workflows/lighthouse.yml`)
- Runs on pull requests
- Performance auditing
- Accessibility checks
- Best practices validation

### Configure Secrets

Add these secrets in GitHub repository settings:

```
Settings → Secrets and variables → Actions → New repository secret
```

**Required Secrets:**
```
VITE_API_BASE_URL = https://api.yourapp.com
VERCEL_TOKEN = your_vercel_token (if using Vercel)
NETLIFY_AUTH_TOKEN = your_netlify_token (if using Netlify)
```

**Optional Secrets:**
```
VITE_GA_TRACKING_ID = G-XXXXXXXXXX
VITE_SENTRY_DSN = https://xxx@xxx.ingest.sentry.io/xxx
```

### Enable Workflows

1. Push code to GitHub
2. Go to "Actions" tab
3. Workflows run automatically on push/PR

---

## Post-Deployment

### 1. Verify Deployment

#### Check Core Functionality
- [ ] Application loads
- [ ] Routes work correctly
- [ ] API calls succeed
- [ ] Authentication works
- [ ] Assets load properly
- [ ] No console errors

#### Test Key Features
- [ ] User registration
- [ ] Login/logout
- [ ] Create quiz
- [ ] Take quiz
- [ ] View profile
- [ ] Dark mode toggle

### 2. Configure Custom Domain

#### Vercel
```bash
# Add domain in Vercel dashboard
vercel domains add yourdomain.com
```

Update DNS records:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Update DNS records as instructed

### 3. Enable HTTPS
- ✅ Vercel: Automatic (Let's Encrypt)
- ✅ Netlify: Automatic (Let's Encrypt)
- ⚙️ AWS: Configure ACM certificate in CloudFront

### 4. Setup CDN & Caching

Already configured in:
- `vercel.json` - Cache headers for assets
- `netlify.toml` - Cache rules
- Assets have immutable cache (1 year)
- HTML has no cache (always fresh)

---

## Monitoring

### 1. Error Tracking (Sentry)

#### Install Sentry
```bash
npm install @sentry/react @sentry/tracing
```

#### Configure (Optional Enhancement)
```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    tracesSampleRate: 1.0,
  });
}
```

### 2. Analytics (Google Analytics)

#### Install GA
```bash
npm install react-ga4
```

#### Configure (Optional Enhancement)
```javascript
// src/main.jsx
import ReactGA from 'react-ga4';

if (import.meta.env.PROD && import.meta.env.VITE_GA_TRACKING_ID) {
  ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
}
```

### 3. Performance Monitoring

#### Lighthouse CI
- Automated via GitHub Actions
- Runs on every PR
- Reports performance metrics

#### Vercel Analytics
- Built-in Web Vitals tracking
- Enable in project settings

#### Custom Monitoring
```javascript
// Track Web Vitals
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onFCP(console.log);
onLCP(console.log);
onTTFB(console.log);
```

---

## Troubleshooting

### Build Fails

**Issue**: `npm run build` fails

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run build

# Check Node version (requires 18+)
node --version
```

### Routes Not Working (404 on Refresh)

**Issue**: SPA routes return 404 on page refresh

**Solutions**:
- ✅ Vercel: `vercel.json` configured
- ✅ Netlify: `netlify.toml` configured
- ⚙️ Other platforms: Configure rewrites to `/index.html`

### Environment Variables Not Working

**Issue**: API calls fail, variables undefined

**Solutions**:
```bash
# Ensure variables start with VITE_
VITE_API_BASE_URL=https://api.yourapp.com

# Rebuild after changing env vars
npm run build

# Check variables are accessible
console.log(import.meta.env.VITE_API_BASE_URL)
```

### Large Bundle Size

**Issue**: Initial load is slow

**Solutions**:
- ✅ Code splitting implemented
- ✅ Manual chunks configured
- Consider lazy loading routes with React.lazy()
- Analyze bundle: `npm run build -- --analyze`

### CORS Errors

**Issue**: API calls blocked by CORS

**Solutions**:
- Configure backend CORS headers
- Allow your frontend domain
- Include credentials if needed

### Slow Performance

**Issue**: App loads slowly

**Solutions**:
```bash
# Check Lighthouse scores
npm run build
npx serve dist
npx lighthouse http://localhost:3000

# Optimize images
# Use WebP format
# Implement lazy loading
# Enable compression on server
```

---

## Rollback Procedures

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Netlify
```bash
# Via dashboard: Deploys → Select deployment → Publish deploy
# Or use CLI
netlify deploy --prod --dir=dist
```

### Git-based Rollback
```bash
# Revert to previous commit
git revert HEAD
git push

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force
```

---

## Performance Checklist

- [ ] Build size < 1MB (compressed < 300KB) ✅
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Lighthouse score > 90
- [ ] All images optimized
- [ ] Lazy loading implemented for routes
- [ ] Service worker configured (optional)
- [ ] Compression enabled (gzip/brotli)
- [ ] CDN configured
- [ ] Caching headers set

---

## Security Checklist

- [ ] HTTPS enabled ✅
- [ ] Security headers configured ✅
- [ ] Environment variables secured
- [ ] API keys not exposed in frontend
- [ ] Content Security Policy (CSP)
- [ ] CORS configured on backend
- [ ] Input validation on frontend
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented (backend)

---

## Deployment Checklist

### Pre-Deployment
- [ ] All phases complete (1-9)
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Domain configured (if applicable)
- [ ] SSL certificate ready (if applicable)

### Deployment
- [ ] Code pushed to repository
- [ ] CI/CD pipeline passing
- [ ] Hosting platform configured
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] HTTPS enabled

### Post-Deployment
- [ ] Application loads correctly
- [ ] All features working
- [ ] API calls successful
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Performance monitoring active
- [ ] Documentation updated

---

## Support & Resources

### Official Documentation
- **Vite**: https://vitejs.dev
- **Vercel**: https://vercel.com/docs
- **Netlify**: https://docs.netlify.com
- **React**: https://react.dev

### Community
- GitHub Issues: [Your repo URL]
- Discord/Slack: [Your community links]
- Email: support@yourapp.com

---

**Deployment Status**: Ready for Production
**Last Updated**: Phase 10 - Deployment

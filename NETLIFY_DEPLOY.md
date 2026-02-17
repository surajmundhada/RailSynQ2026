# 🚀 Netlify Deployment Guide for RailSynQ Frontend

## Prerequisites
- Netlify account (sign up at https://netlify.com)
- Your backend API deployed (e.g., Render, Railway, or your own server)
- Git repository (GitHub, GitLab, or Bitbucket)

---

## 📋 Step-by-Step Deployment

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Push your code to Git**
   ```bash
   git add .
   git commit -m "Add Netlify config"
   git push origin main
   ```

2. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   - **Base directory:** `frontend` (if repo root is RailSynQ, or leave blank if deploying from frontend folder)
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`

4. **Set Environment Variables**
   Click "Environment variables" and add:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
   Replace `your-backend-url.onrender.com` with your actual backend URL.

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at `https://your-site-name.netlify.app`

---

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

4. **Initialize Netlify**
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Follow prompts

5. **Set Environment Variable**
   ```bash
   netlify env:set VITE_API_URL https://your-backend-url.onrender.com
   ```

6. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## 🔧 Configuration Files

### `netlify.toml` (already created)
Located in `frontend/netlify.toml` - handles build settings and redirects.

### Environment Variables

**Required:**
- `VITE_API_URL` - Your backend API URL (e.g., `https://queuesyncrail.onrender.com`)

**Optional:**
- `VITE_WS_URL` - WebSocket URL for real-time updates (if different from API URL)

---

## 🌐 Backend URL Configuration

The frontend automatically detects the backend URL:

1. **If `VITE_API_URL` is set** → Uses that
2. **If on localhost** → Uses `http://localhost:8000`
3. **Otherwise** → Uses `https://queuesyncrail.onrender.com` (default)

To change the default production URL, update `frontend/src/lib/api.ts` line 29.

---

## ✅ Post-Deployment Checklist

- [ ] Test login/signup functionality
- [ ] Verify API calls work (check browser console)
- [ ] Test all routes (Dashboard, Logs, Simulation, etc.)
- [ ] **Update backend CORS** - Add your Netlify domain to backend CORS origins

### Backend CORS Configuration

After deploying to Netlify, update your backend CORS settings:

**Option 1: Environment Variable (Recommended)**
Set `CORS_ALLOW_ORIGINS` environment variable on your backend:
```
CORS_ALLOW_ORIGINS=https://your-site-name.netlify.app,https://rail-anukriti-7u8e.vercel.app
```

**Option 2: Update Code**
Edit `backend/app/main.py` and add your Netlify URL to `allowed_origins`:
```python
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://rail-anukriti-7u8e.vercel.app",
    "https://your-site-name.netlify.app",  # Add your Netlify URL
]
```

---

## 🔄 Updating Your Site

After pushing changes to Git:
- Netlify will automatically rebuild and redeploy
- Or manually trigger via Netlify dashboard → "Trigger deploy"

---

## 🐛 Troubleshooting

**Build fails:**
- Check build logs in Netlify dashboard
- Ensure `package.json` has correct build script
- Verify Node.js version (Netlify uses Node 18 by default)

**API calls fail:**
- Check `VITE_API_URL` environment variable
- Verify backend CORS allows your Netlify domain
- Check browser console for errors

**Routes return 404:**
- Ensure `netlify.toml` has the redirect rule (already included)
- Verify `dist/index.html` exists after build

---

## 📝 Notes

- Netlify provides free SSL certificates automatically
- Custom domains can be added in Site settings → Domain management
- Build logs are available in Netlify dashboard under "Deploys"

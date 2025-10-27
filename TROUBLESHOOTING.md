# Troubleshooting: Blank Page After Deployment

## Issue: Blank Page on Deployed Site

If you see a blank page after deployment, follow these steps:

## 🔍 Step 1: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Look for errors

### Common Errors:

**Error: "Failed to fetch" or "Network Error"**
- **Cause**: Frontend can't connect to backend
- **Fix**: See "Backend Not Connected" below

**Error: "Unexpected token '<'" or "SyntaxError"**
- **Cause**: Build configuration issue
- **Fix**: See "Build Configuration" below

**Error: "Cannot read property of undefined"**
- **Cause**: Missing environment variables
- **Fix**: See "Environment Variables" below

## 🔧 Step 2: Verify Deployment Setup

### For Frontend (Vercel/Netlify):

**Check Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Check Environment Variables:**
```
VITE_API_URL=https://your-backend-url.com/api
```

⚠️ **Important**: Must start with `VITE_` for Vite to include it!

### For Backend (Railway/Render):

**Check if backend is running:**
```bash
curl https://your-backend-url.com/api/health
```

Should return: `{"status":"ok","timestamp":"..."}`

If not, backend isn't running properly.

## 🐛 Common Issues & Fixes

### Issue 1: Backend Not Connected

**Symptoms:**
- Blank page or loading forever
- Console shows "Failed to fetch"
- Network errors

**Fix:**
1. **Deploy backend first** (Railway/Render)
2. **Get backend URL** (e.g., `https://your-app.railway.app`)
3. **Update frontend env var**:
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```
4. **Redeploy frontend**

### Issue 2: CORS Errors

**Symptoms:**
- Console shows "CORS policy" error
- "Access-Control-Allow-Origin" error

**Fix:**
1. **Update backend `.env`**:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
2. **Redeploy backend**

### Issue 3: Environment Variables Not Set

**Symptoms:**
- `VITE_API_URL` is undefined
- API calls go to wrong URL

**Fix:**
1. **In deployment platform** (Vercel/Netlify):
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.railway.app/api`
2. **Redeploy** (environment changes require rebuild)

### Issue 4: Build Failed

**Symptoms:**
- Deployment shows build errors
- TypeScript errors
- Missing dependencies

**Fix:**
1. **Check build logs** in deployment platform
2. **Common fixes**:
   ```bash
   # Locally test build
   npm run build
   
   # If errors, fix them
   # Then commit and push
   ```

### Issue 5: Wrong Base Path

**Symptoms:**
- Assets not loading (404 errors)
- Blank page but no console errors

**Fix:**
Update `vite.config.js`:
```javascript
export default {
  base: '/', // Make sure this is correct
  // ... rest of config
}
```

## 🚀 Quick Fix: Test Locally First

**Before deploying, test locally:**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

If it works locally but not deployed:
- ✅ Code is fine
- ❌ Deployment configuration issue

## 📋 Deployment Checklist

### Backend Deployment:
- [ ] Backend deployed and running
- [ ] Database created and migrated
- [ ] Environment variables set
- [ ] Health endpoint responds: `/api/health`
- [ ] CORS configured with frontend URL

### Frontend Deployment:
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] `VITE_API_URL` environment variable set
- [ ] Points to correct backend URL
- [ ] Build succeeds without errors

## 🔍 Debug Steps

### 1. Check Backend Health
```bash
curl https://your-backend.railway.app/api/health
```

**Expected**: `{"status":"ok","timestamp":"..."}`

**If fails**: Backend not running or wrong URL

### 2. Check Frontend Build
```bash
npm run build
```

**Expected**: Creates `dist/` folder with files

**If fails**: Fix build errors first

### 3. Check Environment Variables

**In browser console:**
```javascript
console.log(import.meta.env.VITE_API_URL)
```

**Expected**: Your backend URL

**If undefined**: Environment variable not set correctly

### 4. Check Network Requests

1. Open Network tab in DevTools
2. Reload page
3. Look for failed requests (red)
4. Click on failed request
5. Check error message

## 🆘 Still Not Working?

### Option 1: Use localStorage Version (Temporary)

If you need it working NOW and can't debug deployment:

1. The current component uses localStorage
2. It works without backend
3. But data only persists in browser

This is already in your code - it should work!

### Option 2: Check Specific Platform Issues

**Vercel:**
- Check build logs: Deployments → Click deployment → View logs
- Verify environment variables: Settings → Environment Variables

**Netlify:**
- Check deploy logs: Deploys → Click deploy → Deploy log
- Verify environment variables: Site settings → Environment variables

**Railway:**
- Check logs: Project → Deployments → View logs
- Verify environment variables: Project → Variables

**Render:**
- Check logs: Dashboard → Service → Logs
- Verify environment variables: Environment → Environment Variables

## 📞 Getting More Help

1. **Check deployment logs** - Most specific information
2. **Check browser console** - Frontend errors
3. **Test backend separately** - `curl` the health endpoint
4. **Test locally** - Verify code works before deployment

## 🎯 Most Likely Issues (in order):

1. **Backend not deployed yet** → Deploy backend first
2. **VITE_API_URL not set** → Add environment variable
3. **CORS not configured** → Update FRONTEND_URL in backend
4. **Backend URL wrong** → Check and update VITE_API_URL
5. **Build failed** → Check build logs and fix errors

---

## Quick Deployment Order

**Correct order:**
1. ✅ Deploy backend (Railway/Render)
2. ✅ Get backend URL
3. ✅ Set VITE_API_URL in frontend
4. ✅ Deploy frontend (Vercel/Netlify)

**Wrong order:**
1. ❌ Deploy frontend first
2. ❌ Backend not running
3. ❌ Blank page!

---

**Need immediate help?** Share:
1. Deployment platform (Vercel/Railway/etc.)
2. Browser console errors (screenshot)
3. Backend health check result
4. Environment variables (hide sensitive values)

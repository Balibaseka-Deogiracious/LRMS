# Frontend Environment Variables Setup for Vercel

Your frontend is already using environment variables correctly with `VITE_API_URL`. Here's how to configure it for production.

## For Local Development

### 1. Create `.env.local` in frontend folder
```
VITE_API_URL=http://localhost:8000
```

### 2. Run locally
```bash
cd frontend
npm install (if not done)
npm run dev
```

The frontend will automatically use `http://localhost:8000` for API calls.

---

## For Vercel Production Deployment

### Step 1: Get Your Backend Deployment URL
After deploying backend to Vercel, you'll have a URL like:
```
https://lrms-backend.vercel.app
```

### Step 2: Add Environment Variable to Vercel
1. Go to **https://vercel.com/dashboard**
2. Click on your frontend project
3. Go to **Settings → Environment Variables**
4. Add new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://lrms-backend.vercel.app` (without trailing slash)
   - **Environment:** Select `Production`, `Preview`, and `Development`
5. Click "Save"

### Step 3: Redeploy Frontend
```bash
cd frontend
git add .
git commit -m "Add VITE_API_URL environment variable"
git push
```

Or manually trigger in Vercel Dashboard:
- Go to Deployments
- Click the three dots on latest deployment
- Select "Redeploy"

### Step 4: Verify
1. Go to your Vercel frontend URL (https://your-frontend.vercel.app)
2. Open Browser DevTools (F12)
3. Check Network tab for API calls
4. Calls should go to your backend Vercel URL, not localhost

---

## Environment Variable Reference

| Variable | Local | Production |
|----------|-------|------------|
| `VITE_API_URL` | `http://localhost:8000` | `https://lrms-backend.vercel.app` |

---

## Troubleshooting

### "API calls go to localhost in production"
- Env var not set in Vercel
- Frontend not redeployed after setting env var
- Fix: Redeploy manually in Vercel

### "CORS error when calling API"
- Backend CORS not configured for your frontend domain
- Fix: Update backend `main.py` allow_origins list
- Include your full frontend URL: `https://your-frontend.vercel.app`

### How to check which API URL is being used
Open browser console and run:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

---

**Done! Your frontend will now connect to the production backend.**

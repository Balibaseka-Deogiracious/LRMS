# LRMS Deployment Guide - Complete Setup

## Overview
This guide walks you through deploying your Library Management System online so anyone can access it from anywhere.

**Architecture:**
- Frontend: Vercel (already deployed ✅)
- Backend: Vercel Serverless Functions
- Database: PostgreSQL (cloud-hosted)

---

## STEP 1: Set Up PostgreSQL Database Online

### Option A: Neon (Recommended - Free, Built for Serverless)
**Why Neon:** Free tier supports serverless, auto-pauses, perfect for Vercel

1. Go to **https://neon.tech**
2. Click "Start Free" and sign up with GitHub
3. Create a project (name it: `lrms`)
4. Your database is instantly created
5. Click "Connection string" and copy the **PostgreSQL** connection string
   - Format: `postgresql://user:password@host/database`
6. **Save this** - you'll need it in Step 3

### Option B: Railway.app (Alternative - Also Free)
1. Go to **https://railway.app**
2. Sign up and create new project
3. Add PostgreSQL database
4. Copy connection string from variables

### Option C: Render.com (Alternative)
1. Go to **https://render.com**
2. Create new PostgreSQL database
3. Copy connection string

---

## STEP 2: Update Backend Requirements (Missing Database Driver)

Your `requirements.txt` needs PostgreSQL driver for production.

1. Open `backend/requirements.txt`
2. Add these lines at the end:
```
psycopg2-binary==2.9.9
SQLAlchemy==2.0.23
```

If you want to install/test locally first:
```bash
cd backend
pip install psycopg2-binary
```

---

## STEP 3: Set Up Environment Variables

### Create `.env.local` for Development
Create file: `backend/.env.local`
```
DATABASE_URL=postgresql://user:password@host/dbname
SECRET_KEY=your-secret-key-here-make-it-long-and-random
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
```

### Create Vercel Environment Variables (for Production)
**Steps:**
1. Go to **https://vercel.com/dashboard**
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add each variable:

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | PostgreSQL connection string | From Step 1 |
| `SECRET_KEY` | Generate: `openssl rand -hex 32` | Random 32 chars |
| `MAIL_USERNAME` | Your Gmail address | Gmail |
| `MAIL_PASSWORD` | Gmail App Password (see below) | Gmail |
| `MAIL_FROM` | Your Gmail address | Gmail |
| `MAIL_PORT` | 587 | Fixed |
| `MAIL_SERVER` | smtp.gmail.com | Fixed |

**Generate Gmail App Password:**
1. Go to **https://myaccount.google.com/apppasswords**
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character password
4. Use this in `MAIL_PASSWORD` variable

---

## STEP 4: Update Backend Vercel Configuration

### Update `backend/vercel.json`
Replace with:
```json
{
  "runtime": "python@3.9",
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ],
  "env": {}
}
```

### Update `backend/api/index.py`
Make sure it correctly imports and exposes the app:
```python
from app.main import app

# Vercel serverless function handler
# FastAPI app is already configured with CORS in main.py
```

---

## STEP 5: Deploy Backend to Vercel

### Option A: Using Git (Recommended)
1. Initialize Git in backend folder (if not already done):
```bash
cd backend
git init
git add .
git commit -m "Backend ready for deployment"
```

2. Push to GitHub:
   - Create repo on GitHub: `your-username/lrms-backend`
   - Push local code to GitHub

3. In Vercel Dashboard:
   - Click "Add New Project"
   - Import from GitHub → select `lrms-backend`
   - Settings:
     - Framework: `Other`
     - Root Directory: `./`
     - Build Command: `pip install -r requirements.txt`
   - Add environment variables (from Step 3)
   - Click "Deploy"

### Option B: Direct Upload (If no Git)
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd backend
vercel --env DATABASE_URL="postgresql://..." --env SECRET_KEY="..."
```

3. Follow prompts and select your account

---

## STEP 6: Get Your Backend Deployment URL

After deployment, Vercel gives you a URL like:
```
https://lrms-backend.vercel.app
```

**Save this** - you need it for Step 7

---

## STEP 7: Update Frontend to Use Deployed Backend

### Update API Base URL
1. Open `frontend/src/services/` folder
2. Find your API service file (usually `api.ts` or `apiClient.ts`)
3. Change the base URL from `http://localhost:8000` to your Vercel backend URL:

```typescript
const API_BASE_URL = "https://your-lrms-backend.vercel.app";
```

### Update CORS (Backend)
Your backend already has CORS enabled for all origins. For production, make it more secure:

**In `backend/app/main.py`**, update CORS:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)
```

### Deploy Frontend Updates
```bash
cd frontend
git add .
git commit -m "Update backend API URL for production"
git push
```
Vercel auto-deploys on push.

---

## STEP 8: Initialize Database

### Option A: Via Script (Best)
Create file: `backend/init_db.py`
```python
import os
from sqlalchemy import text
from app.database import engine, Base

# Create all tables
Base.metadata.create_all(bind=engine)

# Seed initial data (if needed)
from app.seed import seed_database
seed_database()

print("✅ Database initialized!")
```

Run:
```bash
cd backend
python init_db.py
```

### Option B: Via API
Make a POST request to your deployed backend:
```bash
curl -X POST https://your-backend.vercel.app/api/init
```

---

## STEP 9: Test Everything

### Test Backend
```bash
curl https://your-backend.vercel.app/
# Should return: {"message":"LMS API is running"}
```

### Test Frontend
1. Go to `https://your-frontend.vercel.app`
2. Try login
3. Check browser console for any errors

### Check Logs
**Backend logs:**
1. Vercel Dashboard → your-backend → Deployments → Logs
2. Look for errors

**Frontend logs:**
1. Browser DevTools → Console
2. Check API response errors

---

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` in Vercel environment variables
- Check PostgreSQL is accepting connections
- Ensure password doesn't have special characters (or URL-encode them)

### CORS Error
- Make sure frontend URL is in `allow_origins` list
- Check backend is actually deployed (not local)

### Environment Variables Not Working
- Restart Vercel deployment after adding env vars
- Deploy command: `vercel env pull`

### Email Not Sending
- Verify Gmail App Password is correct
- Check "Less secure apps" setting in Gmail
- Try with a different email provider

---

## Summary: Quick Checklist

- [ ] PostgreSQL database created (get connection string)
- [ ] Environment variables added to Vercel
- [ ] `psycopg2-binary` added to `requirements.txt`
- [ ] `backend/vercel.json` updated
- [ ] Backend deployed to Vercel
- [ ] Backend URL copied
- [ ] Frontend API URL updated
- [ ] Frontend redeployed
- [ ] Database initialized with seed data
- [ ] Test page loads and API calls work

---

## Additional Resources

- **Vercel Docs:** https://vercel.com/docs/frameworks/fastapi
- **Neon Docs:** https://neon.tech/docs
- **FastAPI CORS:** https://fastapi.tiangolo.com/tutorial/cors/
- **SQLAlchemy + PostgreSQL:** https://docs.sqlalchemy.org/

---

**You're almost there! Once deployed, anyone can access your LMS from anywhere! 🚀**

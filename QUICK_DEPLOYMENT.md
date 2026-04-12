# Quick Deployment Checklist & Commands

## Phase 1: Prepare Database (5 mins)

### Choose your database provider:
- **Neon** (Recommended): https://neon.tech
- **Railway**: https://railway.app
- **Render**: https://render.com

### Get connection string
The string will look like:
```
postgresql://user:password@host/dbname
```

---

## Phase 2: Backend Deployment (10-15 mins)

### Update requirements.txt
```bash
cd backend
echo "psycopg2-binary==2.9.9" >> requirements.txt
```

### Set up .env for testing (optional, local only)
```bash
# backend/.env.local
DATABASE_URL=postgresql://user:password@host/dbname
SECRET_KEY=$(openssl rand -hex 32)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
```

### Deploy to Vercel (via GitHub is easiest)
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 2. In Vercel Dashboard:
#    - New Project → Import from GitHub
#    - Select lrms-backend repo
#    - Root directory: backend/
#    - Framework: Other
#    - Build: pip install -r requirements.txt
#    - Add all env variables from Phase 2
#    - Deploy
```

### After deployment, copy your backend URL:
```
https://lrms-backend.vercel.app
```

---

## Phase 3: Frontend Update (5 mins)

### Set environment variable in Vercel
```bash
# In Vercel Dashboard → Frontend Project → Settings → Environment Variables

Name: VITE_API_URL
Value: https://lrms-backend.vercel.app
Environments: Production, Preview, Development

Then click Save
```

### Redeploy frontend
```bash
cd frontend
git add .
git commit -m "Configure production API URL"
git push

# Or manually redeploy in Vercel Dashboard
```

---

## Phase 4: Initialize Database (2 mins)

### Option A: Quick test
```bash
# Test backend is running
curl https://lrms-backend.vercel.app/

# Should return:
# {"message":"LMS API is running"}
```

### Option B: Initialize with seed data
```bash
# Create initialization script
cat > backend/init_db.py << 'EOF'
from app.database import Base, engine
Base.metadata.create_all(bind=engine)
print("✅ Database initialized!")
EOF

# Run it
cd backend
python init_db.py
```

### Option C: Let Vercel auto-create tables
- Tables are created automatically on first API request
- Check Vercel logs to verify

---

## Phase 5: Verification (5 mins)

### Test API
```bash
# Replace with your actual backend URL
BACKEND_URL="https://lrms-backend.vercel.app"

# Test server is up
curl $BACKEND_URL/

# Test login endpoint (should fail gracefully)
curl -X POST $BACKEND_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

### Test Frontend
1. Open https://your-frontend.vercel.app
2. Try to login
3. Open DevTools (F12) → Network tab
4. Check that API calls go to backend.vercel.app (not localhost)

### Check Logs
```bash
# Backend logs in Vercel:
# 1. Dashboard → Backend Project → Deployments
# 2. Click latest deployment → Logs tab
# 3. Check for any errors

# Frontend logs:
# 1. Open page in browser
# 2. Press F12 → Console tab
# 3. Check for errors
```

---

## If Something Goes Wrong

### Backend won't start
```bash
# Check Vercel logs
# Usually missing environment variable
# Solution: Add missing env var, then redeploy
```

### API calls to localhost in production
```bash
# Frontend not getting env variable
# Solutions:
# 1. Verify VITE_API_URL set in Vercel
# 2. Check all environments (Production, Preview, Development)
# 3. Redeploy frontend (not just push)
```

### Database connection fails
```bash
# Check DATABASE_URL in Vercel env vars
# Verify PostgreSQL connection string format
# Make sure database is still running
# Check firewall/IP whitelist if using managed database
```

### Email not sending
```bash
# Verify MAIL_USERNAME/PASSWORD are correct
# For Gmail: Use App Passwords, not regular password
# Get from: https://myaccount.google.com/apppasswords
```

---

## URLs You'll Need

- Vercel Dashboard: https://vercel.com/dashboard
- Neon Database: https://neon.tech/app/projects
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Your Frontend: Will be https://something.vercel.app
- Your Backend: Will be https://something.vercel.app

---

## Important Notes

✅ Your code is already production-ready
✅ CORS is configured
✅ Environment variables are properly used
✅ Vercel is configured for Python

⚠️ Remember: PostgreSQL is required for production (SQLite won't work on Vercel)
⚠️ Environment variables are case-sensitive
⚠️ After changing env vars, you may need to redeploy

---

**Estimated Total Time: 30-40 minutes for complete deployment**

Questions? Check DEPLOYMENT_GUIDE.md for detailed instructions.

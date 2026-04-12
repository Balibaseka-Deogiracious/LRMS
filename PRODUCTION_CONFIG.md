# Production-Ready Backend Configuration

## Option 1: Update main.py for Production CORS

Your current `main.py` uses `allow_origins=["*"]` which works but isn't ideal for production.

### Updated Version (More Secure)
Replace your backend/app/main.py with this version to support both local development and production:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from sqlalchemy import inspect, text

from app.database import Base, engine
from app.routes.auth import router as auth_router
from app.routes.books import router as books_router
from app.routes.admin import router as admin_router
from app.routes.notifications import router as notifications_router
from app.routes.stats import router as stats_router

load_dotenv()

app = FastAPI(title="Library Management System API", version="1.0.0")

# Configure CORS with environment-aware origins
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"  # Default for dev
).split(",")

# In production, add your frontend URL
# Example: "https://yourlrms.vercel.app,https://lrms.vercel.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)


def _run_startup_migrations() -> None:
    """Apply lightweight schema changes for existing SQLite databases."""
    inspector = inspect(engine)
    table_names = set(inspector.get_table_names())
    if "books" not in table_names:
        return

    book_columns = {column["name"] for column in inspector.get_columns("books")}
    if "publication_year" not in book_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE books ADD COLUMN publication_year INTEGER"))


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    _run_startup_migrations()


@app.get("/")
def root():
    return {"message": "LMS API is running"}


@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "ok", "service": "Library Management System API"}


app.include_router(auth_router)
app.include_router(books_router)
app.include_router(admin_router)
app.include_router(notifications_router)
app.include_router(stats_router)
```

### What Changed:
1. **CORS Origins**: Now controlled by `ALLOWED_ORIGINS` environment variable
2. **Health Check**: Added `/health` endpoint for monitoring
3. **Credentials**: Changed `allow_credentials` to `True` for JWT tokens

---

## Option 2: Environment Files

### Create backend/.env.local (Development)
Used locally when running backend:
```
DATABASE_URL=sqlite:///./lms.db
SECRET_KEY=dev-secret-key-change-in-production
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_FROM=your-gmail@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Create backend/.env.production (Production Reference)
This is NOT to be used locally. It's just a reference template for Vercel:
```
DATABASE_URL=postgresql://user:password@host/dbname
SECRET_KEY=generate-with-: openssl rand -hex 32
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=gmail-app-password
MAIL_FROM=your-email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Create frontend/.env.local (Development)
```
VITE_API_URL=http://localhost:8000
```

### Create frontend/.env.production (Production Reference)
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## Vercel Environment Variables Setup

### For Backend (api.vercel.app)

Go to Vercel → Backend Project → Settings → Environment Variables

Add these variables (copy exact names):

| Name | Value | When to use |
|------|-------|------------|
| `DATABASE_URL` | `postgresql://...` | Production only |
| `SECRET_KEY` | `openssl rand -hex 32` | Production only |
| `MAIL_USERNAME` | `your-email@gmail.com` | Production only |
| `MAIL_PASSWORD` | Gmail app password | Production only |
| `MAIL_FROM` | `your-email@gmail.com` | Production only |
| `MAIL_PORT` | `587` | Production only |
| `MAIL_SERVER` | `smtp.gmail.com` | Production only |
| `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` | Production only |

**Important:** Set environment dropdown to "Production" for all of these

---

### For Frontend (lrms.vercel.app)

Go to Vercel → Frontend Project → Settings → Environment Variables

Add these variables:

| Name | Value | Environments |
|------|-------|------------|
| `VITE_API_URL` | `https://your-backend.vercel.app` | Production, Preview, Development |

**Note:** The dropdown should show all three environments selected

---

## Testing Your Configuration

### Test locally first:
```bash
# Backend
cd backend
python -m uvicorn app.main:app --reload
# Visit: http://localhost:8000/

# Frontend (in another terminal)
cd frontend
npm run dev
# Visit: http://localhost:5173/
```

### Test in production:
```bash
# Backend health
curl https://your-backend.vercel.app/health

# Frontend (visit in browser)
# https://your-frontend.vercel.app
# Open DevTools → Network tab
# Perform a login action
# Check that API calls go to your backend URL
```

---

## Troubleshooting CORS

### If you get "CORS error" in browser:

**Problem:** Frontend URL not in backend's `ALLOWED_ORIGINS`

**Solution:**
1. Go to Vercel → Backend → Settings → Environment Variables
2. Find `ALLOWED_ORIGINS`
3. Add your frontend URL (comma-separated):
   ```
   https://your-frontend.vercel.app,https://other-domain.com
   ```
4. Save and redeploy

### Check what origins are allowed:
```bash
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: POST" \
     https://your-backend.vercel.app/

# Check response headers for:
# Access-Control-Allow-Origin: ...
```

---

## Production Checklist

- [ ] PostgreSQL database created and connected
- [ ] `DATABASE_URL` set in Vercel (not SQLite)
- [ ] `SECRET_KEY` generated (32+ characters)
- [ ] Gmail App Password created (not regular Gmail password)
- [ ] All MAIL variables set correctly
- [ ] `ALLOWED_ORIGINS` includes your frontend URL
- [ ] Backend deployed to Vercel
- [ ] Frontend environment variable configured
- [ ] Frontend redeployed with correct API URL
- [ ] Health check endpoint accessible
- [ ] Test login works in production
- [ ] Emails send successfully
- [ ] Check logs for any errors

---

## Next Steps

1. **Update main.py** (optional but recommended):
   - Replace your current backend/app/main.py with the updated version above
   - Change `allow_origins=["*"]` to environment-based CORS

2. **Create .env files**:
   - Create backend/.env.local with development values
   - Create frontend/.env.local with development values

3. **Deploy**:
   - Push updated code to GitHub
   - Set all environment variables in Vercel
   - Verify both frontend and backend deploy successfully

4. **Verify**:
   - Test health endpoint: `https://backend.vercel.app/health`
   - Test login in production frontend
   - Check browser console for errors

---

## References

- FastAPI CORS: https://fastapi.tiangolo.com/tutorial/cors/
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
- PostgreSQL Connection Strings: https://www.postgresql.org/docs/current/libpq-connect-string.html

---

**Once configured, your system is production-ready and secured! 🔒**

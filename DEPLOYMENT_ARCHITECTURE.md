# Architecture & Data Flow Diagram

## Current Setup (Local)
```
┌─────────────────────────────────┐
│     Your Computer               │
├─────────────────────────────────┤
│  Frontend (React/Vite)          │
│  Port: localhost:5173           │
└─────────────┬───────────────────┘
              │ API Calls
              ↓
┌─────────────────────────────────┐
│  Backend (FastAPI)              │
│  Port: localhost:8000           │
└─────────────┬───────────────────┘
              │ Queries
              ↓
┌─────────────────────────────────┐
│  Database (SQLite)              │
│  File: lms.db                   │
└─────────────────────────────────┘
```

## After Deployment (Production)
```
┌──────────────────────────────────────────────────────────────┐
│                     INTERNET (Public)                        │
└──────────────────────────────────────────────────────────────┘
    ↑                                              ↑
    │ HTTP/S                                     │ HTTP/S
    │                                             │
┌─────────────────────────────┐    ┌──────────────────────────┐
│   Frontend on Vercel        │    │  Backend on Vercel       │
│ https://lrms.vercel.app     │    │ https://api.vercel.app   │
│ (React build served from    │    │ (Python serverless)      │
│  Vercel CDN worldwide)      │    │                          │
└─────────────────────────────┘    └────────────┬─────────────┘
                                                │ SQL Queries
                                                ↓
                                    ┌──────────────────────────┐
                                    │  PostgreSQL on Cloud     │
                                    │  Neon / Railway / Render │
                                    │  (accessible online)     │
                                    └──────────────────────────┘
```

## Data Flow Example: User Login

### Local Development
```
Browser                Backend               Database
   │                     │                      │
   │─ login request ────→│                      │
   │                     │─ query user ────────→│
   │                     │←─ user data ────────│
   │←─ token response ──│
```

### After Deployment
```
User's Browser           Your Backend          PostgreSQL
(anywhere)              (Vercel)             (Cloud)
   │                     │                     │
   │─ HTTPS request ────→│                     │
   │ (vercel.app)        │─ SQL query ────────→│
   │                     │←─ result ───────────│
   │←─ JSON response ───│
   │ (with JWT token)    │
```

---

## Step-by-Step Deployment Flow

### Stage 1: Database Setup (5 mins)
```
Choose Provider (Neon/Railway/Render)
    ↓
Sign Up & Create Project
    ↓
Copy PostgreSQL Connection String
    ↓
✅ You have a database URL like:
   postgresql://user:pass@host/db
```

### Stage 2: Backend Deployment (10 mins)
```
Update requirements.txt + Add PostgreSQL driver
    ↓
Create environment variables config
    ↓
Push code to GitHub (or upload to Vercel)
    ↓
Vercel builds & deploys backend
    ↓
✅ You have a backend URL like:
   https://lrms-backend.vercel.app
```

### Stage 3: Connect Everything (5 mins)
```
Add VITE_API_URL to Frontend environment variables
    ↓
Frontend redeploys with correct API URL
    ↓
User visits production frontend
    ↓
Frontend makes API calls to production backend
    ↓
Backend queries production database
    ↓
✅ Everything works online!
```

---

## Key Differences: Local vs Production

| Aspect | Local | Production |
|--------|-------|------------|
| **Frontend** | `http://localhost:5173` | `https://yourapp.vercel.app` |
| **Backend** | `http://localhost:8000` | `https://yourapi.vercel.app` |
| **Database** | `sqlite:///./lms.db` (file) | `postgresql://...` (cloud server) |
| **CORS** | Works with any origin | Only allowed domains |
| **Environment** | `.env.local` file | Vercel dashboard settings |
| **Performance** | Depends on your machine | Global CDN with auto-scaling |
| **Availability** | Only when computer is on | 24/7 online |
| **Users** | Only local network | Anyone on internet |

---

## What Gets Deployed Where

```
GitHub (Your Code Repository)
    │
    ├─→ Frontend/ folder
    │   └─→ Vercel (Auto-builds & deploys on push)
    │       └─→ Hosted at vercel.app
    │
    ├─→ Backend/ folder
    │   └─→ Vercel (Python runtime)
    │       └─→ Hosted at vercel.app
    │
    └─→ Database/ folder (PostgreSQL)
        └─→ Cloud provider (Neon/Railway/etc)
            └─→ Hosted at provider's URL

Your Computer (Local Only)
    ├─→ Source code (not auto-deployed)
    └─→ .env files (NEVER push these)
```

---

## Entity Relationships

```
Users
├─ Students
│  ├─ Can borrow books
│  └─ Have borrowing history
│
├─ Librarians
│  ├─ Can manage books
│  ├─ Can view all borrowings
│  └─ Can send notifications
│
└─ Admins
   ├─ Can manage users
   ├─ Can manage books
   └─ Can access statistics

Books
├─ Title, Author, ISBN
├─ Available copies
├─ Borrow history
└─ Reviews/Ratings

Borrowing Transactions
├─ Who borrowed (Student)
├─ What book (Book ID)
├─ When borrowed
└─ Expected return date
```

---

## API Endpoints Available

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/register` - Create student account
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Books
- `GET /books/` - List all books
- `GET /books/{id}` - Get book details
- `POST /books/` - Add new book (Librarian)
- `PUT /books/{id}` - Update book (Librarian)
- `DELETE /books/{id}` - Delete book (Librarian)

### Borrowing
- `GET /borrows/` - Get user's borrowed books
- `POST /borrows/{book_id}` - Borrow a book
- `PUT /borrows/{id}/return` - Return a book

### Notifications
- `GET /notifications/` - Get user notifications
- `POST /notifications/read/{id}` - Mark as read

### Admin
- `GET /admin/users` - List all users
- `GET /admin/stats` - Get statistics
- `POST /admin/users/{id}/suspend` - Suspend user

### Statistics
- `GET /stats/books-distribution` - Books per category
- `GET /stats/borrowing-trends` - Borrowing trends
- `GET /stats/availability` - Book availability

---

## Environment Variables Summary

**Backend (PostgreSQL connection + Email):**
```
DATABASE_URL=postgresql://...
SECRET_KEY=random-long-string
MAIL_USERNAME=gmail@gmail.com
MAIL_PASSWORD=app-password
MAIL_FROM=gmail@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
```

**Frontend (API location):**
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## Security Checklist

- ✅ Never commit `.env` files to GitHub
- ✅ Use strong, random `SECRET_KEY`
- ✅ Use Gmail App Passwords (not regular password)
- ✅ Set `allow_origins` to specific domains (not "*")
- ✅ Use HTTPS everywhere
- ✅ Don't expose API keys in frontend code
- ✅ Validate all user inputs
- ✅ Use JWT tokens with expiration

---

## Monitoring & Logs

### Backend Logs
1. Vercel Dashboard
2. Select backend project
3. Deployments tab
4. Click latest deployment
5. Logs section shows real-time activity

### Frontend Logs
1. Developer Tools (F12)
2. Console tab shows JavaScript errors
3. Network tab shows API calls
4. Check response codes (200, 401, 500, etc.)

### Database Logs
1. Cloud provider dashboard
2. Check connection status
3. Verify no IP restrictions
4. Monitor connection pool

---

**You're ready to go online! 🚀**

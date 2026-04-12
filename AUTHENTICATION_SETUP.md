# 🔐 Libris Authentication System Setup & Testing Guide

## Overview

The Libris (Library Retrieval Management System) now has a fully integrated authentication system connecting React frontend with FastAPI backend.

**Key Features:**
- ✅ User registration with validation
- ✅ Login with JWT tokens
- ✅ Password reset functionality
- ✅ Role-based access (student/admin)
- ✅ Token storage in localStorage
- ✅ Secure password hashing (bcrypt)

---

## System Architecture

### Backend (FastAPI)
- **Framework:** FastAPI 0.115.12
- **Database:** SQLite (./lms.db)
- **Auth:** JWT tokens + bcrypt password hashing
- **Endpoints:** /auth/register, /auth/login, /auth/forgot-password, /auth/reset-password

### Frontend (React)
- **Framework:** React 19 + TypeScript
- **API Integration:** Direct HTTP calls to backend
- **Token Storage:** localStorage
- **Base URL:** http://localhost:8000 (configured in .env)

---

## Setup Instructions

### 1. Backend Setup (Already Running ✅)

Your backend is already running on `http://0.0.0.0:8000`

**If you need to restart:**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 2. Frontend Setup

#### Environment Configuration
Frontend configuration is in `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

#### Development Server
```bash
cd frontend
npm install  # (if needed)
npm run dev  # Runs on http://localhost:5173
```

#### Production Build
```bash
cd frontend
npm run build  # Creates dist/ folder
```

---

## Testing Authentication Flow

### Test Scenario 1: User Registration

**Step 1: Navigate to Registration**
- URL: http://localhost:5173/register
- Fill in the form:
  - Full Name: `John Doe`
  - Registration Number: `STU-2024-001`
  - Email: `john@gmail.com` (⚠️ Must end with @gmail.com)
  - Password: `SecurePassword123` (min 8 characters)
  - Confirm Password: `SecurePassword123`
- Click **Create Account**

**Expected Result:**
- ✅ Form validates input
- ✅ "Registration successful" toast appears
- ✅ Redirects to /login page
- ✅ Student created in database

**Verify in Backend:**
- Check SQLite database with: `sqlite3 backend/lms.db "SELECT * FROM students;"`

---

### Test Scenario 2: User Login

**Step 1: Navigate to Login**
- URL: http://localhost:5173/login
- Fill in the form:
  - Email: `john@gmail.com`
  - Password: `SecurePassword123`
- Click **Sign in to Libris**

**Expected Result:**
- ✅ "Login successful" toast appears
- ✅ JWT token stored in localStorage
- ✅ User name stored in localStorage
- ✅ Redirects to /student (student dashboard)

**Verify in Browser Console:**
```javascript
// Check localStorage
console.log(localStorage.getItem('token'))
console.log(localStorage.getItem('userRole'))
console.log(localStorage.getItem('currentUserName'))
```

---

### Test Scenario 3: Password Reset

**Step 1: Request Password Reset**
- URL: http://localhost:5173/forgot-password
- Enter Email: `john@gmail.com`
- Click **Send Reset Email**

**Expected Result:**
- ✅ "Password reset email sent" toast appears
- ✅ Reset token generated (shown in mock implementation)

**Step 2: Reset Password**
- Click reset link or navigate to: http://localhost:5173/reset-password?token=YOUR_TOKEN
- Enter New Password: `NewPassword456`
- Confirm Password: `NewPassword456`
- Click **Reset Password**

**Expected Result:**
- ✅ "Password has been reset successfully" message
- ✅ Redirects to /login
- ✅ Can login with new password

---

### Test Scenario 4: Invalid Credentials

**Step 1: Try Login with Wrong Password**
- Email: `john@gmail.com`
- Password: `WrongPassword`
- Click **Sign in**

**Expected Result:**
- ❌ Error: "Invalid email or password"
- ❌ SweetAlert2 error popup
- ❌ Remains on login page

**Step 2: Try Login with Non-existent Email**
- Email: `notfound@gmail.com`
- Password: `SomePassword123`
- Click **Sign in**

**Expected Result:**
- ❌ Error: "Invalid email or password"
- ❌ SweetAlert2 error popup

---

### Test Scenario 5: Email Validation (Non-Gmail)

**Step 1: Register with Invalid Domain**
- Navigate to /register
- Fill in email: `user@yahoo.com` (not @gmail.com)
- Fill in other fields normally
- Click **Create Account**

**Expected Result:**
- ❌ Error: "Email must end with @gmail.com"
- ❌ Form validation fails
- ❌ No account created

---

### Test Scenario 6: Duplicate Account Prevention

**Step 1: Try to Register Same Email**
- Navigate to /register
- Use already registered email: `john@gmail.com`
- Fill in other fields with different values
- Click **Create Account**

**Expected Result:**
- ❌ Error: "Student with this email or registration number already exists"
- ❌ No duplicate account created

---

## API Endpoints Reference

### POST /auth/register
**Request:**
```json
{
  "full_name": "John Doe",
  "email": "john@gmail.com",
  "registration_number": "STU-2024-001",
  "password": "SecurePassword123"
}
```

**Response (Success):**
```json
{
  "message": "Registration successful"
}
```

**Response (Error):**
```json
{
  "detail": "Email must end with @gmail.com"
}
```

---

### POST /auth/login
**Request:**
```json
{
  "email": "john@gmail.com",
  "password": "SecurePassword123"
}
```

**Response (Success):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user_type": "student",
  "student": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@gmail.com",
    "registration_number": "STU-2024-001"
  }
}
```

**Response (Error):**
```json
{
  "detail": "Invalid email or password"
}
```

---

### POST /auth/forgot-password
**Request:**
```json
{
  "email": "john@gmail.com"
}
```

**Response:**
```json
{
  "message": "Password reset email has been sent"
}
```

---

### POST /auth/reset-password
**Request:**
```json
{
  "token": "eyJhbGc...",
  "new_password": "NewPassword456"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

---

## Environment Variables

### Backend (.env)
```env
JWT_SECRET_KEY=your_super_secret_key_change_this_in_production_12345
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# SMTP for email notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## Security Considerations

### Password Storage
- ✅ Passwords are hashed using bcrypt
- ✅ Never stored in plaintext
- ✅ Verified using bcrypt.verify()

### JWT Tokens
- ✅ Tokens expire after 1440 minutes (24 hours)
- ✅ Signed with JWT_SECRET_KEY
- ✅ Stored in localStorage (frontend)
- ✅ Sent in Authorization header for protected endpoints

### Email Validation
- ✅ Must be valid email format
- ✅ Must end with @gmail.com (configurable)
- ✅ Must be unique per student

### CORS
- backend needs to allow requests from frontend
- Configure in FastAPI if needed

---

## Troubleshooting

### Issue: "Invalid email or password" even with correct credentials

**Solution:**
1. Clear browser localStorage: `localStorage.clear()`
2. Verify email ends with @gmail.com
3. Check database: `sqlite3 backend/lms.db "SELECT email FROM students LIMIT 5;"`
4. Try resetting password via forgot-password flow

### Issue: CORS Error on Registration/Login

**Solution:**
1. Ensure backend is running: http://localhost:8000/docs should load
2. Check VITE_API_URL in frontend/.env is correct
3. Verify no typos in API URL

### Issue: Token not being stored

**Solution:**
1. Open browser DevTools → Application → Local Storage
2. Check if 'token' key exists after login
3. If not, check browser console for errors
4. Verify login response contains access_token

### Issue: Redirect Loop or Wrong Route

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Ensure routes exist: `/student`, `/admin`, `/login`, `/register`
3. Check AuthContext is properly wrapping app
4. Verify normalizeRole() function converts roles correctly

---

## Next Steps

1. ✅ Test all authentication flows (see scenarios above)
2. ⏳ Configure SMTP for real email notifications
3. ⏳ Implement role-based protected routes
4. ⏳ Add two-factor authentication (2FA)
5. ⏳ Connect admin librarian login flow
6. ⏳ Implement session timeout logic

---

## Quick Reference Commands

```bash
# Start backend
cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000

# Start frontend dev server
cd frontend && npm run dev

# Build frontend production
cd frontend && npm run build

# View backend API docs
# Open: http://localhost:8000/docs

# Check database
sqlite3 backend/lms.db

# Clear frontend localStorage
# In browser console: localStorage.clear()
```

---

**Status:** ✅ Ready for Testing!

All authentication components are connected and ready to use. Follow the testing scenarios above to verify functionality.

import { ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/admin/AdminLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import StudentDashboard from './pages/StudentDashboard'
import BookDetails from './pages/BookDetails'
import AddBook from './pages/InventoryPage'
import AdminUsers from './pages/AdminUsers'
import MyBorrowedBooks from './pages/MyBorrowedBooks'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'
import AdminBorrowRequests from './pages/admin/AdminBorrowRequests'
import { useAuth } from './contexts/AuthContext'

/**
 * ProtectedRoute: Requires authentication
 * Redirects to /login if not authenticated
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

/**
 * AdminRoute: Requires admin role
 * Redirects to /student if not admin
 */
function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, role } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (role !== 'admin') {
    return <Navigate to="/student" replace />
  }
  
  return children
}

/**
 * StudentRoute: Requires student role
 * Redirects to /admin if admin tries to access
 */
function StudentRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, role } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (role === 'admin') {
    return <Navigate to="/admin" replace />
  }
  
  return children
}

/**
 * PublicRoute: For login/register - redirects authenticated users
 */
function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, role } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/student'} replace />
  }
  
  return children
}

function App() {
  const { isAuthenticated, role } = useAuth()

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to={role === 'admin' ? '/admin' : '/student'} replace /> : <LandingPage />} 
        />
        <Route path="/about" element={<About />} />
        
        {/* Auth Routes - using PublicRoute to redirect if already authenticated */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* Protected Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentRoute>
                <Layout>
                  <StudentDashboard />
                </Layout>
              </StudentRoute>
            </ProtectedRoute>
          }
        />

        {/* Protected General Routes */}
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <BookDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/my-borrowed-books"
          element={
            <ProtectedRoute>
              <Layout>
                <MyBorrowedBooks />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="inventory" element={<AddBook />} />
          <Route path="borrow-requests" element={<AdminBorrowRequests />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Redirect /dashboard based on role */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Navigate to={role === 'admin' ? '/admin' : '/student'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect /add to admin inventory */}
        <Route path="/add" element={<Navigate to="/admin/inventory" replace />} />

        {/* Catch-all - redirect to appropriate page */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to={role === 'admin' ? '/admin' : '/student'} replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App

import { ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/admin/AdminLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import StudentDashboard from './pages/StudentDashboard'
import BookDetails from './pages/BookDetails'
import AddBook from './pages/InventoryPage'
import AdminUsers from './pages/AdminUsers'
import MyBorrowedBooks from './pages/MyBorrowedBooks'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'
import { useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const isDevBypass = import.meta.env.DEV && location.pathname !== '/login' && location.pathname !== '/register'
  if (isDevBypass) return children
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { role } = useAuth()
  const isDevBypass = import.meta.env.DEV && (location.pathname.startsWith('/admin') || location.pathname === '/dashboard')
  if (isDevBypass) return children
  if (role !== 'admin') return <Navigate to="/student" replace />
  return children
}

function StudentRoute({ children }: { children: ReactNode }) {
  const { role } = useAuth()
  if (role === 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  const { isAuthenticated, role } = useAuth()

  const authenticatedHome = role === 'admin' ? '/dashboard' : '/student'

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/student"
            element={<ProtectedRoute><StudentRoute><StudentDashboard /></StudentRoute></ProtectedRoute>}
          />

          <Route
            path="/admin"
            element={<ProtectedRoute><AdminRoute><AdminLayout /></AdminRoute></ProtectedRoute>}
          >
            <Route index element={<Dashboard />} />
            <Route path="books" element={<AddBook />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="borrowed" element={<MyBorrowedBooks />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route
            path="/dashboard"
            element={<Navigate to="/admin" replace />}
          />
          <Route path="/add" element={<Navigate to="/admin/books" replace />} />
          <Route path="/books/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated ? authenticatedHome : '/'} replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

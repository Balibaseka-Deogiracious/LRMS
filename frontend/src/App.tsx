import { ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import SearchPage from './pages/SearchPage'
import BookDetails from './pages/BookDetails'
import AddBook from './pages/InventoryPage'
import AdminUsers from './pages/AdminUsers'
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
  const isDevBypass = import.meta.env.DEV && (location.pathname.startsWith('/admin') || location.pathname === '/dashboard' || location.pathname === '/add')
  if (isDevBypass) return children
  if (role !== 'admin') return <Navigate to="/resources" replace />
  return children
}

function UserResourcesRoute({ children }: { children: ReactNode }) {
  const { role } = useAuth()
  if (role === 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  const { isAuthenticated, role } = useAuth()

  const authenticatedHome = role === 'admin' ? '/dashboard' : '/resources'

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resources" element={<ProtectedRoute><UserResourcesRoute><SearchPage /></UserResourcesRoute></ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><AdminRoute><Dashboard /></AdminRoute></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute><AdminRoute><Dashboard /></AdminRoute></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute><AdminRoute><AdminUsers /></AdminRoute></ProtectedRoute>}
          />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AdminRoute><AddBook /></AdminRoute></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated ? authenticatedHome : '/'} replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

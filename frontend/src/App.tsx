import { ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import SearchPage from './pages/SearchPage'
import BookDetails from './pages/BookDetails'
import AddBook from './pages/InventoryPage'
import { useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { role } = useAuth()
  if (role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AdminRoute><AddBook /></AdminRoute></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

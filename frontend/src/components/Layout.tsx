import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/library-logo.svg'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme()
  const { logout, role, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isPublicRoute = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register'
  const isAdminArea = location.pathname.startsWith('/admin')
  const homePath = role === 'admin' ? '/dashboard' : '/resources'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (isPublicRoute) {
    if (location.pathname === '/') return <>{children}</>
    return (
      <div className="auth-shell">
        <div className="container py-4">{children}</div>
      </div>
    )
  }

  return (
    <div>
      <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light border-bottom'}`}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2" to={isAuthenticated ? homePath : '/'}>
            <img src={logo} alt="LRMS logo" width="28" height="28" style={{ borderRadius: 8 }} />
            <span>LRMS</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {role === 'admin' ? (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/admin">Admin Dashboard</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/search">Search Books</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/admin/books">Manage Books</Link></li>
                </>
              ) : (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/resources">Resources</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/search">Search Books</Link></li>
                </>
              )}
            </ul>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
                <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'} me-1`} />
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div className={isAdminArea ? 'mt-2' : 'container mt-4'}>{children}</div>
    </div>
  )
}

export default Layout

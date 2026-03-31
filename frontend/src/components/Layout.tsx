import React from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/library-logo.svg'
import LibryAssistant from './LibryAssistant'
import LandingNavbar from './LandingNavbar'
import './Layout.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme()
  const { logout, role, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isPublicRoute = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register'
  const shouldShowAssistant = location.pathname === '/' || location.pathname.startsWith('/admin') || location.pathname.startsWith('/student')
    || location.pathname.startsWith('/search') || location.pathname.startsWith('/books/')
  const isAdminArea = location.pathname.startsWith('/admin')
  const homePath = role === 'admin' ? '/dashboard' : '/student'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (isPublicRoute) {
    if (location.pathname === '/') {
      return (
        <>
          <LandingNavbar />
          {children}
          {shouldShowAssistant && <LibryAssistant />}
        </>
      )
    }
    return (
      <div className="auth-shell">
        <div className="container py-4 app-auth-content">{children}</div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {!isAdminArea && (
        <nav className={`navbar navbar-expand-lg app-topbar ${theme === 'dark' ? 'navbar-dark app-topbar-dark' : 'navbar-light app-topbar-light'}`}>
          <div className="container-fluid">
            <Link className="navbar-brand d-flex align-items-center gap-2" to={isAuthenticated ? homePath : '/'}>
              <img src={logo} alt="LRMS logo" width="28" height="28" style={{ borderRadius: 8 }} />
              <span className="fw-semibold">LRMS</span>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="nav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 app-nav-links">
                {role === 'admin' ? (
                  <>
                    <li className="nav-item"><NavLink className={({ isActive }) => `nav-link app-nav-link ${isActive ? 'active' : ''}`} to="/admin">Librarian Dashboard</NavLink></li>
                    <li className="nav-item"><NavLink className={({ isActive }) => `nav-link app-nav-link ${isActive ? 'active' : ''}`} to="/search">Search Books</NavLink></li>
                    <li className="nav-item"><NavLink className={({ isActive }) => `nav-link app-nav-link ${isActive ? 'active' : ''}`} to="/admin/books">Manage Books</NavLink></li>
                  </>
                ) : (
                  <>
                    <li className="nav-item"><NavLink className={({ isActive }) => `nav-link app-nav-link ${isActive ? 'active' : ''}`} to="/resources">Resources</NavLink></li>
                    <li className="nav-item"><NavLink className={({ isActive }) => `nav-link app-nav-link ${isActive ? 'active' : ''}`} to="/search">Search Books</NavLink></li>
                  </>
                )}
              </ul>
              <div className="d-flex align-items-center gap-2 app-topbar-actions">
                <button className="btn btn-outline-secondary btn-sm app-pill-btn" onClick={toggleTheme}>
                  <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'} me-1`} />
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button className="btn btn-outline-danger btn-sm app-pill-btn" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className={isAdminArea ? 'app-content app-content-admin' : 'container app-content app-content-standard'}>{children}</main>
      {shouldShowAssistant && <LibryAssistant />}
    </div>
  )
}

export default Layout

import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/library-logo.svg'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme()
  const { logout, role, setRole, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isPublicRoute = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (isPublicRoute) {
    if (location.pathname === '/') return <>{children}</>
    return <div className="container mt-4">{children}</div>
  }

  return (
    <div>
      <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light border-bottom'}`}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/dashboard">
            <img src={logo} alt="LRMS logo" width="28" height="28" style={{ borderRadius: 8 }} />
            <span>LRMS</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/search">Search Books</Link></li>
              {role === 'admin' && (
                <li className="nav-item"><Link className="nav-link" to="/add">Add Book</Link></li>
              )}
            </ul>
            <div className="d-flex align-items-center gap-2">
              {isAuthenticated && (
                <select
                  className="form-select form-select-sm"
                  style={{ width: 120 }}
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              )}
              <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
                <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'} me-1`} />
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mt-4">{children}</div>
    </div>
  )
}

export default Layout

import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import logo from '../assets/library-logo.svg'

export default function LandingNavbar() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <nav className={`navbar navbar-expand-lg border-bottom sticky-top landing-topbar ${isDark ? 'navbar-dark' : 'navbar-light'}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2 landing-topbar-brand" to="/">
          <img src={logo} alt="LRMS logo" width="32" height="32" />
          <span>Library Retrieval</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse ms-auto" id="navbarNav">
          <div className="ms-auto d-flex gap-2 align-items-center">
            <button
              type="button"
              className={`btn btn-sm ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
              onClick={toggleTheme}
              title="Toggle dark/light mode"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`} />
            </button>
            <Link to="/login" className={`btn btn-sm ${isDark ? 'btn-light' : 'btn-secondary'}`}>
              Login
            </Link>
            <Link to="/register" className={`btn btn-sm ${isDark ? 'btn-info' : 'btn-primary'}`}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

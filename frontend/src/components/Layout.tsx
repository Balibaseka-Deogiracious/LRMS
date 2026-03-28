import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">LRMS</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/search">Search Books</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/add">Add Book</Link></li>
            </ul>
            <div className="d-flex">
              <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mt-4">{children}</div>
    </div>
  )
}

export default Layout

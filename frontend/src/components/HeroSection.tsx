import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

interface HeroSectionProps {
  onExplore?: () => void
  onDashboard?: () => void
}

export default function HeroSection({ onExplore, onDashboard }: HeroSectionProps) {
  return (
    <header className="landing-hero py-5 py-lg-6 position-relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="position-absolute top-0 end-0 w-50 h-100 opacity-10" style={{
        background: 'radial-gradient(circle, rgba(13,110,253,0.5) 0%, transparent 70%)',
        zIndex: 0
      }} />
      
      <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-7 text-white">
            <span className="badge bg-info-subtle text-info mb-3" style={{ fontSize: '0.9rem' }}>
              <i className="bi bi-sparkles me-1" /> Modern Library Platform
            </span>
            <h1 className="display-4 fw-bold mb-3">
              Find, borrow, and manage books in one elegant system.
            </h1>
            <p className="lead text-white-75 mb-4">
              Streamline your library workflows with fast discovery, intuitive borrowing, and powerful administration tools.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/search" className="btn btn-warning btn-lg fw-semibold px-4" onClick={onExplore}>
                <i className="bi bi-search me-2" />
                Explore Catalog
              </Link>
              <Link to="/dashboard" className="btn btn-outline-light btn-lg px-4" onClick={onDashboard}>
                <i className="bi bi-speedometer2 me-2" />
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Modern library illustration placeholder */}
          <div className="col-12 col-lg-5 text-center">
            <div className="rounded-3 p-4" style={{
              background: 'linear-gradient(135deg, rgba(13,110,253,0.1) 0%, rgba(108,117,125,0.1) 100%)',
              minHeight: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div className="text-white text-center">
                <i className="bi bi-book-half" style={{ fontSize: '5rem', opacity: 0.8 }} />
                <p className="mt-3 text-white-75">Modern Library System</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

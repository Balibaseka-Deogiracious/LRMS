import { Link } from 'react-router-dom'
import LibraryImage from './LibraryImage'
import './HeroSection.css'

interface HeroSectionProps {
  onExplore?: () => void
  onDashboard?: () => void
}

export default function HeroSection({ onExplore, onDashboard }: HeroSectionProps) {
  return (
    <section id="home">
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
                <i className="bi bi-sparkles me-1" /> Welcome to LRMS
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Find, borrow, and manage books in one elegant system.
              </h1>
              <p className="lead text-white-75 mb-4">
                Streamline your library workflows with fast discovery, intuitive borrowing, and powerful administration tools.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-warning btn-lg fw-semibold px-4" onClick={onExplore}>
                  <i className="bi bi-search me-2" />
                  Explore Catalog
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4" onClick={onDashboard}>
                  <i className="bi bi-speedometer2 me-2" />
                  Go to Dashboard
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <LibraryImage
                alt="Modern library with books"
                searchQuery="modern library books shelves"
                style={{
                  minHeight: '350px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>
        </div>
      </header>
    </section>
  )
}

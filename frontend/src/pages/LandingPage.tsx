import { Link } from 'react-router-dom'
import { FiSearch, FiBookOpen, FiDatabase } from 'react-icons/fi'
import './landing.css'

export default function LandingPage() {
  return (
    <div className="landing-root">
      <nav className="navbar navbar-expand-lg landing-nav py-3">
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
            <span className="brand-mark">LR</span>
            <span>Library Retrieval</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#landingNav"
            aria-controls="landingNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="landingNav">
            <div className="ms-auto d-flex gap-2">
              <Link to="/login" className="btn btn-outline-light">Login</Link>
              <Link to="/register" className="btn btn-light fw-semibold">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      <header className="landing-hero py-5 py-lg-6">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7 text-white">
              <span className="hero-badge">Modern Library Platform</span>
              <h1 className="display-4 fw-bold mt-3 mb-3">Find, borrow, and manage books in one elegant system.</h1>
              <p className="lead text-white-75 mb-4">
                Streamline your library workflows with fast discovery, intuitive borrowing, and powerful administration tools.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/search" className="btn btn-warning btn-lg fw-semibold px-4">Explore Catalog</Link>
                <Link to="/dashboard" className="btn btn-outline-light btn-lg px-4">Go to Dashboard</Link>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="hero-panel p-4 p-lg-5">
                <h5 className="fw-semibold mb-3">What you get</h5>
                <ul className="list-unstyled m-0 d-grid gap-2">
                  <li>Fast search with rich filters</li>
                  <li>Borrowing and availability tracking</li>
                  <li>Role-based controls for admins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Core Features</h2>
            <p className="text-muted m-0">Built for both readers and library administrators.</p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3"><FiSearch /></div>
                  <h5 className="card-title">Search Books</h5>
                  <p className="card-text text-muted mb-0">Discover books instantly with title, author, and category filters.</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3"><FiBookOpen /></div>
                  <h5 className="card-title">Borrow Books</h5>
                  <p className="card-text text-muted mb-0">Track availability, borrow with confidence, and manage returns smoothly.</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3"><FiDatabase /></div>
                  <h5 className="card-title">Manage Library</h5>
                  <p className="card-text text-muted mb-0">Admins can organize inventory and monitor the full catalog lifecycle.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer py-4 mt-4">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
          <p className="mb-0">Library Retrieval System</p>
          <div className="text-md-end">
            <p className="mb-0">Contact: support@libraryretrieval.com</p>
            <small>Phone: +1 (555) 010-1234</small>
          </div>
        </div>
      </footer>
    </div>
  )
}

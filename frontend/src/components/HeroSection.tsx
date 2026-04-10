import { Link } from 'react-router-dom'
import Typewriter from 'typewriter-effect'
import './HeroSection.css'

export default function HeroSection() {
  // Architectural library with curved shelves background
  const architecturalLibraryBg = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2000&q=80'

  return (
    <section id="home" className="hero-wrapper">
      <header className="landing-hero py-5 py-lg-6 position-relative overflow-hidden" 
        style={{
          backgroundImage: `url('${architecturalLibraryBg}')`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}>
        
        {/* Dark black gradient overlay for contrast - left to right gradient */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.5) 100%)',
          zIndex: 1
        }} />
        
        {/* Subtle overlay effect */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 193, 7, 0.03) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)`,
          zIndex: 2
        }} />

        <div className="container py-5 position-relative" style={{ zIndex: 3 }}>
          {/* Top Navigation with Logo */}
          <div className="row mb-5">
            <div className="col-12">
              {/* Welcome Badge */}
              <div className="badge" style={{ 
                backgroundColor: 'rgba(255, 193, 7, 0.3)', 
                borderLeft: '3px solid #ffc107',
                paddingLeft: '12px',
                paddingRight: '16px',
                display: 'inline-block',
                backdropFilter: 'blur(10px)'
              }}>
                <span style={{ color: '#87ceeb', fontSize: '0.9rem', fontWeight: '500' }}>
                  Welcome to Libris
                </span>
              </div>
            </div>
          </div>

          <div className="row align-items-center g-4">
            {/* Left Content */}
            <div className="col-12 col-lg-8">
              {/* Main Headline with Dynamic Text */}
              <h1 className="hero-headline mb-4">
                <span className="text-white fw-bold" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.2' }}>
                  Find, borrow, and&nbsp;
                  <span className="typewriter-wrapper" style={{ 
                    color: '#ffc107',
                    fontWeight: '700',
                    display: 'inline-block',
                    minWidth: '300px'
                  }}>
                    <Typewriter
                      options={{
                        strings: [
                          'manage books',
                          'explore journals',
                          'access research',
                          'track resources',
                        ],
                        autoStart: true,
                        loop: true,
                        deleteSpeed: 60,
                        delay: 80,
                        cursor: '|'
                      }}
                    />
                  </span>
                </span>
                <span className="text-white fw-bold" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.2', display: 'block' }}>
                  system.
                </span>
              </h1>

              {/* Body Text */}
              <p className="lead text-white mb-5" style={{ 
                fontSize: '1.1rem',
                lineHeight: '1.6',
                opacity: 0.95,
                maxWidth: '550px'
              }}>
                Streamline your library workflows with fast discovery, intuitive borrowing, and powerful administration tools.
              </p>

              {/* Call to Action Buttons */}
              <div className="d-flex flex-wrap gap-3 align-items-center">
                {/* Gold Button - Explore Catalog */}
                <Link 
                  to="/register" 
                  className="btn btn-primary fw-semibold px-4 py-2" 
                  style={{
                    backgroundColor: '#ffc107',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 193, 7, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 193, 7, 0.3)'
                  }}
                >
                  <i className="bi bi-search" style={{ fontSize: '1.1rem' }} />
                  Explore Catalog
                </Link>

                {/* Transparent Button - Go to Dashboard */}
                <Link 
                  to="/login" 
                  className="btn btn-outline-light fw-semibold px-4 py-2" 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '1.5px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(5px)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <i className="bi bi-compass" style={{ fontSize: '1.1rem' }} />
                  Go to Dashboard
                </Link>
              </div>

            </div>
          </div>
        </div>
      </header>
    </section>
  )
}

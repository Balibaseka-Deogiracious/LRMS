import { Link } from 'react-router-dom'

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  content?: string
  links?: FooterLink[]
}

export default function LandingFooter() {
  const currentYear = new Date().getFullYear()

  const sections: FooterSection[] = [
    {
      title: 'About',
      content: 'Library Retrieval System helps teams discover, borrow, and manage books efficiently.',
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'Login', href: '/login' },
        { label: 'Register', href: '/register' },
        { label: 'Search Books', href: '/search' },
      ],
    },
  ]

  return (
    <footer className="landing-footer py-5 border-top">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* About */}
          <div className="col-12 col-md-4">
            <h6 className="fw-semibold mb-3">About</h6>
            <p className="small text-muted mb-0">
              Library Retrieval System helps teams discover, borrow, and manage books efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-4">
            <h6 className="fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><Link className="text-decoration-none text-muted" to="/login">Login</Link></li>
              <li><Link className="text-decoration-none text-muted" to="/register">Register</Link></li>
              <li><Link className="text-decoration-none text-muted" to="/search">Search Books</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-4">
            <h6 className="fw-semibold mb-3">Contact</h6>
            <p className="mb-1 small">
              <i className="bi bi-envelope me-2" />
              gratiuslee3@gmail.com
            </p>
            <p className="mb-3 small">
              <i className="bi bi-telephone me-2" />
              +(256) 742685864
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted text-decoration-none">
                <i className="bi bi-facebook" />
              </a>
              <a href="#" className="text-muted text-decoration-none">
                <i className="bi bi-twitter-x" />
              </a>
              <a href="#" className="text-muted text-decoration-none">
                <i className="bi bi-instagram" />
              </a>
              <a href="#" className="text-muted text-decoration-none">
                <i className="bi bi-linkedin" />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4" />
        <p className="text-center small text-muted mb-0">
          © {currentYear} Library Retrieval System. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

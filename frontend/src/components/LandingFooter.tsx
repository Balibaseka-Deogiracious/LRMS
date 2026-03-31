import { Link } from 'react-router-dom'

export default function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <section id="contact">
      <footer className="landing-footer py-5 border-top">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <h6 className="fw-semibold mb-3">About</h6>
              <p className="small landing-footer-text mb-0">
                Library Retrieval Management System helps teams discover, borrow, and manage books efficiently.
              </p>
            </div>

            <div className="col-12 col-md-4">
              <h6 className="fw-semibold mb-3">Quick Links</h6>
              <ul className="list-unstyled small">
                <li><Link className="text-decoration-none landing-footer-link" to="/login">Login</Link></li>
                <li><Link className="text-decoration-none landing-footer-link" to="/register">Register</Link></li>
                <li><Link className="text-decoration-none landing-footer-link" to="/login">Search Books</Link></li>
              </ul>
            </div>

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
                <a href="#" className="landing-footer-link text-decoration-none" aria-label="Facebook">
                  <i className="bi bi-facebook" />
                </a>
                <a href="#" className="landing-footer-link text-decoration-none" aria-label="Twitter">
                  <i className="bi bi-twitter-x" />
                </a>
                <a href="#" className="landing-footer-link text-decoration-none" aria-label="Instagram">
                  <i className="bi bi-instagram" />
                </a>
                <a href="#" className="landing-footer-link text-decoration-none" aria-label="LinkedIn">
                  <i className="bi bi-linkedin" />
                </a>
              </div>
            </div>
          </div>

          <hr className="my-4 landing-footer-divider" />
          <p className="text-center small landing-footer-text mb-0">
            © {currentYear} Library Retrieval Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  )
}

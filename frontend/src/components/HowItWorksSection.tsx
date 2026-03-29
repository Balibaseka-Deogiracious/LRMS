import { motion } from 'framer-motion'
import LibraryImage from './LibraryImage'

interface Step {
  number: number
  title: string
  description: string
  icon: string
  color: string
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Register',
    description: 'Create your account and sign in securely.',
    icon: 'bi-person-plus',
    color: 'primary',
  },
  {
    number: 2,
    title: 'Search Books',
    description: 'Find titles instantly by author, category, or status.',
    icon: 'bi-search',
    color: 'info',
  },
  {
    number: 3,
    title: 'Borrow',
    description: 'Borrow available books with one click and track due dates.',
    icon: 'bi-book',
    color: 'success',
  },
  {
    number: 4,
    title: 'Return',
    description: 'Return books from your dashboard when you are done.',
    icon: 'bi-arrow-counterclockwise',
    color: 'warning',
  },
]

export default function HowItWorksSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2 display-6">How It Works</h2>
          <p className="text-muted">Get started in minutes with a simple 4-step flow</p>
        </div>

        {/* Library showcase image */}
        <div className="row g-4 mb-5">
          <div className="col-12">
            <LibraryImage
              alt="Library workflow showcase"
              searchQuery="library reading books people"
              style={{ maxHeight: '300px', width: '100%' }}
            />
          </div>
        </div>

        <div className="row g-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              className="col-12 col-md-6 col-lg-3"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
            >
              <div className="card h-100 border-0 shadow-sm how-card">
                <div className="card-body p-4 text-center">
                  <div
                    className={`how-step bg-${step.color} text-white mx-auto mb-3`}
                    style={{
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {step.number}
                  </div>
                  <h6 className="fw-semibold">{step.title}</h6>
                  <p className="text-muted small mb-0">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection lines (visual enhancement) */}
        <div className="d-none d-lg-flex justify-content-center gap-2 mt-5">
          <div className="text-muted">
            <i className="bi bi-arrow-right" style={{ fontSize: '1.5rem' }} />
          </div>
          <div className="text-muted">
            <i className="bi bi-arrow-right" style={{ fontSize: '1.5rem' }} />
          </div>
          <div className="text-muted">
            <i className="bi bi-arrow-right" style={{ fontSize: '1.5rem' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

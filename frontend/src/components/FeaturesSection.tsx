import { motion } from 'framer-motion'
import LibraryImage from './LibraryImage'

interface Feature {
  icon: string
  title: string
  description: string
  delay: number
  imageQuery: string
}

const features: Feature[] = [
  {
    icon: 'bi-search',
    title: 'Smart Search',
    description: 'Discover books instantly with title, author, and category filters.',
    delay: 0,
    imageQuery: 'library search books',
  },
  {
    icon: 'bi-journal-check',
    title: 'Easy Borrowing',
    description: 'Track availability, borrow with confidence, and manage returns smoothly.',
    delay: 0.08,
    imageQuery: 'person borrowing books library',
  },
  {
    icon: 'bi-building-gear',
    title: 'Library Management',
    description: 'Organize inventory and monitor the full catalog lifecycle from one place.',
    delay: 0.16,
    imageQuery: 'library management organize books',
  },
]

export default function FeaturesSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2 display-6">Core Features</h2>
          <p className="text-muted">Everything you need for modern library management</p>
        </div>

        <div className="row g-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="col-12 col-md-6 col-lg-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: feature.delay }}
            >
              <div className="card h-100 border-0 shadow-sm feature-card">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <LibraryImage
                    alt={feature.title}
                    searchQuery={feature.imageQuery}
                    style={{ minHeight: '100%' }}
                  />
                </div>
                <div className="card-body p-4">
                  <div
                    className="feature-icon mb-3 p-3 rounded-circle d-inline-block"
                    style={{ background: 'rgba(13, 110, 253, 0.1)' }}
                  >
                    <i className={`bi ${feature.icon}`} style={{ fontSize: '1.5rem', color: '#0d6efd' }} />
                  </div>
                  <h5 className="card-title fw-bold">{feature.title}</h5>
                  <p className="card-text text-muted">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    icon: 'bi-collection',
    title: 'Digital Catalog',
    description: 'Browse books and journals with searchable metadata and smart filters.',
    delay: 0,
    imageQuery: 'digital library catalog books',
  },
  {
    icon: 'bi-journal-richtext',
    title: 'Research Repository',
    description: 'Access theses, dissertations, and faculty research in one institutional hub.',
    delay: 0.08,
    imageQuery: 'research repository theses university',
  },
  {
    icon: 'bi-bookmark-check',
    title: 'Smart Borrowing',
    description: 'Reserve resources, track due dates, and manage borrowing history seamlessly.',
    delay: 0.16,
    imageQuery: 'library borrowing desk books',
  },
]

export default function FeaturesSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section id="features" className="bg-light py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2 display-6">Core Features</h2>
          <p className="text-muted">Everything you need for modern academic library workflows</p>
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
                    style={{ background: 'rgba(37, 65, 148, 0.12)' }}
                  >
                    <i className={`bi ${feature.icon}`} style={{ fontSize: '1.5rem', color: '#254194' }} />
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

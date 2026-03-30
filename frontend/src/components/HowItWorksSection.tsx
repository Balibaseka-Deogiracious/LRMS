import { motion } from 'framer-motion'

interface Step {
  number: number
  title: string
  description: string
  icon: string
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Register',
    description: 'Create your LRMS account and sign in securely.',
    icon: 'bi-person-plus',
  },
  {
    number: 2,
    title: 'Search',
    description: 'Find books, theses, and repository items with fast filters.',
    icon: 'bi-search',
  },
  {
    number: 3,
    title: 'Borrow',
    description: 'Borrow available resources and track your due dates from one place.',
    icon: 'bi-book',
  },
]

export default function HowItWorksSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section id="how-it-works" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2 display-6">How It Works</h2>
          <p className="text-muted">A simple 1-2-3 process for students and researchers</p>
        </div>

        <div className="row g-4 align-items-stretch">
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              className="col-12 col-md-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <article className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className="mx-auto mb-3 d-flex h-[64px] w-[64px] items-center justify-center rounded-circle text-white" style={{ backgroundColor: '#254194' }}>
                    <span className="fw-bold fs-4">{step.number}</span>
                  </div>
                  <div className="mb-2" style={{ color: '#254194' }}>
                    <i className={`bi ${step.icon} fs-4`} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#254194' }}>{step.title}</h5>
                  <p className="text-muted mb-0">{step.description}</p>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

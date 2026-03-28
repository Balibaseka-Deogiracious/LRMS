// React import not required in React 17+ with jsx runtime

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  variant?: 'primary' | 'warning' | 'success' | 'secondary'
}

const variantStyles: Record<NonNullable<Props['variant']>, { card: string; icon: string }> = {
  primary: {
    card: 'border-primary-subtle bg-primary-subtle',
    icon: 'text-primary',
  },
  warning: {
    card: 'border-warning-subtle bg-warning-subtle',
    icon: 'text-warning-emphasis',
  },
  success: {
    card: 'border-success-subtle bg-success-subtle',
    icon: 'text-success',
  },
  secondary: {
    card: 'border-secondary-subtle bg-secondary-subtle',
    icon: 'text-secondary',
  },
}

export default function MetricCard({ title, value, subtitle, icon, variant = 'secondary' }: Props) {
  const styles = variantStyles[variant]

  return (
    <div className={`card shadow-sm border-2 ${styles.card}`}>
      <div className="card-body d-flex align-items-center justify-content-between gap-3">
        <div>
          <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
          <h3 className="card-title mb-0">{value}</h3>
          {subtitle && <p className="card-text text-muted mt-2 mb-0">{subtitle}</p>}
        </div>

        {icon && (
          <div className={`fs-2 ${styles.icon}`} aria-hidden="true">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

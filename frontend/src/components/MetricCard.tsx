// React import not required in React 17+ with jsx runtime

interface Props {
  title: string
  value: string | number
  subtitle?: string
}

export default function MetricCard({ title, value, subtitle }: Props) {
  return (
    <div className="card text-center shadow-sm">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
        <h3 className="card-title">{value}</h3>
        {subtitle && <p className="card-text text-muted">{subtitle}</p>}
      </div>
    </div>
  )
}

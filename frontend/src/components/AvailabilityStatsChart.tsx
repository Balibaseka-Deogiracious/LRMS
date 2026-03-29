import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AvailabilityData {
  status: string
  count: number
}

interface AvailabilityStatsChartProps {
  data: AvailabilityData[]
  loading?: boolean
}

export default function AvailabilityStatsChart({ data, loading }: AvailabilityStatsChartProps) {
  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Book Availability Status</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

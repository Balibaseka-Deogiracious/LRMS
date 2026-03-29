import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BorrowingTrendData {
  date: string
  borrowed: number
  returned: number
}

interface BorrowingTrendsChartProps {
  data: BorrowingTrendData[]
  loading?: boolean
}

export default function BorrowingTrendsChart({ data, loading }: BorrowingTrendsChartProps) {
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
        <h5 className="card-title mb-3">Borrowing Trends (Last 7 Days)</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="borrowed" stroke="#0d6efd" strokeWidth={2} />
            <Line type="monotone" dataKey="returned" stroke="#198754" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

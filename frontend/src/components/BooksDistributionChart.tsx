import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface BooksDistributionData {
  name: string
  value: number
}

interface BooksDistributionChartProps {
  data: BooksDistributionData[]
  loading?: boolean
}

const COLORS = ['#0d6efd', '#6f42c1', '#198754', '#fd7e14', '#dc3545', '#20c997', '#0dcaf0', '#ffc107']

export default function BooksDistributionChart({ data, loading }: BooksDistributionChartProps) {
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
        <h5 className="card-title mb-3">Books by Category</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

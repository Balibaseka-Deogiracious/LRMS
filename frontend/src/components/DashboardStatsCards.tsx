import MetricCard from './MetricCard'
import { DashboardStats } from '../types'
import { FiBookOpen, FiDownload, FiCheckCircle } from 'react-icons/fi'

interface DashboardStatsCardsProps {
  stats: DashboardStats
}

export default function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-4">
        <MetricCard
          title="Total Books"
          value={stats.totalBooks.toLocaleString()}
          subtitle="All cataloged books"
          icon={<FiBookOpen />}
          variant="primary"
        />
      </div>
      <div className="col-12 col-md-4">
        <MetricCard
          title="Borrowed Books"
          value={stats.borrowedBooks.toLocaleString()}
          subtitle="Currently checked out"
          icon={<FiDownload />}
          variant="warning"
        />
      </div>
      <div className="col-12 col-md-4">
        <MetricCard
          title="Available Books"
          value={stats.availableBooks.toLocaleString()}
          subtitle="Ready for borrowing"
          icon={<FiCheckCircle />}
          variant="success"
        />
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import { Book, DashboardStats } from '../types'
import { searchBooks } from '../services/bookService'
import { getDashboardStats, getBorrowingTrends, getBookDistribution, getAvailabilityStats } from '../services/dashboardService'
import DashboardStatsCards from '../components/DashboardStatsCards'
import BorrowingTrendsChart from '../components/BorrowingTrendsChart'
import BooksDistributionChart from '../components/BooksDistributionChart'
import AvailabilityStatsChart from '../components/AvailabilityStatsChart'
import NotificationDemo from '../components/NotificationDemo'
import { toast } from 'react-toastify'
import { BookGridSkeleton, StatsCardsSkeleton } from '../components/LoadingSkeletons'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardStats>({
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingCharts, setLoadingCharts] = useState(true)
  const [books, setBooks] = useState<Book[]>([])
  const [borrowingTrends, setBorrowingTrends] = useState<any[]>([])
  const [booksDistribution, setBooksDistribution] = useState<any[]>([])
  const [availabilityStats, setAvailabilityStats] = useState<any[]>([])

  useEffect(() => {
    // Fetch dashboard stats and featured books in one effect on initial load.
    ;(async () => {
      try {
        const stats = await getDashboardStats()
        setMetrics(stats)
      } catch {
        toast.error('Unable to load dashboard stats. Showing defaults.')
        setMetrics({ totalBooks: 0, borrowedBooks: 0, availableBooks: 0 })
      } finally {
        setLoadingStats(false)
      }

      const results = await searchBooks('')
      if (results.length) setBooks(results.slice(0, 8))
      else {
        // mock fallback
        const mock: Book[] = [
          { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publishedYear: '1925' },
          { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedYear: '1960' },
          { id: '3', title: '1984', author: 'George Orwell', publishedYear: '1949' },
          { id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', publishedYear: '1813' },
        ]
        setBooks(mock)
      }
      setLoadingBooks(false)

      // Fetch chart data
      try {
        const [trends, distribution, availability] = await Promise.all([
          getBorrowingTrends(),
          getBookDistribution(),
          getAvailabilityStats(),
        ])
        setBorrowingTrends(trends)
        setBooksDistribution(distribution)
        setAvailabilityStats(availability)
      } catch {
        toast.error('Unable to load analytics charts.')
      } finally {
        setLoadingCharts(false)
      }
    })()
  }, [])

  return (
    <div>
      {loadingStats ? <StatsCardsSkeleton /> : <DashboardStatsCards stats={metrics} />}

      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="mb-0">Featured Books</h3>
            <small className="text-muted">Popular titles from the collection</small>
          </div>
        </div>

        {loadingBooks ? (
          <BookGridSkeleton />
        ) : (
          <div className="row g-3">
            {books.map(b => (
              <div key={b.id} className="col-12 col-sm-6 col-lg-3">
                <BookCard book={b} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-4">
        <h3 className="mb-3">Analytics</h3>
        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <BorrowingTrendsChart data={borrowingTrends} loading={loadingCharts} />
          </div>
          <div className="col-12 col-lg-6">
            <BooksDistributionChart data={booksDistribution} loading={loadingCharts} />
          </div>
          <div className="col-12">
            <AvailabilityStatsChart data={availabilityStats} loading={loadingCharts} />
          </div>
        </div>
      </section>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Welcome to LRMS</h5>
          <p className="card-text text-muted">Use the search to find books, or add new titles from the Add Book page.</p>
        </div>
      </div>

      <NotificationDemo />
    </div>
  )
}

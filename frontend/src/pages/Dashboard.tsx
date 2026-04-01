import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import { Book, DashboardStats } from '../types'
import { searchBooks } from '../services/bookService'
import { 
  getBookInventoryStats, 
  getBorrowingTrends, 
  getBooksDistribution, 
  getAvailabilityStats, 
  getTotalUsers 
} from '../services/dashboardService'
import BorrowingTrendsChart from '../components/BorrowingTrendsChart'
import BooksDistributionChart from '../components/BooksDistributionChart'
import AvailabilityStatsChart from '../components/AvailabilityStatsChart'
import { toast } from 'react-toastify'
import { BookGridSkeleton, StatsCardsSkeleton } from '../components/LoadingSkeletons'
import './dashboard.css'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardStats>({
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingCharts, setLoadingCharts] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [books, setBooks] = useState<Book[]>([])
  const [borrowingTrends, setBorrowingTrends] = useState<any[]>([])
  const [booksDistribution, setBooksDistribution] = useState<any[]>([])
  const [availabilityStats, setAvailabilityStats] = useState<any[]>([])
  const welcomeMessage = 'Welcome back. Here\'s what\'s happening today.'

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const quickStats = [
    {
      title: 'Total Books',
      value: metrics.totalBooks,
      meta: 'Catalog size',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      meta: 'Registered members',
    },
    {
      title: 'Borrowed Books',
      value: metrics.borrowedBooks,
      meta: 'Currently checked out',
    },
    {
      title: 'Available Books',
      value: metrics.availableBooks,
      meta: 'Ready to borrow',
    },
  ]

  useEffect(() => {
    // Fetch dashboard stats and featured books on initial load
    ;(async () => {
      try {
        const [inventory, trends, distribution, availability, users] = await Promise.all([
          getBookInventoryStats(),
          getBorrowingTrends(7),
          getBooksDistribution(),
          getAvailabilityStats(),
          getTotalUsers(),
        ])

        // Map inventory stats to metrics
        setMetrics({
          totalBooks: inventory.total_books,
          borrowedBooks: inventory.borrowed_copies,
          availableBooks: inventory.available_copies,
        })

        // Map users
        setTotalUsers(users.total_students + users.total_librarians)

        // Map borrowing trends data
        const trendsData = trends.trends.map((t: any) => ({
          date: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }),
          borrowed: t.borrow_count || 0,
          returned: t.return_count || 0,
        }))
        setBorrowingTrends(trendsData)

        // Map books distribution
        const distributionData = distribution.map((d: any) => ({
          name: d.category_name,
          value: d.total_books,
        }))
        setBooksDistribution(distributionData)

        // Map availability stats
        const availabilityData = [
          { status: 'Available', count: availability.available_books },
          { status: 'Borrowed', count: availability.borrowed_books },
          { status: 'Reserved', count: availability.reserved_books || 0 },
        ]
        setAvailabilityStats(availabilityData)
      } catch (error) {
        console.error('Failed to load dashboard:', error)
        toast.error('Unable to load dashboard stats. Please try again.')
      } finally {
        setLoadingStats(false)
        setLoadingCharts(false)
      }

      // Fetch featured books
      try {
        const results = await searchBooks('')
        if (Array.isArray(results) && results.length > 0) {
          setBooks(results.slice(0, 8))
        } else {
          toast.warning('No books found in the library.')
          setBooks([])
        }
      } catch (error) {
        console.error('Failed to load books:', error)
        toast.error('Failed to load featured books.')
        setBooks([])
      } finally {
        setLoadingBooks(false)
      }
    })()
  }, [])

  return (
    <div className="dashboard-modern">
      <section className="dashboard-hero mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <h2 className="dashboard-title mb-1">Dashboard</h2>
            <p className="dashboard-subtitle mb-0">{welcomeMessage}</p>
          </div>

          <div className="dashboard-toolbar d-flex flex-wrap align-items-center gap-2">
            <div className="dashboard-search">
              <i className="bi bi-search" />
              <input type="text" placeholder="Search..." aria-label="Search dashboard" />
            </div>
            <button className="btn btn-light btn-sm"><i className="bi bi-bell" /></button>
            <button className="btn btn-light btn-sm"><i className="bi bi-grid-3x3-gap" /></button>
            <button className="btn btn-light btn-sm"><i className="bi bi-gear" /></button>
          </div>
        </div>
        <p className="dashboard-date mt-3 mb-0">{todayLabel}</p>
      </section>

      {loadingStats ? (
        <StatsCardsSkeleton />
      ) : (
        <section className="row g-3 mb-4">
          {quickStats.map((item) => (
            <div key={item.title} className="col-12 col-sm-6 col-xl-3">
              <article className="dashboard-kpi card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="dashboard-kpi-title mb-2">{item.title}</p>
                  <h3 className="dashboard-kpi-value mb-1">{item.value.toLocaleString()}</h3>
                  <small className="dashboard-kpi-meta">{item.meta}</small>
                </div>
              </article>
            </div>
          ))}
        </section>
      )}

      <section className="row g-3 mb-4">
        <div className="col-12 col-xl-6">
          <BorrowingTrendsChart data={borrowingTrends} loading={loadingCharts} />
        </div>
        <div className="col-12 col-xl-6">
          <AvailabilityStatsChart data={availabilityStats} loading={loadingCharts} />
        </div>
      </section>

      <section className="row g-3 mb-4">
        <div className="col-12 col-xl-6">
          <BooksDistributionChart data={booksDistribution} loading={loadingCharts} />
        </div>
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-0">Featured Books</h5>
                  <small className="text-muted">Popular titles in the library</small>
                </div>
              </div>

              {loadingBooks ? (
                <BookGridSkeleton />
              ) : books.length === 0 ? (
                <div className="alert alert-info mb-0">
                  <p className="mb-0">No books available in the library yet.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {books.slice(0, 4).map((b) => (
                    <div key={b.id} className="col-12 col-sm-6">
                      <BookCard book={b} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="mb-1">System Overview</h5>
          <p className="text-muted mb-0">Track books, activity trends, and availability from one modern control center.</p>
        </div>
      </section>
    </div>
  )
}

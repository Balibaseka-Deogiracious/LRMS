import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface BorrowRequest {
  id: number
  student_id: number
  student?: {
    full_name: string
  }
  book?: {
    title: string
  }
  requested_at: string
  status: string
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardStats>({
    totalBooks: 0,
    borrowedBooks: 0,
    availableBooks: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingCharts, setLoadingCharts] = useState(true)
  const [loadingBorrowRequests, setLoadingBorrowRequests] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [books, setBooks] = useState<Book[]>([])
  const [borrowingTrends, setBorrowingTrends] = useState<any[]>([])
  const [booksDistribution, setBooksDistribution] = useState<any[]>([])
  const [availabilityStats, setAvailabilityStats] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<BorrowRequest[]>([])
  const [pendingCount, setPendingCount] = useState(0)
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
    {
      title: 'Pending Requests',
      value: pendingCount,
      meta: 'Awaiting approval',
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

      // Fetch pending borrow requests
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `${API_BASE_URL}/admin/borrow-requests?status_filter=pending`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setPendingRequests(data.slice(0, 5) || [])
          setPendingCount(data.length || 0)
        }
      } catch (error) {
        console.error('Failed to load borrow requests:', error)
      } finally {
        setLoadingBorrowRequests(false)
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
                  <h5 className="mb-0">
                    <i className="bi bi-hand-index me-2"></i>
                    Pending Borrow Requests
                  </h5>
                  <small className="text-muted">{pendingCount} request(s) waiting for approval</small>
                </div>
                <Link to="/admin/borrow-requests" className="btn btn-sm btn-primary">
                  View All
                </Link>
              </div>

              {loadingBorrowRequests ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="alert alert-info mb-0">
                  <p className="mb-0">No pending borrow requests at the moment.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="list-group-item px-0 py-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <strong className="d-block">{request.student?.full_name || 'Unknown'}</strong>
                          <small className="text-muted">{request.book?.title || 'Unknown Book'}</small>
                        </div>
                        <span className="badge bg-warning text-dark ms-2">Pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="row g-3 mb-4">
        <div className="col-12 col-xl-12">
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
                    <div key={b.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
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

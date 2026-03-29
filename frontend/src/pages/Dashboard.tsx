import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import { Book, DashboardStats } from '../types'
import { searchBooks } from '../services/bookService'
import { loadAdminDashboard } from '../services/adminDashboardService'
import { listUsers } from '../services/userService'
import BorrowingTrendsChart from '../components/BorrowingTrendsChart'
import BooksDistributionChart from '../components/BooksDistributionChart'
import AvailabilityStatsChart from '../components/AvailabilityStatsChart'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
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
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome back. Here\'s what\'s happening today.')

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
    // Fetch dashboard stats and featured books in one effect on initial load.
    ;(async () => {
      try {
        const [dashboard, users] = await Promise.all([loadAdminDashboard(), listUsers()])
        setMetrics(dashboard.stats)
        setTotalUsers(users.length)
        setBorrowingTrends(dashboard.trends)
        setBooksDistribution(dashboard.distribution)
        setAvailabilityStats(dashboard.availability)
        setWelcomeMessage(dashboard.welcomeMessage)
      } catch {
        toast.error('Unable to load dashboard stats. Showing defaults.')
        setMetrics({ totalBooks: 0, borrowedBooks: 0, availableBooks: 0 })
        setTotalUsers(0)
      } finally {
        setLoadingStats(false)
        setLoadingCharts(false)
      }

      const results = await searchBooks('')
      if (Array.isArray(results) && results.length) setBooks(results.slice(0, 8))
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
    })()
  }, [])

  const handleQuickAlert = async () => {
    await Swal.fire({
      icon: 'info',
      title: 'Librarian Insight',
      text: 'Use this dashboard to monitor activity, then open Users to control access and roles.',
      confirmButtonText: 'Got it',
    })
  }

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
            <button className="btn btn-primary btn-sm" onClick={handleQuickAlert}>Quick Tip</button>
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

import { useState, useEffect } from 'react'
import MetricCard from '../components/MetricCard'
import BookCard from '../components/BookCard'
import { Book, Stats } from '../types'
import { searchBooks } from '../services/bookService'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Stats>({
    totalBooks: 0,
    activeLoans: 0,
    overdueItems: 0,
    activeReaders: 0,
  })
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    // Try fetching from API; fallback to mock data if empty
    ;(async () => {
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

      // placeholder metrics
      setMetrics({ totalBooks: 2847, activeLoans: 342, overdueItems: 23, activeReaders: 1204 })
    })()
  }, [])

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><MetricCard title="Total Books" value={metrics.totalBooks.toLocaleString()} /></div>
        <div className="col-6 col-md-3"><MetricCard title="Active Loans" value={metrics.activeLoans} /></div>
        <div className="col-6 col-md-3"><MetricCard title="Overdue" value={metrics.overdueItems} /></div>
        <div className="col-6 col-md-3"><MetricCard title="Active Readers" value={metrics.activeReaders} /></div>
      </div>

      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="mb-0">Featured Books</h3>
            <small className="text-muted">Popular titles from the collection</small>
          </div>
        </div>

        <div className="row g-3">
          {books.map(b => (
            <div key={b.id} className="col-12 col-sm-6 col-lg-3">
              <BookCard book={b} />
            </div>
          ))}
        </div>
      </section>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Welcome to LRMS</h5>
          <p className="card-text text-muted">Use the search to find books, or add new titles from the Add Book page.</p>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Book } from '../types'
import useDebounce from '../hooks/useDebounce'
import { TableSkeleton } from './LoadingSkeletons'
import { useBorrow } from '../contexts/BorrowContext'
import { searchBooks } from '../services/bookService'

export default function BookSearchTable() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [availability, setAvailability] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 5
  const { isBorrowed } = useBorrow()

  const categoryOptions = useMemo(() => [
    '',
    'Fiction',
    'Science',
    'History',
    'Biography',
    'Technology',
  ], [])

  const debouncedFilters = useDebounce({ title, author, category, availability }, 450)

  const fetchBooks = async () => {
    setLoading(true)

    try {
      const data: Book[] = await searchBooks('')

      // Fallback client-side filtering/pagination if backend returns simple array.
      const filtered = data.filter((book) => {
        const byTitle = !debouncedFilters.title || book.title.toLowerCase().includes(debouncedFilters.title.toLowerCase())
        const byAuthor = !debouncedFilters.author || book.author.toLowerCase().includes(debouncedFilters.author.toLowerCase())
        const byCategory = !debouncedFilters.category || (book.category || '').toLowerCase() === debouncedFilters.category.toLowerCase()
        const effectiveStatus = isBorrowed(book.id)
          ? 'borrowed'
          : ((book.status || 'available').toLowerCase())
        const byAvailability = !debouncedFilters.availability || effectiveStatus === debouncedFilters.availability.toLowerCase()
        return byTitle && byAuthor && byCategory && byAvailability
      })

      const nextTotalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
      const start = (page - 1) * pageSize

      setTotalPages(nextTotalPages)
      setBooks(filtered.slice(start, start + pageSize))
    } catch (error: any) {
      const message = error?.message || 'Failed to fetch books. Please try again.'
      toast.error(message)
      setBooks([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!hasSearched) return
    void fetchBooks()
  }, [debouncedFilters, page, hasSearched])

  const onFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value)
    setPage(1)
    setHasSearched(true)
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Search Books</h5>

        <form className="row g-3 mb-3" onSubmit={(e) => e.preventDefault()}>
          <div className="col-12 col-md-4">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              id="title"
              className="form-control"
              placeholder="Search by title"
              value={title}
              onChange={(e) => onFilterChange(setTitle, e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="author" className="form-label">Author</label>
            <input
              id="author"
              className="form-control"
              placeholder="Search by author"
              value={author}
              onChange={(e) => onFilterChange(setAuthor, e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => onFilterChange(setCategory, e.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'All Categories'}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label htmlFor="availability" className="form-label">Availability</label>
            <select
              id="availability"
              className="form-select"
              value={availability}
              onChange={(e) => onFilterChange(setAvailability, e.target.value)}
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>

          <div className="col-12 col-md-2 d-grid">
            <label className="form-label d-none d-md-block">&nbsp;</label>
            <button className="btn btn-outline-secondary" type="button" onClick={() => { setTitle(''); setAuthor(''); setCategory(''); setAvailability(''); setPage(1) }}>
              Clear
            </button>
          </div>
        </form>

        {loading && <TableSkeleton rows={5} />}

        {!loading && hasSearched && books.length === 0 && (
          <div className="alert alert-info mb-0">No results found.</div>
        )}

        {!loading && books.length > 0 && (
          <div>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category || '-'}</td>
                      <td>{book.publishedYear || '-'}</td>
                      <td>{isBorrowed(book.id) ? 'Borrowed' : (book.status || 'Available')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">Page {page} of {totalPages}</small>
              <div className="btn-group">
                <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </button>
                <button className="btn btn-outline-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

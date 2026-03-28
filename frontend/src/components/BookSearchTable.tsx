import { useMemo, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import { Book } from '../types'

export default function BookSearchTable() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const categoryOptions = useMemo(() => [
    '',
    'Fiction',
    'Science',
    'History',
    'Biography',
    'Technology',
  ], [])

  const fetchBooks = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setHasSearched(true)

    try {
      // Send all filter values; backend can ignore empty params.
      const response = await api.get('/books', {
        params: {
          title: title.trim() || undefined,
          author: author.trim() || undefined,
          category: category || undefined,
        },
      })

      const payload = response.data
      const data: Book[] = Array.isArray(payload) ? payload : payload?.data || []
      setBooks(data)
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to fetch books. Please try again.'
      toast.error(message)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Search Books</h5>

        <form onSubmit={fetchBooks} className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              id="title"
              className="form-control"
              placeholder="Search by title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="author" className="form-label">Author</label>
            <input
              id="author"
              className="form-control"
              placeholder="Search by author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'All Categories'}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-1 d-grid">
            <label className="form-label d-none d-md-block">&nbsp;</label>
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </form>

        {loading && (
          <div className="d-flex justify-content-center align-items-center py-4">
            <div className="spinner-border text-primary" role="status" aria-label="Loading books">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && hasSearched && books.length === 0 && (
          <div className="alert alert-info mb-0">No results found.</div>
        )}

        {!loading && books.length > 0 && (
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
                    <td>{book.status || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

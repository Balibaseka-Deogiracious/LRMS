import { useState, useEffect } from 'react'
import { Book } from '../types'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import AddBookForm from '../components/AddBookForm'
import { deleteBook, searchBooks } from '../services/bookService'

export default function InventoryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  // Load all books from backend on mount
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true)
      try {
        const allBooks = await searchBooks('')
        setBooks(Array.isArray(allBooks) ? allBooks : [])
      } catch (error) {
        toast.error('Failed to load books')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    void loadBooks()
  }, [])

  const handleDelete = async (b: Book) => {
    const res = await Swal.fire({
      title: 'Delete Book',
      text: `Delete "${b.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    })

    if (!res.isConfirmed) return

    const deleted = await deleteBook(String(b.id))
    if (deleted) {
      // Update list in memory to keep UI in sync without page refresh.
      setBooks(prev => prev.filter(x => x.id !== b.id))
      toast.success('Book deleted successfully.')
    } else {
      toast.error('Failed to delete book. Please try again.')
    }
  }

  const handleBookAdded = (book: Book) => {
    setBooks(prev => [book, ...prev])
  }

  return (
    <div className="saas-page">
      <div className="saas-page-header">
        <div>
          <h3 className="mb-0">Book Inventory</h3>
          <small className="text-muted">Manage books in the library</small>
        </div>
      </div>

      <AddBookForm onBookAdded={handleBookAdded} />

      {loading ? (
        <div className="card">
          <div className="card-body text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : books.length === 0 ? (
        <div className="alert alert-info">No books in inventory yet. Create one above!</div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Copies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.id}>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.isbn || '—'}</td>
                    <td>{b.available_copies} / {b.total_copies}</td>
                    <td>
                      <span className={`badge ${b.is_available ? 'bg-success' : 'bg-danger'}`}>
                        {b.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary">Edit</button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(b)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

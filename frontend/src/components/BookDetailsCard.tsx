import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { Book } from '../types'
import { borrowBook, getBook } from '../services/bookService'

interface BookDetailsCardProps {
  bookId: string
}

export default function BookDetailsCard({ bookId }: BookDetailsCardProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true)
      const data = await getBook(bookId)
      if (data) setBook(data)
      else toast.error('Book not found.')
      setLoading(false)
    }

    void loadBook()
  }, [bookId])

  const handleBorrow = async () => {
    if (!book) return

    const confirmation = await Swal.fire({
      title: 'Borrow this book?',
      text: `Do you want to borrow "${book.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Borrow',
      cancelButtonText: 'Cancel',
    })

    if (!confirmation.isConfirmed) return

    setBorrowing(true)
    const success = await borrowBook(book.id)
    if (success) {
      toast.success('Book borrowed successfully.')
      setBook(prev => (prev ? { ...prev, status: 'Borrowed' } : prev))
    } else {
      toast.error('Unable to borrow this book right now.')
    }
    setBorrowing(false)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!book) {
    return <div className="alert alert-warning mb-0">No book details available.</div>
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-1">{book.title}</h3>
        <h6 className="text-muted mb-4">{book.author}</h6>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="border rounded p-3 h-100">
              <p className="mb-2"><strong>ISBN:</strong> {book.isbn || '-'}</p>
              <p className="mb-2"><strong>Category:</strong> {book.category || '-'}</p>
              <p className="mb-0"><strong>Availability:</strong> {book.status || 'Available'}</p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="border rounded p-3 h-100">
              <p className="mb-2"><strong>Published Year:</strong> {book.publishedYear || '-'}</p>
              <p className="mb-0"><strong>Description:</strong> {book.description || 'No description available.'}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="btn btn-success"
            onClick={handleBorrow}
            disabled={borrowing}
          >
            {borrowing ? 'Borrowing...' : 'Borrow Book'}
          </button>
        </div>
      </div>
    </div>
  )
}

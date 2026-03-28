import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { Book } from '../types'
import { borrowBook, getBook } from '../services/bookService'
import { useBorrow } from '../contexts/BorrowContext'

interface BookDetailsCardProps {
  bookId: string
}

export default function BookDetailsCard({ bookId }: BookDetailsCardProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const { borrowBook: borrowLocal, returnBook, isBorrowed, getRecord } = useBorrow()

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

    if ((book.status || '').toLowerCase() === 'borrowed' && !isBorrowed(book.id)) {
      toast.warning('Book not available.')
      return
    }

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
    // Try API call first, but keep local borrow flow responsive for demo environments.
    await borrowBook(book.id)

    const result = borrowLocal(book)
    if (result.ok) {
      toast.success(result.message)
      setBook(prev => (prev ? { ...prev, status: 'Borrowed' } : prev))
    } else {
      toast.warning(result.message)
    }
    setBorrowing(false)
  }

  const handleReturn = async () => {
    if (!book) return

    const confirmation = await Swal.fire({
      title: 'Return this book?',
      text: `Do you want to return "${book.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Return',
      cancelButtonText: 'Cancel',
    })

    if (!confirmation.isConfirmed) return

    const ok = returnBook(book.id)
    if (ok) {
      toast.success('Book returned successfully.')
      setBook(prev => (prev ? { ...prev, status: 'Available' } : prev))
    } else {
      toast.error('Unable to return this book.')
    }
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

  const borrowedByMe = isBorrowed(book.id)
  const dueDate = getRecord(book.id)?.dueDate

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
              <p className="mb-0"><strong>Availability:</strong> {borrowedByMe ? 'Borrowed by you' : (book.status || 'Available')}</p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="border rounded p-3 h-100">
              <p className="mb-2"><strong>Published Year:</strong> {book.publishedYear || '-'}</p>
              <p className="mb-0"><strong>Description:</strong> {book.description || 'No description available.'}</p>
              {dueDate && <p className="mb-0 mt-2"><strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>

        <div className="mt-4">
          {!borrowedByMe ? (
            <button
              className="btn btn-success"
              onClick={handleBorrow}
              disabled={borrowing}
            >
              {borrowing ? 'Borrowing...' : 'Borrow Book'}
            </button>
          ) : (
            <button className="btn btn-outline-primary" onClick={handleReturn}>Return Book</button>
          )}
        </div>
      </div>
    </div>
  )
}

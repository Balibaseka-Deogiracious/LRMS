import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { Book } from '../types'
import { borrowBook, getBook, downloadBookFile, getMyBorrowedBooks, returnBook } from '../services/bookService'

interface BookDetailsCardProps {
  bookId: string
}

export default function BookDetailsCard({ bookId }: BookDetailsCardProps) {
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [returning, setReturning] = useState(false)
  const [borrowRecordId, setBorrowRecordId] = useState<number | null>(null)

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

  // Load borrowed books on mount to check if this book is already borrowed
  useEffect(() => {
    const loadBorrowedBooks = async () => {
      try {
        const borrowed = await getMyBorrowedBooks()
        
        // Check if current book is in borrowed books
        const isBorrowed = borrowed.find(record => String(record.book_id) === bookId)
        if (isBorrowed) {
          setBorrowRecordId(isBorrowed.id)
        } else {
          setBorrowRecordId(null)
        }
      } catch (error) {
        console.error('Failed to load borrowed books:', error)
      }
    }

    void loadBorrowedBooks()
  }, [bookId])

  const handleBorrow = async () => {
    if (!book) return

    if (!book.is_available) {
      toast.warning('Book is not available for borrowing.')
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
    try {
      await borrowBook(String(book.id))
      toast.success(`📚 Book "${book.title}" borrowed successfully!`)
      // Refresh book details
      const updated = await getBook(bookId)
      if (updated) setBook(updated)
      // Reload borrowed books
      const borrowed = await getMyBorrowedBooks()
      const isBorrowed = borrowed.find(record => String(record.book_id) === bookId)
      if (isBorrowed) {
        setBorrowRecordId(isBorrowed.id)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to borrow book.')
    } finally {
      setBorrowing(false)
    }
  }

  const handleReturn = async () => {
    if (!borrowRecordId) return

    const confirmation = await Swal.fire({
      title: 'Return this book?',
      text: `Are you sure you want to return "${book?.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Return',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ffc107',
    })

    if (!confirmation.isConfirmed) return

    setReturning(true)
    try {
      await returnBook(borrowRecordId)
      toast.success(`📚 Book "${book?.title}" returned successfully! Thank you!`)
      // Refresh book details
      const updated = await getBook(bookId)
      if (updated) setBook(updated)
      // Reset borrow record
      setBorrowRecordId(null)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to return book.')
    } finally {
      setReturning(false)
    }
  }

  const handleDownload = async () => {
    if (!book) return

    setDownloading(true)
    try {
      await downloadBookFile(Number(book.id))
      toast.success(`📥 Downloading "${book.title}"...`)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to download book file.')
    } finally {
      setDownloading(false)
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

  return (
    <div className="card shadow-sm">
      {/* Back Button Header */}
      <div className="card-header bg-light border-bottom py-3 px-4" style={{ backgroundColor: '#f8f9fa' }}>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate(-1)}
          title="Go back to student dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
        >
          <i className="bi bi-arrow-left"></i>
          Back to Books
        </button>
      </div>
      
      <div className="card-body">
        <div className="row g-4">
          {/* Book Cover */}
          <div className="col-12 col-md-4">
            {book.cover_filename ? (
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/books/${book.id}/cover`}
                alt={`${book.title} cover`}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: '350px', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="bg-light rounded d-flex align-items-center justify-content-center shadow-sm"
                style={{ height: '350px' }}
              >
                <div className="text-center text-muted">
                  <i className="bi bi-book" style={{ fontSize: '3rem' }}></i>
                  <p className="mt-2 mb-0">No cover available</p>
                </div>
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="col-12 col-md-8">
            <h3 className="card-title mb-1">{book.title}</h3>
            <h6 className="text-muted mb-4">{book.author}</h6>

            <div className="row g-3">
              <div className="col-12">
                <div className="border rounded p-3">
                  <p className="mb-2"><strong>ISBN:</strong> {book.isbn || '-'}</p>
                  <p className="mb-2"><strong>Category:</strong> {book.category_name || '-'}</p>
                  <p className="mb-0"><strong>Available Copies:</strong> {book.available_copies} / {book.total_copies}</p>
                </div>
              </div>

              <div className="col-12">
                <div className="border rounded p-3">
                  <p className="mb-2"><strong>Published Year:</strong> {book.publication_year || '-'}</p>
                  <p className="mb-0"><strong>Description:</strong> {book.description || 'No description available.'}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              {borrowRecordId ? (
                <button
                  className="btn btn-warning"
                  onClick={handleReturn}
                  disabled={returning}
                  title="Return this borrowed book"
                >
                  {returning ? (
                    <>
                      <i className="bi bi-hourglass-split me-1"></i>
                      Returning...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-counterclockwise me-1"></i>
                      Return Book
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={handleBorrow}
                  disabled={borrowing || !book.is_available}
                >
                  {borrowing ? 'Borrowing...' : (book.is_available ? 'Borrow Book' : 'Not Available')}
                </button>
              )}
              <button
                className="btn btn-info ms-2"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <i className="bi bi-download me-1"></i>
                    Downloading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-download me-1"></i>
                    Download File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

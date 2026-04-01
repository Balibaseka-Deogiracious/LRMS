import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { addBook, getCategories } from '../services/bookService'
import { Book } from '../types'

interface AddBookFormProps {
  onBookAdded?: (book: Book) => void
  onClose?: () => void
  isModal?: boolean
}

interface FormState {
  title: string
  author: string
  isbn: string
  description: string
  publication_year: string
  total_copies: string
}

const initialForm: FormState = {
  title: '',
  author: '',
  isbn: '',
  description: '',
  publication_year: '',
  total_copies: '1',
}

export default function AddBookForm({ onBookAdded, onClose, isModal = false }: AddBookFormProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [validated, setValidated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Load categories (for future use)
    getCategories().catch(() => {})
  }, [])

  const updateField = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formElement = event.currentTarget
    if (!formElement.checkValidity()) {
      setValidated(true)
      toast.error('Please fill in all required fields correctly.')
      return
    }

    setValidated(true)
    setSubmitting(true)

    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        isbn: form.isbn.trim(),
        description: form.description.trim() || undefined,
        publication_year: form.publication_year ? parseInt(form.publication_year) : undefined,
        total_copies: parseInt(form.total_copies) || 1,
      }

      const created = await addBook(payload)

      toast.success(`✅ Book "${created.title}" added successfully!`)

      // Clear form
      setForm(initialForm)
      setValidated(false)

      // Callback
      if (onBookAdded) {
        const normalizedBook: Book = {
          id: created.id,
          title: created.title,
          author: created.author,
          isbn: created.isbn,
          description: created.description,
          publication_year: created.publication_year,
          total_copies: created.total_copies,
          available_copies: created.available_copies,
          is_available: created.is_available,
        }
        onBookAdded(normalizedBook)
      }

      // Close modal if provided
      if (isModal && onClose) {
        setTimeout(() => onClose(), 800)
      }
    } catch (error: any) {
      const message = error?.message || 'Failed to add book. Please try again.'
      toast.error(message)
      await Swal.fire({
        icon: 'error',
        title: 'Add Book Failed',
        text: message,
        confirmButtonText: 'OK',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formContent = (
    <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="title" className="form-label">Book Title <span className="text-danger">*</span></label>
          <input
            id="title"
            className="form-control"
            placeholder="Enter book title"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
          <div className="invalid-feedback">Title is required.</div>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="author" className="form-label">Author <span className="text-danger">*</span></label>
          <input
            id="author"
            className="form-control"
            placeholder="Enter author name"
            value={form.author}
            onChange={(e) => updateField('author', e.target.value)}
            required
          />
          <div className="invalid-feedback">Author is required.</div>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="isbn" className="form-label">ISBN <span className="text-danger">*</span></label>
          <input
            id="isbn"
            className="form-control"
            placeholder="10 or 13 digits"
            value={form.isbn}
            onChange={(e) => updateField('isbn', e.target.value)}
            // pattern="^(\d{10}|\d{13})$"
            title="Enter a valid ISBN with 10 or 13 digits"
            required
          />
          <div className="invalid-feedback">Enter a valid ISBN with 10 or 13 digits.</div>
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="publication_year" className="form-label">Publication Year</label>
          <input
            id="publication_year"
            type="number"
            className="form-control"
            placeholder="2024"
            value={form.publication_year}
            onChange={(e) => updateField('publication_year', e.target.value)}
            min="1000"
            max={new Date().getFullYear() + 1}
          />
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="total_copies" className="form-label">Total Copies <span className="text-danger">*</span></label>
          <input
            id="total_copies"
            type="number"
            className="form-control"
            placeholder="1"
            value={form.total_copies}
            onChange={(e) => updateField('total_copies', e.target.value)}
            min="1"
            required
          />
          <div className="invalid-feedback">Please enter at least 1 copy.</div>
        </div>

        <div className="col-12">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-control"
            placeholder="Enter book description (optional)"
            rows={3}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>
      </div>

      <div className="mt-4 d-grid gap-2 d-sm-flex justify-content-sm-end">
        {isModal && onClose && (
          <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        )}
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          <i className={`bi ${submitting ? 'bi-hourglass-split' : 'bi-plus-circle'} me-2`} />
          {submitting ? 'Adding...' : 'Add Book'}
        </button>
      </div>
    </form>
  )

  if (isModal) {
    return (
      <div>
        <div className="modal-header border-bottom d-flex justify-content-between align-items-center">
          <div>
            <h5 className="modal-title mb-0">Add New Book to Catalog</h5>
            <p className="text-muted small mb-0 mt-1">Fill in the details below to add a new book to the library system.</p>
          </div>
          {onClose && (
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
              title="Close"
            />
          )}
        </div>
        <div className="modal-body p-4">
          {formContent}
        </div>
      </div>
    )
  }

  // Card layout for non-modal use
  return (
    <div className="card mb-3 shadow-sm border-0">
      <div className="card-body p-4">
        <div className="mb-4">
          <h5 className="card-title mb-1">Add New Book</h5>
          <p className="text-muted small mb-0">Enter the book details in the form below.</p>
        </div>
        {formContent}
      </div>
    </div>
  )
}

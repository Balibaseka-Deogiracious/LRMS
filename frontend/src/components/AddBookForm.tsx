import { useState } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { addBook } from '../services/bookService'
import { Book } from '../types'

interface AddBookFormProps {
  onBookAdded?: (book: Book) => void
}

interface FormState {
  title: string
  author: string
  isbn: string
  category: string
}

const initialForm: FormState = {
  title: '',
  author: '',
  isbn: '',
  category: '',
}

const categoryOptions = [
  'Fiction',
  'Science',
  'History',
  'Biography',
  'Technology',
  'Children',
  'Reference',
]

export default function AddBookForm({ onBookAdded }: AddBookFormProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [validated, setValidated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
        category: form.category,
      }

      const created = await addBook(payload)

      const normalizedBook: Book = {
        id: String(created?.id || Date.now()),
        title: created?.title || payload.title,
        author: created?.author || payload.author,
        isbn: created?.isbn || payload.isbn,
        category: created?.category || payload.category,
        status: created?.status || 'available',
      }

      onBookAdded?.(normalizedBook)
      toast.success('Book added successfully.')

      // Clear fields after a successful submission.
      setForm(initialForm)
      setValidated(false)
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to add book. Please try again.'
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

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Add New Book</h5>

        <form noValidate className={validated ? 'was-validated' : ''} onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                id="title"
                className="form-control"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
              />
              <div className="invalid-feedback">Title is required.</div>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="author" className="form-label">Author</label>
              <input
                id="author"
                className="form-control"
                value={form.author}
                onChange={(e) => updateField('author', e.target.value)}
                required
              />
              <div className="invalid-feedback">Author is required.</div>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="isbn" className="form-label">ISBN</label>
              <input
                id="isbn"
                className="form-control"
                placeholder="10 or 13 digits"
                value={form.isbn}
                onChange={(e) => updateField('isbn', e.target.value)}
                pattern="^(\\d{10}|\\d{13})$"
                title="Enter a valid ISBN with 10 or 13 digits"
                required
              />
              <div className="invalid-feedback">Enter a valid ISBN with 10 or 13 digits.</div>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                className="form-select"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="invalid-feedback">Category is required.</div>
            </div>
          </div>

          <div className="mt-3 d-grid d-md-flex justify-content-md-end">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Book } from '../types'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import AddBookForm from '../components/AddBookForm'
import { deleteBook } from '../services/bookService'

export default function InventoryPage() {
  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', status: 'available' },
    { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', status: 'borrowed' },
  ])

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

    const deleted = await deleteBook(b.id)
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Book Inventory</h3>
          <small className="text-muted">Manage books in the library</small>
        </div>
      </div>

      <AddBookForm onBookAdded={handleBookAdded} />

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.isbn || '—'}</td>
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
    </div>
  )
}

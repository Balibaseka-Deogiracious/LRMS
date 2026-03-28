import React, { useState } from 'react'
import { Book } from '../types'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export default function InventoryPage() {
  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', status: 'available' },
    { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', status: 'borrowed' },
  ])

  const handleDelete = async (b: Book) => {
    const res = await Swal.fire({ title: 'Delete Book', text: `Delete ${b.title}?`, icon: 'warning', showCancelButton: true })
    if (res.isConfirmed) {
      setBooks(prev => prev.filter(x => x.id !== b.id))
      toast.success('Book deleted')
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const title = data.get('title') as string
    const author = data.get('author') as string
    if (!title || !author) { toast.error('Title and author required'); return }
    const newBook: Book = { id: Date.now().toString(), title, author }
    setBooks(prev => [newBook, ...prev])
    form.reset()
    toast.success('Book added')
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">Book Inventory</h3>
          <small className="text-muted">Manage books in the library</small>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={handleAdd} className="row g-2 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Title</label>
              <input name="title" className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Author</label>
              <input name="author" className="form-control" />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" type="submit">Add Book</button>
            </div>
          </form>
        </div>
      </div>

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
                  <td>{(b as any).isbn || '—'}</td>
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

import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useBorrow } from '../contexts/BorrowContext'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString()
}

export default function MyBorrowedBooks() {
  const { borrowedBooks, returnBook } = useBorrow()

  const handleReturn = async (bookId: string, title: string) => {
    const result = await Swal.fire({
      title: 'Return Book',
      text: `Return "${title}" now?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Return',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    const ok = returnBook(bookId)
    if (ok) toast.success('Book returned successfully.')
    else toast.error('Unable to return this book.')
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-0">My Borrowed Books</h3>
          <small className="text-muted">Track due dates and return books quickly.</small>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Borrowed On</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">No borrowed books yet.</td>
                </tr>
              )}

              {borrowedBooks.map((record) => {
                const overdue = new Date(record.dueDate).getTime() < Date.now()
                return (
                  <tr key={record.bookId}>
                    <td>{record.title}</td>
                    <td>{record.author}</td>
                    <td>{formatDate(record.borrowedAt)}</td>
                    <td>{formatDate(record.dueDate)}</td>
                    <td>
                      <span className={`badge ${overdue ? 'text-bg-danger' : 'text-bg-success'}`}>
                        {overdue ? 'Overdue' : 'Borrowed'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleReturn(record.bookId, record.title)}>
                        Return
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

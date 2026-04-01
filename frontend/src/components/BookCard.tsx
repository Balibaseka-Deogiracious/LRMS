// React import not required in React 17+ with jsx runtime
import { Link } from 'react-router-dom'
import { Book } from '../types'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{book.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
        <p className="card-text text-truncate">{book.description || 'No description available'}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">{book.publication_year || 'N/A'}</small>
          <div>
            <span className={`badge me-2 ${book.is_available ? 'bg-success' : 'bg-warning'}`}>
              {book.is_available ? 'Available' : 'Borrowed'}
            </span>
            <Link className="btn btn-sm btn-primary" to={`/books/${book.id}`}>View</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

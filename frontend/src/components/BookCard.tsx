// React import not required in React 17+ with jsx runtime
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Book } from '../types'
import { downloadBookFile } from '../services/bookService'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const [downloading, setDownloading] = useState(false)
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/books/${book.id}`)
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setDownloading(true)
    try {
      await downloadBookFile(book.id)
      toast.success(`📥 Downloading "${book.title}"...`)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to download book file.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div 
      className="card h-100 shadow-sm"
      onClick={handleCardClick}
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{book.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
        <p className="card-text text-truncate">{book.description || 'No description available'}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <small className="text-muted">{book.publication_year || 'N/A'}</small>
          <div onClick={(e) => e.stopPropagation()}>
            <span className={`badge me-2 ${book.is_available ? 'bg-success' : 'bg-warning'}`}>
              {book.is_available ? 'Available' : 'Borrowed'}
            </span>
            <button
              className="btn btn-sm btn-info me-2"
              onClick={handleDownload}
              disabled={downloading}
              title="Download book file"
            >
              {downloading ? (
                <>
                  <i className="bi bi-download"></i>
                </>
              ) : (
                <>
                  <i className="bi bi-download"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

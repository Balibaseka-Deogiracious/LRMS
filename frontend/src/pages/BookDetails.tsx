import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBook } from '../services/bookService'
import { Book } from '../types'
import { toast } from 'react-toastify'

export default function BookDetails() {
  const { id } = useParams()
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!id) return
      const b = await getBook(id)
      if (b) setBook(b)
      else toast.error('Book not found')
    })()
  }, [id])

  if (!book) return <div>Loading...</div>

  return (
    <div className="card">
      <div className="card-body">
        <h3>{book.title}</h3>
        <h6 className="text-muted">{book.author}</h6>
        <p className="mt-3">{book.description || 'No description available.'}</p>
        <div className="mt-4">
          <button className="btn btn-success me-2">Borrow</button>
          <button className="btn btn-outline-secondary">Reserve</button>
        </div>
      </div>
    </div>
  )
}

import { useParams } from 'react-router-dom'
import BookDetailsCard from '../components/BookDetailsCard'

export default function BookDetails() {
  const { id } = useParams()
  if (!id) return <div className="alert alert-warning mb-0">Invalid book ID.</div>

  return (
    <BookDetailsCard bookId={id} />
  )
}

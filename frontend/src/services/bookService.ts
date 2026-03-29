import { Book } from '../types'
import { getBooks, saveBooks, makeId } from './mockStore'

function normalize(text?: string) {
  return (text || '').trim().toLowerCase()
}

export async function searchBooks(query = ''): Promise<Book[]> {
  const all = getBooks()
  const q = normalize(query)
  if (!q) return all

  return all.filter((book) => {
    const haystack = [book.title, book.author, book.category, book.description, book.isbn]
      .map((item) => normalize(item))
      .join(' ')
    return haystack.includes(q)
  })
}

export async function getBook(id: string): Promise<Book | null> {
  const all = getBooks()
  return all.find((book) => book.id === id) || null
}

export async function addBook(payload: Partial<Book>) {
  const all = getBooks()

  const next: Book = {
    id: makeId('b'),
    title: payload.title || 'Untitled',
    author: payload.author || 'Unknown',
    isbn: payload.isbn,
    category: payload.category,
    description: payload.description,
    publishedYear: payload.publishedYear,
    status: payload.status || 'available',
  }

  saveBooks([next, ...all])
  return next
}

export async function borrowBook(id: string): Promise<boolean> {
  const all = getBooks()
  const index = all.findIndex((book) => book.id === id)
  if (index < 0) return false

  const current = (all[index].status || 'available').toLowerCase()
  if (current === 'borrowed') return false

  all[index] = { ...all[index], status: 'borrowed' }
  saveBooks(all)
  return true
}

export async function deleteBook(id: string): Promise<boolean> {
  const all = getBooks()
  const next = all.filter((book) => book.id !== id)
  if (next.length === all.length) return false
  saveBooks(next)
  return true
}

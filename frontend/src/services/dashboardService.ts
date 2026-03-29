import { DashboardStats } from '../types'
import { getBooks } from './mockStore'

interface BorrowRecord {
  bookId: string
  borrowedAt: string
}

function getBorrowedRecords(): BorrowRecord[] {
  const raw = localStorage.getItem('borrowedBooks')
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const books = getBooks()
  const borrowedRecords = getBorrowedRecords()

  const borrowedByStatus = books.filter((book) => (book.status || '').toLowerCase() === 'borrowed').length
  const borrowedBooks = Math.max(borrowedByStatus, borrowedRecords.length)
  const availableBooks = Math.max(0, books.length - borrowedBooks)

  return {
    totalBooks: books.length,
    borrowedBooks,
    availableBooks,
  }
}

export async function getBorrowingTrends() {
  const borrowedRecords = getBorrowedRecords()
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const now = new Date()

  const data = labels.map((label, i) => {
    const day = new Date(now)
    day.setDate(now.getDate() - (6 - i))
    const borrowed = borrowedRecords.filter((entry) => {
      const d = new Date(entry.borrowedAt)
      return d.toDateString() === day.toDateString()
    }).length

    return {
      date: label,
      borrowed,
      returned: Math.max(0, Math.floor(borrowed * 0.7)),
    }
  })

  return data
}

export async function getBookDistribution() {
  const books = getBooks()
  const byCategory = new Map<string, number>()

  for (const book of books) {
    const category = book.category || 'Uncategorized'
    byCategory.set(category, (byCategory.get(category) || 0) + 1)
  }

  return Array.from(byCategory.entries()).map(([name, value]) => ({ name, value }))
}

export async function getAvailabilityStats() {
  const books = getBooks()
  const borrowedRecords = getBorrowedRecords()

  const borrowedByStatus = books.filter((book) => (book.status || '').toLowerCase() === 'borrowed').length
  const borrowed = Math.max(borrowedByStatus, borrowedRecords.length)
  const available = Math.max(0, books.length - borrowed)

  return [
    { status: 'Available', count: available },
    { status: 'Borrowed', count: borrowed },
    { status: 'Reserved', count: 0 },
  ]
}

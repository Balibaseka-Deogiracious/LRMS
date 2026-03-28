import { createContext, useContext, useMemo, useState } from 'react'
import { Book } from '../types'

export interface BorrowRecord {
  bookId: string
  title: string
  author: string
  borrowedAt: string
  dueDate: string
}

interface BorrowContextType {
  borrowedBooks: BorrowRecord[]
  borrowBook: (book: Book) => { ok: boolean; message: string }
  returnBook: (bookId: string) => boolean
  isBorrowed: (bookId: string) => boolean
  getRecord: (bookId: string) => BorrowRecord | undefined
}

const BorrowContext = createContext<BorrowContextType | undefined>(undefined)

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function BorrowProvider({ children }: { children: React.ReactNode }) {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowRecord[]>(() => {
    const raw = localStorage.getItem('borrowedBooks')
    if (!raw) return []
    try {
      return JSON.parse(raw) as BorrowRecord[]
    } catch {
      return []
    }
  })

  const persist = (next: BorrowRecord[]) => {
    setBorrowedBooks(next)
    localStorage.setItem('borrowedBooks', JSON.stringify(next))
  }

  const borrowBook = (book: Book) => {
    if (borrowedBooks.some((b) => b.bookId === book.id)) {
      return { ok: false, message: 'Book already borrowed.' }
    }

    const dueDate = addDays(new Date(), 14).toISOString()
    const record: BorrowRecord = {
      bookId: book.id,
      title: book.title,
      author: book.author,
      borrowedAt: new Date().toISOString(),
      dueDate,
    }

    persist([record, ...borrowedBooks])
    return { ok: true, message: 'Book borrowed successfully.' }
  }

  const returnBook = (bookId: string) => {
    const exists = borrowedBooks.some((b) => b.bookId === bookId)
    if (!exists) return false
    persist(borrowedBooks.filter((b) => b.bookId !== bookId))
    return true
  }

  const isBorrowed = (bookId: string) => borrowedBooks.some((b) => b.bookId === bookId)
  const getRecord = (bookId: string) => borrowedBooks.find((b) => b.bookId === bookId)

  const value = useMemo(
    () => ({ borrowedBooks, borrowBook, returnBook, isBorrowed, getRecord }),
    [borrowedBooks]
  )

  return <BorrowContext.Provider value={value}>{children}</BorrowContext.Provider>
}

export function useBorrow() {
  const ctx = useContext(BorrowContext)
  if (!ctx) throw new Error('useBorrow must be used within BorrowProvider')
  return ctx
}

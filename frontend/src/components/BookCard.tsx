import React from 'react'
import { FiBook, FiHeart, FiDownload } from 'react-icons/fi'

interface Book {
  id: string
  title: string
  author: string
  cover: string
  status: 'available' | 'borrowed' | 'overdue'
  dueDate?: string
}

interface BookCardProps {
  book: Book
  onBorrow?: () => void
  onReturn?: () => void
  onWishlist?: () => void
  userRole: 'patron' | 'librarian'
}

export default function BookCard({
  book,
  onBorrow,
  onReturn,
  onWishlist,
  userRole,
}: BookCardProps) {
  const statusColors = {
    available: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    borrowed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    overdue: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all">
      {/* Book Cover */}
      <div className="aspect-video bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden relative">
        <div className="w-full h-full flex items-center justify-center">
          <FiBook className="w-16 h-16 text-white opacity-50" />
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${statusColors[book.status]}`}>
          {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
        </span>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">{book.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{book.author}</p>
        
        {book.dueDate && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Due: {book.dueDate}
          </p>
        )}

        {/* Actions for Patron */}
        {userRole === 'patron' && (
          <div className="flex gap-2 mt-4">
            {book.status === 'available' && onBorrow && (
              <button
                onClick={onBorrow}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FiDownload className="w-4 h-4" />
                Borrow
              </button>
            )}
            {book.status !== 'available' && onReturn && (
              <button
                onClick={onReturn}
                className="flex-1 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-900 dark:text-white py-2 rounded-lg font-medium text-sm transition-colors"
              >
                Return
              </button>
            )}
            {onWishlist && (
              <button
                className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FiHeart className="w-4 h-4" />
                Save
              </button>
            )}
          </div>
        )}

        {/* Actions for Librarian */}
        {userRole === 'librarian' && (
          <div className="flex gap-2 mt-4 text-xs">
            <button className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-2 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              Edit
            </button>
            <button className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 py-2 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiChevronDown } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  status: 'available' | 'borrowed' | 'lost' | 'reserved'
  quantity: number
  copies: number
}

export default function InventoryPage() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      status: 'available',
      quantity: 5,
      copies: 3,
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0061120084',
      status: 'borrowed',
      quantity: 4,
      copies: 1,
    },
    {
      id: '3',
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0451524935',
      status: 'reserved',
      quantity: 3,
      copies: 0,
    },
    {
      id: '4',
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      isbn: '978-0553380163',
      status: 'available',
      quantity: 6,
      copies: 6,
    },
    {
      id: '5',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      isbn: '978-0062316097',
      status: 'lost',
      quantity: 2,
      copies: 1,
    },
  ])

  const [sortBy, setSortBy] = useState<'title' | 'status' | 'quantity'>('title')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    if (sortBy === 'status') return a.status.localeCompare(b.status)
    return b.quantity - a.quantity
  })

  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const statusBadges = {
    available: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    borrowed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    lost: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    reserved: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  }

  const handleEdit = (book: Book) => {
    toast.info(`📝 Edit mode for "${book.title}" (Feature coming soon)`)
  }

  const handleDelete = async (book: Book) => {
    const result = await Swal.fire({
      title: 'Delete Book',
      text: `Are you sure you want to delete "${book.title}" from inventory?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Delete it!',
    })

    if (result.isConfirmed) {
      setBooks(books.filter(b => b.id !== book.id))
      toast.success(`🗑️ "${book.title}" deleted from inventory`)
    }
  }

  const handleAddBook = async () => {
    const result = await Swal.fire({
      title: 'Add New Book',
      html: `
        <div class="text-left space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <input id="title" class="w-full px-3 py-2 border rounded-lg" placeholder="Book title">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Author</label>
            <input id="author" class="w-full px-3 py-2 border rounded-lg" placeholder="Author name">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">ISBN</label>
            <input id="isbn" class="w-full px-3 py-2 border rounded-lg" placeholder="ISBN number">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Quantity</label>
            <input id="quantity" type="number" class="w-full px-3 py-2 border rounded-lg" placeholder="0">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Add Book',
    })

    if (result.isConfirmed) {
      toast.success('✅ New book added to inventory')
    }
  }

  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Book Inventory
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage {books.length} books in the library
          </p>
        </div>
        <button
          onClick={handleAddBook}
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Add Book
        </button>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2">
        <label className="text-slate-600 dark:text-slate-400 text-sm font-medium">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as 'title' | 'status' | 'quantity')
            setCurrentPage(1)
          }}
          className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="title">Title</option>
          <option value="status">Status</option>
          <option value="quantity">Quantity</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  ISBN
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                  Available
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                  Total
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBooks.map(book => (
                <tr
                  key={book.id}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">{book.title}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{book.author}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-mono">
                    {book.isbn}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadges[book.status]}`}
                    >
                      {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="font-semibold text-green-600 dark:text-green-400">{book.copies}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="font-semibold text-slate-900 dark:text-white">{book.quantity}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                        title="Edit book"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(book)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                        title="Delete book"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <p className="text-green-700 dark:text-green-300 text-sm font-medium">Available</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
            {books.filter(b => b.status === 'available').reduce((sum, b) => sum + b.copies, 0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Borrowed</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
            {books.filter(b => b.status === 'borrowed').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">Reserved</p>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
            {books.filter(b => b.status === 'reserved').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">Lost</p>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
            {books.filter(b => b.status === 'lost').length}
          </p>
        </div>
      </div>
    </div>
  )
}

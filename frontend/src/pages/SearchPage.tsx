import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import BookCard from '../components/BookCard'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

interface SearchPageProps {
  userRole: 'patron' | 'librarian'
}

export default function SearchPage({ userRole }: SearchPageProps) {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Mock book data
  const allBooks = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'fiction', status: 'available' },
    { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'fiction', status: 'borrowed' },
    { id: '3', title: '1984', author: 'George Orwell', genre: 'fiction', status: 'overdue' },
    { id: '4', title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'science', status: 'available' },
    { id: '5', title: 'The Selfish Gene', author: 'Richard Dawkins', genre: 'science', status: 'available' },
    { id: '6', title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'history', status: 'borrowed' },
    { id: '7', title: 'The Code Breaker', author: 'Walter Isaacson', genre: 'biography', status: 'available' },
    { id: '8', title: 'Clean Code', author: 'Robert C. Martin', genre: 'technology', status: 'available' },
  ]

  const handleSearch = (query: string, filters: any) => {
    let results = allBooks

    // Filter by search query
    if (query.trim()) {
      results = results.filter(
        book =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Filter by genre
    if (filters.genre) {
      results = results.filter(book => book.genre === filters.genre)
    }

    // Filter by availability
    if (filters.availability) {
      results = results.filter(book => book.status === filters.availability)
    }

    // Filter by author
    if (filters.author) {
      results = results.filter(book =>
        book.author.toLowerCase().includes(filters.author.toLowerCase())
      )
    }

    setSearchResults(results)
    setHasSearched(true)

    if (results.length === 0) {
      toast.info('No books found matching your criteria')
    } else {
      toast.success(`Found ${results.length} book(s)`)
    }
  }

  const handleBorrow = async (bookId: string, bookTitle: string) => {
    const result = await Swal.fire({
      title: 'Confirm Borrow',
      text: `Do you want to borrow "${bookTitle}"?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Borrow it!',
    })

    if (result.isConfirmed) {
      toast.success(`📚 "${bookTitle}" borrowed successfully!`)
    }
  }

  const handleReturn = async (bookId: string, bookTitle: string) => {
    const result = await Swal.fire({
      title: 'Return Book',
      text: `Return "${bookTitle}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Return it!',
    })

    if (result.isConfirmed) {
      toast.success(`✅ "${bookTitle}" returned successfully!`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Results */}
      {hasSearched && (
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Search Results ({searchResults.length})
          </h3>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  userRole={userRole}
                  onBorrow={() => handleBorrow(book.id, book.title)}
                  onReturn={() => handleReturn(book.id, book.title)}
                  onWishlist={() => toast.info(`💌 "${book.title}" added to wishlist!`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No books found. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {/* No search yet */}
      {!hasSearched && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-12 text-center">
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Start Searching 🔍
          </h4>
          <p className="text-slate-600 dark:text-slate-400">
            Use the search bar above to find books by title, author, or genre. You can also apply filters to narrow down your results.
          </p>
        </div>
      )}
    </div>
  )
}

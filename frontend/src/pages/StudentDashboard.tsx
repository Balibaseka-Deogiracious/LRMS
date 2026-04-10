import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen, Plus, Heart, Moon, Sun, LogOut, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useBorrow } from '../contexts/BorrowContext'
import { borrowBook as markBookAsBorrowed, searchBooks } from '../services/bookService'
import type { Book } from '../types'
import './student-dashboard.css'

export default function StudentDashboard() {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const { borrowBook: addBorrowRecord, isBorrowed } = useBorrow()
  const navigate = useNavigate()
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [booksLoading, setBooksLoading] = useState(true)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [showBorrowForm, setShowBorrowForm] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [submittingBorrow, setSubmittingBorrow] = useState(false)
  const [borrowError, setBorrowError] = useState('')
  const [borrowForm, setBorrowForm] = useState({
    fullName: localStorage.getItem('currentUserName') || '',
    studentId: '',
    email: '',
    program: '',
    pickupDate: new Date().toISOString().slice(0, 10),
    notes: '',
    agreeToPolicy: false,
  })

  // Load real books from backend on mount
  useEffect(() => {
    const loadBooks = async () => {
      setBooksLoading(true)
      try {
        const allBooks = await searchBooks('')
        setBooks(Array.isArray(allBooks) ? allBooks : [])
        setFilteredBooks(Array.isArray(allBooks) ? allBooks : [])
      } catch (error) {
        console.error('Failed to load books:', error)
        toast.error('Failed to load books')
      } finally {
        setBooksLoading(false)
      }
    }

    void loadBooks()
  }, [])

  useEffect(() => {
    let results = books
    if (searchQuery) {
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (selectedCategory !== 'all') {
      results = results.filter((book) => book.category_name === selectedCategory)
    }
    setFilteredBooks(results)
  }, [searchQuery, selectedCategory, books])

  const categories = ['all', ...new Set(books.map((b) => b.category_name || 'Uncategorized'))]

  const toggleWishlist = (bookId: string | number) => {
    const bookIdStr = String(bookId)
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(bookIdStr)) {
      newWishlist.delete(bookIdStr)
    } else {
      newWishlist.add(bookIdStr)
    }
    setWishlist(newWishlist)
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('currentUserName')
    navigate('/')
  }

  const openBorrowForm = (book: Book) => {
    setSelectedBook(book)
    setBorrowError('')
    setBorrowForm((prev) => ({
      ...prev,
      pickupDate: new Date().toISOString().slice(0, 10),
      notes: '',
      agreeToPolicy: false,
    }))
    setShowBorrowForm(true)
  }

  const closeBorrowForm = () => {
    if (submittingBorrow) return
    setShowBorrowForm(false)
    setSelectedBook(null)
    setBorrowError('')
  }

  const submitBorrowRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedBook) return

    if (!borrowForm.fullName.trim() || !borrowForm.studentId.trim() || !borrowForm.email.trim() || !borrowForm.program.trim()) {
      setBorrowError('Please complete all required fields before submitting.')
      return
    }

    if (!borrowForm.agreeToPolicy) {
      setBorrowError('You must agree to the borrowing policy to continue.')
      return
    }

    setBorrowError('')
    setSubmittingBorrow(true)

    try {
      if (isBorrowed(String(selectedBook.id))) {
        setBorrowError('You already borrowed this book.')
        return
      }

      await markBookAsBorrowed(String(selectedBook.id))

      const recordResult = addBorrowRecord(selectedBook)
      if (!recordResult.ok) {
        setBorrowError(recordResult.message)
        return
      }

      setBooks((previousBooks) => previousBooks.map((book) => (
        book.id === selectedBook.id ? { ...book, status: 'borrowed' } : book
      )))

      toast.success(`Borrow request submitted for "${selectedBook.title}".`)
      closeBorrowForm()
    } catch (error: any) {
      setBorrowError(error?.message || 'Unable to process your borrow request right now. Please try again.')
    } finally {
      setSubmittingBorrow(false)
    }
  }

  return (
    <div className="student-dashboard">
      {/* Top Navbar */}
      <nav className="student-navbar">
        <div className="student-navbar-brand">Learning Hub</div>
        <div className="student-navbar-actions">
          <button type="button" className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button type="button" className="student-logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="student-hero">
        <div className="student-hero-content">
          <div className="student-hero-top">
            <div>
              <h1>Welcome to Your Learning Hub</h1>
              <p>Discover thousands of books, research papers, and knowledge resources curated for your academic journey</p>
            </div>
          </div>
          <div className="student-search-box">
            <Search size={20} />
            <input
              type="search"
              placeholder="Search books, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search library"
            />
            <button type="button">Search</button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="student-container">
        {/* Sidebar Filter */}
        <aside className="student-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Quick Access</h3>
            <ul className="quick-links">
              <li>
                <a href="#featured">Featured Books</a>
              </li>
              <li>
                <a href="#trending">Trending Now</a>
              </li>
              <li>
                <a href="#wishlist">My Wishlist</a>
              </li>
              <li>
                <a href="#borrowed">Recent Borrows</a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Books Grid */}
        <main className="student-main">
          <div className="books-header">
            <div>
              <h2>Explore Our Collection</h2>
              <p>{filteredBooks.length} books available</p>
            </div>
            <div className="sort-controls">
              <select defaultValue="relevance" aria-label="Sort books by">
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {booksLoading ? (
            <div className="loading-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading books...</span>
              </div>
              <p className="mt-3">Loading your book collection...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="no-results">
              <BookOpen size={48} />
              <p>No books found matching your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <article 
                  key={book.id} 
                  className="book-card-student"
                  onClick={() => navigate(`/books/${book.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="book-card-image">
                    {book.cover_filename ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/books/${book.id}/cover`}
                        alt={`${book.title} cover`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="book-placeholder">
                        <BookOpen size={32} />
                      </div>
                    )}
                    <button
                      type="button"
                      className={`wishlist-btn ${wishlist.has(String(book.id)) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(book.id)
                      }}
                      title="Add to wishlist"
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className="book-card-content">
                    <h3>{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    {book.category_name && <span className="book-category">{book.category_name}</span>}
                    <p className="book-description">{book.description || 'No description available'}</p>
                    <div className="book-card-footer">
                      <span
                        className={`status-badge ${book.is_available ? 'available' : 'unavailable'}`}
                      >
                        {book.is_available ? 'Available' : 'Checked Out'}
                      </span>
                      <button
                        type="button"
                        className="borrow-btn"
                        disabled={!book.is_available || isBorrowed(String(book.id))}
                        onClick={(e) => {
                          e.stopPropagation()
                          openBorrowForm(book)
                        }}
                      >
                        <Plus size={16} />
                        Borrow
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {showBorrowForm && selectedBook && (
        <div
          className="borrow-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeBorrowForm()
          }}
        >
          <div className="borrow-modal-panel" role="dialog" aria-modal="true" aria-labelledby="borrow-form-title">
            <div className="borrow-modal-header">
              <div>
                <h3 id="borrow-form-title" className="mb-1">Borrow Request</h3>
                <p className="mb-0">Complete this quick form to reserve your selected title.</p>
              </div>
              <button type="button" className="borrow-close-btn" onClick={closeBorrowForm} aria-label="Close borrow form">
                <X size={18} />
              </button>
            </div>

            <div className="borrow-book-summary">
              <strong>{selectedBook.title}</strong>
              <span>{selectedBook.author}</span>
            </div>

            <form className="borrow-form-grid" onSubmit={submitBorrowRequest}>
              <label>
                Full Name
                <input
                  type="text"
                  value={borrowForm.fullName}
                  onChange={(event) => setBorrowForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  required
                />
              </label>

              <label>
                Student ID
                <input
                  type="text"
                  value={borrowForm.studentId}
                  onChange={(event) => setBorrowForm((prev) => ({ ...prev, studentId: event.target.value }))}
                  required
                />
              </label>

              <label>
                School Email
                <input
                  type="email"
                  value={borrowForm.email}
                  onChange={(event) => setBorrowForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
              </label>

              <label>
                Program / Department
                <input
                  type="text"
                  value={borrowForm.program}
                  onChange={(event) => setBorrowForm((prev) => ({ ...prev, program: event.target.value }))}
                  required
                />
              </label>

              <label className="borrow-form-full">
                Pickup Date
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={borrowForm.pickupDate}
                  onChange={(event) => setBorrowForm((prev) => ({ ...prev, pickupDate: event.target.value }))}
                  required
                />
              </label>

              <label className="borrow-form-full">
                Notes (Optional)
                <textarea
                  rows={3}
                  value={borrowForm.notes}
                  onChange={(event) => setBorrowForm((prev) => ({ ...prev, notes: event.target.value }))}
                  placeholder="Add any pickup preferences or notes for the librarian..."
                />
              </label>

              <label className="borrow-policy-check borrow-form-full">
                <input
                  type="checkbox"
                  checked={borrowForm.agreeToPolicy}
                  onChange={(event) => setBorrowForm((prev) => ({ ...prev, agreeToPolicy: event.target.checked }))}
                />
                <span>I agree to return this book on time and follow borrowing policies.</span>
              </label>

              {borrowError && <p className="borrow-form-error borrow-form-full mb-0">{borrowError}</p>}

              <div className="borrow-modal-actions borrow-form-full">
                <button type="button" className="btn btn-outline-secondary" onClick={closeBorrowForm} disabled={submittingBorrow}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submittingBorrow}>
                  {submittingBorrow ? 'Submitting...' : 'Confirm Borrow'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SaaS Footer */}
      <footer className="student-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Libris</h4>
            <ul>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#careers">Careers</a>
              </li>
              <li>
                <a href="#press">Press</a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="#help">Help Center</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#guide">User Guide</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
              <li>
                <a href="#cookies">Cookie Settings</a>
              </li>
              <li>
                <a href="#accessibility">Accessibility</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <ul className="social-links">
              <li>l
                <a href="#twitter">Twitter</a>
              </li>
              <li>
                <a href="#facebook">Facebook</a>
              </li>
              <li>
                <a href="#linkedin">LinkedIn</a>
              </li>
              <li>
                <a href="#instagram">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Libris. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

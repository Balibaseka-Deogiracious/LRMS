import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen, Plus, Heart, Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { getBooks } from '../services/mockStore'
import type { Book } from '../types'
import './student-dashboard.css'

export default function StudentDashboard() {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  useEffect(() => {
    const allBooks = getBooks()
    setBooks(allBooks)
    setFilteredBooks(allBooks)
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
      results = results.filter((book) => book.category === selectedCategory)
    }
    setFilteredBooks(results)
  }, [searchQuery, selectedCategory, books])

  const categories = ['all', ...new Set(books.map((b) => b.category || 'Uncategorized'))]

  const toggleWishlist = (bookId: string) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(bookId)) {
      newWishlist.delete(bookId)
    } else {
      newWishlist.add(bookId)
    }
    setWishlist(newWishlist)
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('currentUserName')
    navigate('/login')
  }

  return (
    <div className="student-dashboard">
      {/* Hero Section */}
      <section className="student-hero">
        <div className="student-hero-content">
          <div className="student-hero-top">
            <div>
              <h1>Welcome to Your Learning Hub</h1>
              <p>Discover thousands of books, research papers, and knowledge resources curated for your academic journey</p>
            </div>
            <div className="hero-action-buttons">
              <button type="button" className="student-logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
              <button type="button" className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
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

          {filteredBooks.length === 0 ? (
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
                <article key={book.id} className="book-card-student">
                  <div className="book-card-image">
                    <div className="book-placeholder">
                      <BookOpen size={32} />
                    </div>
                    <button
                      type="button"
                      className={`wishlist-btn ${wishlist.has(book.id) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(book.id)}
                      title="Add to wishlist"
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                  <div className="book-card-content">
                    <h3>{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    {book.category && <span className="book-category">{book.category}</span>}
                    <p className="book-description">{book.description || 'No description available'}</p>
                    <div className="book-card-footer">
                      <span
                        className={`status-badge ${book.status === 'available' ? 'available' : 'unavailable'}`}
                      >
                        {book.status === 'available' ? 'Available' : 'Checked Out'}
                      </span>
                      <button type="button" className="borrow-btn" disabled={book.status !== 'available'}>
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

      {/* SaaS Footer */}
      <footer className="student-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About LRMS</h4>
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
          <p>&copy; 2026 Library Resource Management System. All rights reserved.</p>
          <div className="footer-badges">
            <span className="badge">🔒 Secure</span>
            <span className="badge">⚡ Fast</span>
            <span className="badge">📱 Mobile-Friendly</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

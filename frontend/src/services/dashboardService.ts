import { DashboardStats } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// ==================== BOOK STATISTICS ====================

export interface BookInventoryStats {
  total_books: number
  total_copies: number
  available_copies: number
  borrowed_copies: number
  books_with_zero_availability: number
}

export interface BooksDistribution {
  category_name: string
  total_books: number
}

export interface AvailabilityStats {
  available_books: number
  borrowed_books: number
  reserved_books: number
}

export async function getBookInventoryStats(): Promise<BookInventoryStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats/books/inventory`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch inventory stats')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch book inventory stats:', error)
    return {
      total_books: 0,
      total_copies: 0,
      available_copies: 0,
      borrowed_copies: 0,
      books_with_zero_availability: 0,
    }
  }
}

export async function getBooksDistribution(): Promise<BooksDistribution[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats/books/by-category`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch books distribution')
    const data = await response.json()
    return Array.isArray(data)
      ? data.map((item: any) => ({
          category_name: item.category_name,
          total_books: item.total_books,
        }))
      : []
  } catch (error) {
    console.error('Failed to fetch books distribution:', error)
    return []
  }
}

export async function getAvailabilityStats(): Promise<AvailabilityStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats/books/status-distribution`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch availability stats')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch availability stats:', error)
    return {
      available_books: 0,
      borrowed_books: 0,
      reserved_books: 0,
    }
  }
}

// ==================== BORROWING ANALYTICS ====================

export interface BorrowingTrend {
  date: string
  borrow_count: number
  return_count: number
  new_requests: number
}

export interface BorrowingTrendsStats {
  average_borrow_duration_days: number
  on_time_return_rate: number
  late_return_rate: number
  trends: BorrowingTrend[]
}

export async function getBorrowingTrends(days: number = 7): Promise<BorrowingTrendsStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats/borrows/trends?days=${days}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch borrowing trends')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch borrowing trends:', error)
    return {
      average_borrow_duration_days: 0,
      on_time_return_rate: 0,
      late_return_rate: 0,
      trends: [],
    }
  }
}

// ==================== USER STATISTICS ====================

export interface UserStats {
  total_students: number
  total_librarians: number
  total_users: number
}

export async function getTotalUsers(): Promise<UserStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats/users/total`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch user stats')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch total users:', error)
    return {
      total_students: 0,
      total_librarians: 0,
      total_users: 0,
    }
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const inventory = await getBookInventoryStats()
    return {
      totalBooks: inventory.total_books,
      borrowedBooks: inventory.borrowed_copies,
      availableBooks: inventory.available_copies,
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return {
      totalBooks: 0,
      borrowedBooks: 0,
      availableBooks: 0,
    }
  }
}

import api from './api'
import { DashboardStats } from '../types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get('/dashboard/stats')
  const data = res.data || {}

  return {
    totalBooks: Number(data.totalBooks ?? data.total_books ?? 0),
    borrowedBooks: Number(data.borrowedBooks ?? data.borrowed_books ?? 0),
    availableBooks: Number(data.availableBooks ?? data.available_books ?? 0),
  }
}

export async function getBorrowingTrends() {
  try {
    const res = await api.get('/dashboard/borrowing-trends')
    return res.data || []
  } catch {
    // Fallback mock data
    return [
      { date: 'Mon', borrowed: 12, returned: 8 },
      { date: 'Tue', borrowed: 15, returned: 10 },
      { date: 'Wed', borrowed: 10, returned: 12 },
      { date: 'Thu', borrowed: 18, returned: 14 },
      { date: 'Fri', borrowed: 22, returned: 18 },
      { date: 'Sat', borrowed: 16, returned: 15 },
      { date: 'Sun', borrowed: 14, returned: 11 },
    ]
  }
}

export async function getBookDistribution() {
  try {
    const res = await api.get('/dashboard/book-distribution')
    return res.data || []
  } catch {
    // Fallback mock data
    return [
      { name: 'Fiction', value: 145 },
      { name: 'Non-Fiction', value: 89 },
      { name: 'Science', value: 67 },
      { name: 'History', value: 54 },
      { name: 'Biography', value: 43 },
      { name: 'Technology', value: 71 },
    ]
  }
}

export async function getAvailabilityStats() {
  try {
    const res = await api.get('/dashboard/availability-stats')
    return res.data || []
  } catch {
    // Fallback mock data
    return [
      { status: 'Available', count: 234 },
      { status: 'Borrowed', count: 89 },
      { status: 'Reserved', count: 12 },
    ]
  }
}

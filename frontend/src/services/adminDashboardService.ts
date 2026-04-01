import axios from 'axios'
import { getAvailabilityStats, getBooksDistribution, getBorrowingTrends, getDashboardStats } from './dashboardService'
import type { DashboardStats } from '../types'

export interface AdminDashboardPayload {
  welcomeMessage: string
  stats: DashboardStats
  trends: Array<{ date: string; borrowed: number; returned: number }>
  distribution: Array<{ name: string; value: number }>
  availability: Array<{ status: string; count: number }>
}

export async function loadAdminDashboard(): Promise<AdminDashboardPayload> {
  try {
    const { data } = await axios.get<AdminDashboardPayload>('/mock/admin-dashboard.json', {
      timeout: 3000,
    })

    if (data && data.stats && Array.isArray(data.trends)) {
      return data
    }
  } catch {
    // Fallback to locally computed frontend-only analytics.
  }

  const [stats, trends, distribution, availability] = await Promise.all([
    getDashboardStats(),
    getBorrowingTrends(),
    getBooksDistribution(),
    getAvailabilityStats(),
  ])

  // Map the actual return types to the AdminDashboardPayload interface
  const mappedTrends = trends.trends.map((t: any) => ({
    date: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }),
    borrowed: t.borrow_count || 0,
    returned: t.return_count || 0,
  }))

  const mappedDistribution = distribution.map((d: any) => ({
    name: d.category_name,
    value: d.total_books,
  }))

  const mappedAvailability = [
    { status: 'Available', count: availability.available_books },
    { status: 'Borrowed', count: availability.borrowed_books },
    { status: 'Reserved', count: availability.reserved_books || 0 },
  ]

  return {
    welcomeMessage: 'Welcome back, Librarian. Here is what is happening in your library today.',
    stats,
    trends: mappedTrends,
    distribution: mappedDistribution,
    availability: mappedAvailability,
  }
}

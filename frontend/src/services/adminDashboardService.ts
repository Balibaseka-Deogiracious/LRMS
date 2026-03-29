import axios from 'axios'
import { getAvailabilityStats, getBookDistribution, getBorrowingTrends, getDashboardStats } from './dashboardService'
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
    getBookDistribution(),
    getAvailabilityStats(),
  ])

  return {
    welcomeMessage: 'Welcome back, Librarian. Here is what is happening in your library today.',
    stats,
    trends,
    distribution,
    availability,
  }
}

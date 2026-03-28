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

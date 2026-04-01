export interface Book {
  id: number | string
  title: string
  author: string
  isbn: string
  description?: string | null
  publication_year?: number | null
  total_copies: number
  available_copies: number
  is_available: boolean
  category_id?: number | null
  category_name?: string | null
}

export interface Stats {
  totalBooks: number
  activeLoans: number
  overdueItems: number
  activeReaders: number
}

export interface DashboardStats {
  totalBooks: number
  borrowedBooks: number
  availableBooks: number
}

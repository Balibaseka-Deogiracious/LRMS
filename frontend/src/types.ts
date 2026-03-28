export interface Book {
  id: string
  title: string
  author: string
  category?: string
  description?: string
  publishedYear?: string
  isbn?: string
  status?: string
}

export interface Stats {
  totalBooks: number
  activeLoans: number
  overdueItems: number
  activeReaders: number
}

import { Book } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function searchBooks(query = ''): Promise<Book[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/books?search=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to search books')
    const data = await response.json()
    
    return Array.isArray(data) ? data : (data.books || [])
  } catch (error) {
    console.error('Search books error:', error)
    return []
  }
}

export async function getBook(id: string): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`)
    if (!response.ok) return null
    const data = await response.json()
    return data || null
  } catch (error) {
    console.error('Get book error:', error)
    return null
  }
}

export async function addBook(payload: {
  title: string
  author: string
  isbn: string
  category?: string
  description?: string
  total_copies?: number
  publication_year?: number
}) {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Authentication token not found')
  }

  const response = await fetch(`${API_BASE_URL}/admin/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: payload.title.trim(),
      author: payload.author.trim(),
      isbn: payload.isbn.trim(),
      description: payload.description?.trim() || null,
      publication_year: payload.publication_year || null,
      total_copies: payload.total_copies || 1,
      category_id: null, // Can be extended later
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to add book')
  }

  return await response.json()
}

export async function borrowBook(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/books/borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id: parseInt(id) }),
    })
    return response.ok
  } catch (error) {
    console.error('Borrow book error:', error)
    return false
  }
}

export async function deleteBook(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/admin/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return response.ok
  } catch (error) {
    console.error('Delete book error:', error)
    return false
  }
}

export async function getCategories() {
  try {
    const token = localStorage.getItem('token')
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/books/categories`, {
      headers,
    })
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    return Array.isArray(data) ? data : (data.categories || [])
  } catch (error) {
    console.error('Get categories error:', error)
    return []
  }
}

import api from './api'
import { Book } from '../types'

export async function searchBooks(query = ''): Promise<Book[]> {
  try {
    const res = await api.get('/books', { params: { q: query } })
    return res.data
  } catch (err) {
    // In absence of API, return empty array and let UI fall back to mock data
    return []
  }
}

export async function getBook(id: string): Promise<Book | null> {
  try {
    const res = await api.get(`/books/${id}`)
    return res.data
  } catch (err) {
    return null
  }
}

export async function addBook(payload: Partial<Book>) {
  const res = await api.post('/books', payload)
  return res.data
}

export async function borrowBook(id: string): Promise<boolean> {
  try {
    await api.post(`/books/${id}/borrow`)
    return true
  } catch (err) {
    return false
  }
}

export async function deleteBook(id: string): Promise<boolean> {
  try {
    await api.delete(`/books/${id}`)
    return true
  } catch (err) {
    return false
  }
}

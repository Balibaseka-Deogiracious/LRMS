import type { Role } from '../contexts/AuthContext'
import type { Book } from '../types'

interface LocalUser {
  id: string
  name: string
  email: string
  password: string
  role: Role
  active: boolean
  createdAt: string
  lastLoginAt?: string
}

const BOOKS_KEY = 'lrms_books'
const USERS_KEY = 'lrms_users'

const seededBooks: Book[] = [
  {
    id: 'b-1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    category: 'Fiction',
    publishedYear: '1925',
    description: 'A story of wealth, love, and the American dream.',
    status: 'available',
  },
  {
    id: 'b-2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    category: 'Fiction',
    publishedYear: '1960',
    description: 'A classic novel on justice and morality.',
    status: 'available',
  },
  {
    id: 'b-3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    category: 'Technology',
    publishedYear: '2008',
    description: 'A handbook of agile software craftsmanship.',
    status: 'available',
  },
  {
    id: 'b-4',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: '9780553380163',
    category: 'Science',
    publishedYear: '1988',
    description: 'Cosmology explained for the general reader.',
    status: 'available',
  },
]

const seededUsers: LocalUser[] = [
  {
    id: 'u-admin',
    name: 'System Librarian',
    email: 'admin@lrms.local',
    password: 'admin123',
    role: 'admin',
    active: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
]

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function getBooks(): Book[] {
  const books = safeParse<Book[]>(localStorage.getItem(BOOKS_KEY), [])
  if (books.length === 0) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(seededBooks))
    return seededBooks
  }
  return books
}

export function saveBooks(books: Book[]) {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books))
}

export function getUsers(): LocalUser[] {
  const users = safeParse<Partial<LocalUser>[]>(localStorage.getItem(USERS_KEY), [])
  if (users.length === 0) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seededUsers))
    return seededUsers
  }

  return users.map((user) => ({
    id: String(user.id || makeId('u')),
    name: String(user.name || 'Unnamed User'),
    email: String(user.email || ''),
    password: String(user.password || ''),
    role: user.role === 'admin' ? 'admin' : 'user',
    active: user.active !== false,
    createdAt: user.createdAt || new Date().toISOString(),
    lastLoginAt: user.lastLoginAt,
  }))
}

export function saveUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export type { LocalUser }

import type { Role } from '../contexts/AuthContext'
import { getUsers, saveUsers, makeId } from './mockStore'

export async function login(email: string, password: string) {
  const users = getUsers()
  const emailKey = email.trim().toLowerCase()
  const user = users.find((entry) => entry.email.toLowerCase() === emailKey && entry.password === password)

  if (!user) {
    throw new Error('Invalid email or password')
  }

  if (!user.active) {
    throw new Error('This account is disabled by the librarian.')
  }

  const nextUsers = users.map((entry) => (
    entry.id === user.id ? { ...entry, lastLoginAt: new Date().toISOString() } : entry
  ))
  saveUsers(nextUsers)

  return {
    token: `local-token-${Date.now()}`,
    role: user.role,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  const users = getUsers()
  const exists = users.some((entry) => entry.email.toLowerCase() === payload.email.trim().toLowerCase())

  if (exists) {
    throw new Error('Email already exists')
  }

  const nextUser = {
    id: makeId('u'),
    name: payload.name.trim(),
    email: payload.email.trim(),
    password: payload.password,
    role: 'student' as Role,
    active: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: undefined,
  }

  saveUsers([nextUser, ...users])

  return {
    id: nextUser.id,
    name: nextUser.name,
    email: nextUser.email,
    role: nextUser.role,
  }
}

export function storeToken(token: string, role: Role = 'student') {
  localStorage.setItem('token', token)
  localStorage.setItem('userRole', role)
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('currentUserName')
}

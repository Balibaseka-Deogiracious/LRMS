import type { Role } from '../contexts/AuthContext'
import { getUsers, saveUsers, makeId } from './mockStore'

const RESET_TOKENS_KEY = 'lrms_password_reset_tokens'

type ResetTokenRecord = {
  email: string
  expiresAt: number
}

function getResetTokens(): Record<string, ResetTokenRecord> {
  const raw = localStorage.getItem(RESET_TOKENS_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Record<string, ResetTokenRecord>
  } catch {
    return {}
  }
}

function saveResetTokens(tokens: Record<string, ResetTokenRecord>) {
  localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens))
}

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

export async function requestPasswordReset(email: string) {
  const users = getUsers()
  const emailKey = email.trim().toLowerCase()
  const user = users.find((entry) => entry.email.toLowerCase() === emailKey)

  if (!user) {
    throw new Error('No account found for that email address.')
  }

  if (!user.active) {
    throw new Error('This account is disabled by the librarian.')
  }

  const tokens = getResetTokens()
  const token = makeId('rst')
  const expiresAt = Date.now() + 15 * 60 * 1000

  tokens[token] = { email: user.email, expiresAt }
  saveResetTokens(tokens)

  return {
    token,
    email: user.email,
    resetLink: `/reset-password?token=${encodeURIComponent(token)}`,
  }
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenKey = token.trim()
  const tokens = getResetTokens()
  const tokenRecord = tokens[tokenKey]

  if (!tokenRecord) {
    throw new Error('This reset link is invalid or already used.')
  }

  if (Date.now() > tokenRecord.expiresAt) {
    delete tokens[tokenKey]
    saveResetTokens(tokens)
    throw new Error('This reset link has expired. Please request a new one.')
  }

  const users = getUsers()
  const emailKey = tokenRecord.email.toLowerCase()
  const userExists = users.some((entry) => entry.email.toLowerCase() === emailKey)

  if (!userExists) {
    delete tokens[tokenKey]
    saveResetTokens(tokens)
    throw new Error('Unable to reset password for this account.')
  }

  const nextUsers = users.map((entry) => (
    entry.email.toLowerCase() === emailKey
      ? { ...entry, password: newPassword }
      : entry
  ))

  saveUsers(nextUsers)

  delete tokens[tokenKey]
  saveResetTokens(tokens)
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

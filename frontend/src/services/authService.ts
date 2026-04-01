import type { Role } from '../contexts/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface LoginResponse {
  access_token: string
  token_type: string
  user_type: 'student' | 'admin'
  student?: {
    id: number
    full_name: string
    email: string
    registration_number: string
  }
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Invalid email or password')
  }

  const data: LoginResponse = await response.json()
  
  return {
    token: data.access_token,
    role: data.user_type === 'admin' ? 'admin' : 'student',
    user: {
      id: data.student?.id || 0,
      name: data.student?.full_name || 'Student',
      email: data.student?.email || email,
      role: data.user_type === 'admin' ? 'admin' : 'student',
    },
  }
}

export async function registerUser(payload: { 
  name: string
  email: string
  password: string
  registrationNumber?: string 
}) {
  const regNumber = payload.registrationNumber || `STU-${Date.now()}`
  
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: payload.name.trim(),
      email: payload.email.trim(),
      registration_number: regNumber,
      password: payload.password,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Registration failed')
  }

  return await response.json()
}

export async function requestPasswordReset(email: string) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim() }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Could not send password reset email')
  }

  return await response.json()
}

export async function resetPassword(token: string, newPassword: string) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      token: token.trim(),
      new_password: newPassword,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Password reset failed')
  }

  return await response.json()
}

export function storeToken(token: string, role: Role = 'student') {
  localStorage.setItem('token', token)
  localStorage.setItem('userRole', role)
}

export function getStoredToken(): string | null {
  return localStorage.getItem('token')
}

export function getStoredRole(): Role {
  const role = localStorage.getItem('userRole')
  return role === 'admin' ? 'admin' : 'student'
}

export async function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('currentUserName')
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token')
}

import api from './api'
import type { Role } from '../contexts/AuthContext'

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  const res = await api.post('/auth/register', payload)
  return res.data
}

export function storeToken(token: string, role: Role = 'user') {
  localStorage.setItem('token', token)
  localStorage.setItem('userRole', role)
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
}

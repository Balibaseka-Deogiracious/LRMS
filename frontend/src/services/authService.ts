import api from './api'

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

export function storeToken(token: string) {
  localStorage.setItem('token', token)
}

export function logout() {
  localStorage.removeItem('token')
}

import type { Role } from '../contexts/AuthContext'
import { getUsers, saveUsers, type LocalUser } from './mockStore'

export async function listUsers(): Promise<LocalUser[]> {
  return getUsers().sort((a, b) => a.name.localeCompare(b.name))
}

export async function updateUserRole(userId: string, role: Role): Promise<boolean> {
  const users = getUsers()
  const next = users.map((user) => (user.id === userId ? { ...user, role } : user))
  const changed = next.some((user, index) => {
    const original = users[index]
    return original && user.id === userId && original.role !== user.role
  })
  if (!changed) return false
  saveUsers(next)
  return true
}

export async function toggleUserActive(userId: string): Promise<boolean> {
  const users = getUsers()
  const target = users.find((user) => user.id === userId)
  if (!target) return false

  // Keep the seeded system admin always active.
  if (target.id === 'u-admin') return false

  const next = users.map((user) => (user.id === userId ? { ...user, active: !user.active } : user))
  saveUsers(next)
  return true
}

export async function deleteUser(userId: string): Promise<boolean> {
  if (userId === 'u-admin') return false

  const users = getUsers()
  const next = users.filter((user) => user.id !== userId)
  if (next.length === users.length) return false
  saveUsers(next)
  return true
}

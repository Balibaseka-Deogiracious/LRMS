import type { Role } from '../contexts/AuthContext'
import { getUsers, saveUsers, type LocalUser } from './mockStore'

const API_BASE_URL = 'http://localhost:8000'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function listUsers(): Promise<LocalUser[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/students`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      console.error('Failed to fetch students, falling back to mock data')
      return getUsers().sort((a, b) => a.name.localeCompare(b.name))
    }

    const students = await response.json()

    // Map backend students to LocalUser format
    const mappedUsers: LocalUser[] = students.map((student: any) => ({
      id: String(student.id),
      name: student.full_name,
      email: student.email,
      password: '', // Not provided by backend
      role: 'student' as Role,
      active: student.is_active,
      createdAt: new Date().toISOString(),
      lastLoginAt: undefined,
    }))

    return mappedUsers.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Failed to fetch students from backend:', error)
    // Fallback to mock data
    return getUsers().sort((a, b) => a.name.localeCompare(b.name))
  }
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
  try {
    const studentId = parseInt(userId, 10)
    if (isNaN(studentId)) return false

    // Fetch current student to check status
    const response = await fetch(`${API_BASE_URL}/admin/students`, {
      headers: getAuthHeaders(),
    })
    const students = await response.json()
    const student = students.find((s: any) => s.id === studentId)
    if (!student) return false

    // Call appropriate endpoint to toggle
    const endpoint = student.is_active ? 'suspend' : 'activate'
    const toggleResponse = await fetch(
      `${API_BASE_URL}/admin/students/${studentId}/${endpoint}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      }
    )

    return toggleResponse.ok
  } catch (error) {
    console.error('Failed to toggle user active status:', error)
    return false
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const studentId = parseInt(userId, 10)
    if (isNaN(studentId)) return false

    const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to delete student')
    }

    return response.ok
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete user'
    console.error('Failed to delete user:', message)
    throw new Error(message)
  }
}

import { createContext, useContext, useMemo, useState } from 'react'

export type Role = 'admin' | 'user'

interface AuthContextType {
  token: string | null
  role: Role
  isAuthenticated: boolean
  login: (token: string, role?: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [roleState, setRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem('userRole')
    return saved === 'admin' ? 'admin' : 'user'
  })

  const login = (nextToken: string, nextRole: Role = 'user') => {
    localStorage.setItem('token', nextToken)
    localStorage.setItem('userRole', nextRole)
    setToken(nextToken)
    setRoleState(nextRole)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    setToken(null)
    setRoleState('user')
  }

  const value = useMemo<AuthContextType>(
    () => ({
      token,
      role: roleState,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token, roleState]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

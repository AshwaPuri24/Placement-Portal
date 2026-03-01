import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin, type User as ApiUser, type Role } from '../api/auth'

export type { Role }

interface User {
  id: string
  email: string
  name: string
  role: Role
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: Role) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const routes: Record<Role, string> = {
  student: '/student/dashboard',
  admin: '/admin/dashboard',
  recruiter: '/company/dashboard',
  hod: '/admin/dashboard',
}

function toUser(u: ApiUser): User {
  return {
    id: String(u.id),
    email: u.email,
    name: u.name || u.email.split('@')[0],
    role: u.role,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('placement_user')
    return stored ? JSON.parse(stored) : null
  })

  const navigate = useNavigate()

  const login = useCallback(
    async (email: string, password: string, _selectedRole: Role): Promise<void> => {
      const res = await apiLogin(email, password)
      const u = toUser(res.user)
      setUser(u)
      localStorage.setItem('placement_user', JSON.stringify(u))
      localStorage.setItem('placement_token', res.token)
      navigate(routes[u.role])
    },
    [navigate]
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('placement_user')
    localStorage.removeItem('placement_token')
    navigate('/')
  }, [navigate])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

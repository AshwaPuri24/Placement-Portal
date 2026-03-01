import { apiFetch } from './client'

export interface PortalUser {
  id: number
  name: string | null
  email: string
  role: 'student' | 'admin' | 'recruiter' | 'hod'
  createdAt: string
}

export async function getUsers(role?: string, q?: string): Promise<PortalUser[]> {
  const params = new URLSearchParams()
  if (role) params.set('role', role)
  if (q) params.set('q', q)
  const suffix = params.toString() ? `?${params.toString()}` : ''
  return apiFetch<PortalUser[]>(`/users${suffix}`)
}

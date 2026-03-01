import { apiFetch } from './client'

export type Role = 'student' | 'admin' | 'recruiter' | 'hod'

export interface User {
  id: number
  email: string
  name: string
  role: Role
}

export interface LoginResponse {
  token: string
  user: User
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(
  email: string,
  password: string,
  role: Role,
  name?: string
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, role, name }),
  })
}

import { apiFetch } from './client'

export interface StudentApplication {
  id: number
  jobId: number
  status: string
  appliedAt: string
  jobTitle: string
  company: string
}

export interface PortalApplication {
  id: number
  jobId: number
  studentId: number
  status: string
  appliedAt: string
  jobTitle: string
  company: string
  studentName: string
  studentEmail: string
}

export interface CreateApplicationResponse {
  id: number
  jobId: number
  studentId: number
  status: string
}

export async function applyToJob(jobId: number): Promise<CreateApplicationResponse> {
  return apiFetch<CreateApplicationResponse>('/applications', {
    method: 'POST',
    body: JSON.stringify({ jobId }),
  })
}

export async function getMyApplications(): Promise<StudentApplication[]> {
  return apiFetch<StudentApplication[]>('/applications/my')
}

export async function getApplications(jobId?: number): Promise<PortalApplication[]> {
  const suffix = jobId ? `?jobId=${jobId}` : ''
  return apiFetch<PortalApplication[]>(`/applications${suffix}`)
}

export async function updateApplicationStatus(
  applicationId: number,
  status: string
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

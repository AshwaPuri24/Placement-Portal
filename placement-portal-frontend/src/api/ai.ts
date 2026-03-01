import { apiFetch } from './client'

export interface GeneratedResume {
  summary: string
  skills: string[]
  experience: Array<{
    company: string
    role: string
    duration: string
    description: string
  }>
  projects: Array<{
    title: string
    description: string
    techStack: string
    githubLink?: string
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    grade?: string
  }>
}

export interface InterviewQuestions {
  difficulty: string
  technical: Array<{
    question: string
    difficulty: string
  }>
  behavioral: Array<{
    question: string
  }>
}

export async function generateResume(input: {
  linkedInUrl?: string
  profileText?: string
  save?: boolean
}): Promise<GeneratedResume> {
  return apiFetch<GeneratedResume>('/ai/generate-resume', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function generateInterviewQuestions(input: {
  role: string
  skills: string
}): Promise<InterviewQuestions> {
  return apiFetch<InterviewQuestions>('/ai/generate-questions', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}


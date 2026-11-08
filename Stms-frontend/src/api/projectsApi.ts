import type { CreateProjectData, Project } from '../types/project'

// Все запросы к серверу по проектам — только в этом файле.
// Адрес относительный: Vite перенаправляет /api на бэкенд (см. vite.config.ts).
const API_URL = '/api/projects'

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error(`Could not load projects (HTTP ${response.status})`)
  }
  return response.json()
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Could not create the project (HTTP ${response.status})`)
  }
  return response.json()
}

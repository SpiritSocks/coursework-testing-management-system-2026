// Первые четыре поля совпадают с ProjectDto на бэкенде.
// Статистики пока нет в API, поэтому эти поля необязательные (?).
export interface Project {
  id: number
  name: string
  description: string | null
  createdAt: string

  suiteCount?: number
  caseCount?: number
  runCount?: number
  lastRunPassed?: number // в процентах, 0–100
  lastRunFailed?: number // в процентах, 0–100
}

// Совпадает с CreateProjectDto на бэкенде.
export interface CreateProjectData {
  name: string
  description: string
}

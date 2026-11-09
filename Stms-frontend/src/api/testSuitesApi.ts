import type { CreateTestSuiteData, TestSuite } from '../types/testCase'

// Запросы по наборам тестов (TestSuitesController на бэкенде).

export async function getSuites(projectId: number): Promise<TestSuite[]> {
  const response = await fetch(`/api/projects/${projectId}/suites`)
  if (!response.ok) {
    throw new Error(`Could not load suites (HTTP ${response.status})`)
  }
  return response.json()
}

export async function createSuite(projectId: number, data: CreateTestSuiteData): Promise<TestSuite> {
  const response = await fetch(`/api/projects/${projectId}/suites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Could not create the suite (HTTP ${response.status})`)
  }
  return response.json()
}

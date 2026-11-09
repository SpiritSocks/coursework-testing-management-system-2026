import type { CreateTestCaseData, TestCase } from '../types/testCase'

// Запросы по тест-кейсам (TestCasesController на бэкенде).

export async function getCases(suiteId: number): Promise<TestCase[]> {
  const response = await fetch(`/api/suites/${suiteId}/cases`)
  if (!response.ok) {
    throw new Error(`Could not load test cases (HTTP ${response.status})`)
  }
  return response.json()
}

export async function createCase(suiteId: number, data: CreateTestCaseData): Promise<TestCase> {
  const response = await fetch(`/api/suites/${suiteId}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Could not create the test case (HTTP ${response.status})`)
  }
  return response.json()
}

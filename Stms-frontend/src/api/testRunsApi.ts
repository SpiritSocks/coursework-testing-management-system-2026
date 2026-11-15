import type { ResultStatus, TestRun, TestRunDetails } from '../types/testRun'

async function expectJson<T>(request: Promise<Response>, message: string): Promise<T> {
  const response = await request
  if (!response.ok) throw new Error(`${message} (HTTP ${response.status})`)
  return response.json()
}

export async function getRuns(projectId: number): Promise<TestRun[]> {
  return expectJson(fetch(`/api/projects/${projectId}/runs`), 'Could not load test runs')
}

export async function getRun(id: number): Promise<TestRunDetails> {
  return expectJson(fetch(`/api/runs/${id}`), 'Could not load the test run')
}

export async function createRun(projectId: number, name: string): Promise<TestRunDetails> {
  return expectJson(fetch(`/api/projects/${projectId}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }), 'Could not create the test run')
}

export async function updateResult(id: number, status: ResultStatus, comment: string): Promise<void> {
  const response = await fetch(`/api/results/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, comment }),
  })
  if (!response.ok) throw new Error(`Could not update the result (HTTP ${response.status})`)
}

export async function completeRun(id: number): Promise<void> {
  const response = await fetch(`/api/runs/${id}/complete`, { method: 'POST' })
  if (!response.ok) throw new Error(`Could not complete the test run (HTTP ${response.status})`)
}

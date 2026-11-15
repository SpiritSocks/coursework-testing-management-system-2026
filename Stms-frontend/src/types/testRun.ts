import type { ResultStatus } from './testCase'

export type { ResultStatus } from './testCase'

export interface TestRun {
  id: number
  projectId: number
  name: string
  startedAt: string
  completedAt: string | null
  createdByName: string | null
  totalCount: number
  executedCount: number
}

export interface TestRunResult {
  id: number
  testCaseId: number
  testSuiteId: number
  title: string
  suiteName: string
  preconditions: string | null
  steps: string
  expectedResult: string
  status: ResultStatus
  comment: string | null
}

export interface TestRunDetails extends TestRun {
  results: TestRunResult[]
}

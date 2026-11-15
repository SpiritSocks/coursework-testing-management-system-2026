export type ResultStatus = 'Untested' | 'Passed' | 'Failed' | 'Blocked' | 'Skipped'

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
  title: string
  suiteName: string
  status: ResultStatus
  comment: string | null
}

export interface TestRunDetails extends TestRun {
  results: TestRunResult[]
}

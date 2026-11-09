// Типы совпадают с DTO на бэкенде (Dtos/TestSuiteDto.cs, Dtos/TestCaseDto.cs).
// Priority приходит строкой, потому что в Program.cs подключён JsonStringEnumConverter.
export type Priority = 'Low' | 'Medium' | 'High'

export interface TestSuite {
  id: number
  projectId: number
  name: string
  description: string | null
  caseCount: number
  createdAt: string
}

export interface TestCase {
  id: number
  testSuiteId: number
  title: string
  preconditions: string | null
  steps: string // шаги в одном поле, по одному на строку
  expectedResult: string
  priority: Priority
  createdAt: string
}

// Совпадает с CreateTestSuiteDto
export interface CreateTestSuiteData {
  name: string
  description: string
}

// Совпадает с CreateTestCaseDto
export interface CreateTestCaseData {
  title: string
  preconditions: string
  steps: string
  expectedResult: string
  priority: Priority
}

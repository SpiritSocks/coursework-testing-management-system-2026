import { useEffect, useState } from 'react'
import { createSuite, getSuites } from '../api/testSuitesApi'
import { createCase, getCases } from '../api/testCasesApi'
import NewTestCaseForm from '../components/NewTestCaseForm'
import SuiteTree, { type PriorityFilter } from '../components/SuiteTree'
import TestCaseDetails from '../components/TestCaseDetails'
import { PlusIcon } from '../components/Icons'
import type { Project } from '../types/project'
import type { CreateTestCaseData, TestCase, TestSuite } from '../types/testCase'
import './ProjectsPage.css' // общие стили заголовка страницы и сообщений
import './TestCasesPage.css'

type TestCasesPageProps = {
  project: Project
  onBackToProjects: () => void
}

// API отдаёт кейсы по одному набору, поэтому сначала берём наборы проекта,
// а потом параллельно (Promise.all) кейсы каждого набора.
async function loadSuitesAndCases(projectId: number) {
  const suites = await getSuites(projectId)
  const casesPerSuite = await Promise.all(suites.map((suite) => getCases(suite.id)))
  return { suites, cases: casesPerSuite.flat() }
}

export default function TestCasesPage({ project, onBackToProjects }: TestCasesPageProps) {
  const [suites, setSuites] = useState<TestSuite[]>([])
  const [cases, setCases] = useState<TestCase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState<PriorityFilter>('All')
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Загружаем наборы и кейсы при открытии страницы
  useEffect(() => {
    loadSuitesAndCases(project.id)
      .then((data) => {
        setSuites(data.suites)
        setCases(data.cases)
      })
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setIsLoading(false))
  }, [project.id])

  async function handleCreateSuite(name: string) {
    const created = await createSuite(project.id, { name, description: '' })
    setSuites((current) => [...current, created])
  }

  async function handleCreateCase(suiteId: number, data: CreateTestCaseData) {
    const created = await createCase(suiteId, data)
    setCases((current) => [...current, created])
    setSelectedCaseId(created.id)
    setIsFormOpen(false)
  }

  // Фильтрация: поиск по названию или "TC-123", плюс фильтр по приоритету
  const searchText = search.trim().toLowerCase()
  const visibleCases = cases.filter(
    (c) =>
      (priority === 'All' || c.priority === priority) &&
      (c.title.toLowerCase().includes(searchText) ||
        `tc-${c.id}`.includes(searchText)),
  )

  // Выбранный кейс; если ничего не выбрано — первый видимый
  const selectedCase =
    visibleCases.find((c) => c.id === selectedCaseId) ?? visibleCases[0] ?? null
  const selectedSuite = suites.find((s) => s.id === selectedCase?.testSuiteId)

  return (
    <main className="test-cases-page">
      <header className="page-header">
        <div className="page-heading">
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <button type="button" className="breadcrumb-link" onClick={onBackToProjects}>
              Projects
            </button>
            <span aria-hidden="true">/</span>
            <span>{project.name}</span>
          </nav>
          <h1 className="page-title">Test cases</h1>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => setIsFormOpen(true)}
            disabled={suites.length === 0}
            title={suites.length === 0 ? 'Create a suite first' : undefined}
          >
            <PlusIcon />
            New case
          </button>
        </div>
      </header>

      {isFormOpen && (
        <NewTestCaseForm
          suites={suites}
          onSubmit={handleCreateCase}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isLoading && <p className="page-message">Loading test cases…</p>}

      {loadError && (
        <p className="page-message page-message-error" role="alert">
          {loadError}
        </p>
      )}

      {!isLoading && !loadError && (
        <div className="test-cases-layout">
          <SuiteTree
            suites={suites}
            cases={visibleCases}
            search={search}
            onSearchChange={setSearch}
            priority={priority}
            onPriorityChange={setPriority}
            selectedCaseId={selectedCase?.id ?? null}
            onSelectCase={(c) => setSelectedCaseId(c.id)}
            onCreateSuite={handleCreateSuite}
          />

          {selectedCase ? (
            <TestCaseDetails
              testCase={selectedCase}
              suiteName={selectedSuite?.name ?? ''}
            />
          ) : (
            <div className="case-empty">
              {suites.length === 0 && 'This project has no suites yet. Add one with "+ New suite".'}
              {suites.length > 0 && cases.length === 0 && 'No test cases yet. Create the first one with "New case".'}
              {cases.length > 0 && 'No cases match the search or filter.'}
            </div>
          )}
        </div>
      )}
    </main>
  )
}

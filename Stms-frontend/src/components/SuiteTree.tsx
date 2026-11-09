import { useState, type FormEvent } from 'react'
import type { Priority, TestCase, TestSuite } from '../types/testCase'
import { ChevronRightIcon, SearchIcon } from './Icons'
import './SuiteTree.css'

export type PriorityFilter = 'All' | Priority

const filters: PriorityFilter[] = ['All', 'High', 'Medium', 'Low']

type SuiteTreeProps = {
  suites: TestSuite[]
  cases: TestCase[] // уже отфильтрованные страницей
  search: string
  onSearchChange: (text: string) => void
  priority: PriorityFilter
  onPriorityChange: (priority: PriorityFilter) => void
  selectedCaseId: number | null
  onSelectCase: (testCase: TestCase) => void
  onCreateSuite: (name: string) => Promise<void>
}

// Левая колонка: поиск, фильтр по приоритету и дерево "набор -> кейсы".
export default function SuiteTree({
  suites,
  cases,
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  selectedCaseId,
  onSelectCase,
  onCreateSuite,
}: SuiteTreeProps) {
  // Id свёрнутых наборов. По умолчанию все развёрнуты.
  const [closedSuiteIds, setClosedSuiteIds] = useState<number[]>([])

  // Маленькая форма "+ New suite"
  const [isAddingSuite, setIsAddingSuite] = useState(false)
  const [suiteName, setSuiteName] = useState('')
  const [suiteError, setSuiteError] = useState<string | null>(null)

  function toggleSuite(suiteId: number) {
    setClosedSuiteIds((current) =>
      current.includes(suiteId)
        ? current.filter((id) => id !== suiteId)
        : [...current, suiteId],
    )
  }

  async function handleAddSuite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (suiteName.trim() === '') {
      setSuiteError('Please enter a suite name.')
      return
    }
    try {
      await onCreateSuite(suiteName.trim())
      setSuiteName('')
      setSuiteError(null)
      setIsAddingSuite(false)
    } catch (err) {
      setSuiteError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <section aria-label="Suites and cases" className="suite-tree">
      <label className="tree-search">
        <SearchIcon />
        <span className="visually-hidden">Search cases</span>
        <input
          type="search"
          placeholder="Search by title or TC-ID"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <div role="group" aria-label="Filter by priority" className="chip-row">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={f === priority ? 'chip active' : 'chip'}
            aria-pressed={f === priority}
            onClick={() => onPriorityChange(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="tree-summary">
        <span>{cases.length} cases · {suites.length} suites</span>
        <button type="button" className="link-button" onClick={() => setIsAddingSuite(true)}>
          + New suite
        </button>
      </div>

      {isAddingSuite && (
        <form className="new-suite-form" onSubmit={handleAddSuite}>
          <input
            className="field-input"
            type="text"
            value={suiteName}
            onChange={(e) => setSuiteName(e.target.value)}
            maxLength={200}
            placeholder="Suite name, e.g. Checkout"
            aria-label="Suite name"
            autoFocus
          />
          <button type="submit" className="button-primary small">Add</button>
          <button type="button" className="button-secondary small" onClick={() => setIsAddingSuite(false)}>
            Cancel
          </button>
          {suiteError && <p className="form-error" role="alert">{suiteError}</p>}
        </form>
      )}

      <div className="tree-list">
        {suites.map((suite) => {
          const isOpen = !closedSuiteIds.includes(suite.id)
          const suiteCases = cases.filter((c) => c.testSuiteId === suite.id)

          return (
            <div key={suite.id} className="tree-suite">
              <button
                type="button"
                className="suite-header"
                aria-expanded={isOpen}
                onClick={() => toggleSuite(suite.id)}
              >
                <span className={isOpen ? 'chevron open' : 'chevron'}>
                  <ChevronRightIcon />
                </span>
                <span className="suite-name">{suite.name}</span>
                <span className="suite-count">{suiteCases.length}</span>
              </button>

              {isOpen && suiteCases.map((testCase) => (
                <button
                  key={testCase.id}
                  type="button"
                  className={testCase.id === selectedCaseId ? 'case-row active' : 'case-row'}
                  aria-current={testCase.id === selectedCaseId}
                  onClick={() => onSelectCase(testCase)}
                >
                  <span className="case-id">TC-{testCase.id}</span>
                  <span className="case-title">{testCase.title}</span>
                  <span className={`priority-text priority-${testCase.priority}`}>
                    {testCase.priority === 'Medium' ? 'Med' : testCase.priority}
                  </span>
                </button>
              ))}

              {isOpen && suiteCases.length === 0 && (
                <p className="tree-empty">No cases here.</p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

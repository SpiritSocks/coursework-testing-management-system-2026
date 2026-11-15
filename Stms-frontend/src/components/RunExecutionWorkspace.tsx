import { useMemo, useState } from 'react'
import type { ResultStatus, TestRunResult } from '../types/testRun'
import './RunExecutionWorkspace.css'

type ExecutableStatus = Exclude<ResultStatus, 'Untested'>

type RunExecutionWorkspaceProps = {
  results: TestRunResult[]
  isCompleted: boolean
  onStatusChange: (resultId: number, status: ExecutableStatus) => void
  onCommentChange: (resultId: number, comment: string) => void
  onCommentSave: (resultId: number) => void
}

const statuses: ExecutableStatus[] = ['Passed', 'Failed', 'Blocked', 'Skipped']
const statusLabels: Record<ExecutableStatus, string> = {
  Passed: 'Pass', Failed: 'Fail', Blocked: 'Block', Skipped: 'Skip',
}

export default function RunExecutionWorkspace({
  results,
  isCompleted,
  onStatusChange,
  onCommentChange,
  onCommentSave,
}: RunExecutionWorkspaceProps) {
  const groups = useMemo(() => {
    const grouped = new Map<number, { id: number, name: string, results: TestRunResult[] }>()
    results.forEach((result) => {
      const suite = grouped.get(result.testSuiteId) ?? {
        id: result.testSuiteId,
        name: result.suiteName,
        results: [],
      }
      suite.results.push(result)
      grouped.set(result.testSuiteId, suite)
    })
    return Array.from(grouped.values())
  }, [results])

  const [selectedResultId, setSelectedResultId] = useState<number | null>(results[0]?.id ?? null)
  const [expandedSuites, setExpandedSuites] = useState<string[]>(groups[0] ? [groups[0].name] : [])
  const selectedResult = results.find((result) => result.id === selectedResultId) ?? results[0] ?? null

  function toggleSuite(name: string) {
    setExpandedSuites((current) => current.includes(name)
      ? current.filter((suiteName) => suiteName !== name)
      : [...current, name])
  }

  if (!selectedResult) {
    return <div className="run-workspace-empty">This project had no test cases when the run was created.</div>
  }

  const steps = selectedResult.steps
    .split('\n')
    .map((step) => step.trim().replace(/^\d+[.)]\s*/, ''))
    .filter(Boolean)

  return (
    <section className="run-workspace" aria-label="Test run execution">
      <div className="run-suite-list">
        {groups.map((suite) => {
          const isExpanded = expandedSuites.includes(suite.name)
          const executedCount = suite.results.filter((result) => result.status !== 'Untested').length
          return (
            <section key={suite.id} className="run-suite-group">
              <button type="button" className="run-suite-header" aria-expanded={isExpanded} onClick={() => toggleSuite(suite.name)}>
                <span className={isExpanded ? 'run-suite-chevron open' : 'run-suite-chevron'} aria-hidden="true">›</span>
                <strong>{suite.name}</strong>
                <span>{executedCount} of {suite.results.length}</span>
              </button>
              {isExpanded && <div className="run-suite-cases">
                {suite.results.map((result) => (
                  <button key={result.id} type="button"
                    className={result.id === selectedResult.id ? 'run-case-selector active' : 'run-case-selector'}
                    aria-pressed={result.id === selectedResult.id}
                    onClick={() => setSelectedResultId(result.id)}>
                    <span className="run-case-selector-id">TC-{result.testCaseId}</span>
                    <span className="run-case-selector-title">{result.title}</span>
                    <span className={`run-result-pill result-${result.status}`}>{result.status}</span>
                    <span className="run-case-selector-arrow" aria-hidden="true">›</span>
                  </button>
                ))}
              </div>}
            </section>
          )
        })}
      </div>

      <article className="run-case-execution" aria-label={`TC-${selectedResult.testCaseId}: ${selectedResult.title}`}>
        <header className="run-case-execution-title">
          <span>TC-{selectedResult.testCaseId}</span>
          <h2>{selectedResult.title}</h2>
          <span className={`run-result-pill result-${selectedResult.status}`}>{selectedResult.status}</span>
        </header>

        <div className="run-case-execution-body">
          <div className="run-case-instructions">
            <section>
              <h3>Preconditions</h3>
              <p>{selectedResult.preconditions || 'None.'}</p>
            </section>
            <section>
              <h3>Steps</h3>
              {steps.length > 0 ? <ol>{steps.map((step, index) => <li key={index}>{step}</li>)}</ol> : <p>No steps provided.</p>}
            </section>
            <section className="run-expected-result">
              <h3>Expected result</h3>
              <p>{selectedResult.expectedResult}</p>
            </section>
          </div>

          <aside className="run-case-outcome" aria-label="Test result">
            <h3>Test result</h3>
            <div className="run-outcome-buttons" role="group" aria-label={`Result for TC-${selectedResult.testCaseId}`}>
              {statuses.map((status) => (
                <button type="button" key={status}
                  className={selectedResult.status === status ? `active outcome-${status}` : ''}
                  aria-pressed={selectedResult.status === status}
                  disabled={isCompleted}
                  onClick={() => onStatusChange(selectedResult.id, status)}>
                  {statusLabels[status]}
                </button>
              ))}
            </div>
            <label className="run-comment-field">
              <span>Comment</span>
              <textarea value={selectedResult.comment ?? ''}
                onChange={(event) => onCommentChange(selectedResult.id, event.target.value)}
                onBlur={() => onCommentSave(selectedResult.id)}
                disabled={isCompleted}
                maxLength={2000}
                placeholder="Add execution notes" />
            </label>
          </aside>
        </div>
      </article>
    </section>
  )
}

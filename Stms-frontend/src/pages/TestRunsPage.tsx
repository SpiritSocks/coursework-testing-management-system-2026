import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { getProjects } from '../api/projectsApi'
import { completeRun, createRun, getRun, getRuns, updateResult } from '../api/testRunsApi'
import RunExecutionWorkspace from '../components/RunExecutionWorkspace'
import type { Project } from '../types/project'
import type { ResultStatus, TestRun, TestRunDetails } from '../types/testRun'
import './TestRunsPage.css'

type TestRunsPageProps = { initialProject: Project | null, initialRunId?: number | null }

const resultStatuses: Exclude<ResultStatus, 'Untested'>[] = ['Passed', 'Failed', 'Blocked', 'Skipped']

export default function TestRunsPage({ initialProject, initialRunId }: TestRunsPageProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState(initialProject?.id ?? 0)
  const [runs, setRuns] = useState<TestRun[]>([])
  const [run, setRun] = useState<TestRunDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newRunName, setNewRunName] = useState('')

  useEffect(() => {
    getProjects()
      .then((items) => {
        setProjects(items)
        setProjectId((current) => current || items[0]?.id || 0)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!projectId) return
    getRuns(projectId)
      .then(async (items) => {
        setError(null)
        setRuns(items)
        const selected = items.find((item) => item.id === initialRunId) ?? items[0]
        setRun(selected ? await getRun(selected.id) : null)
      })
      .catch((err: Error) => setError(err.message))
  }, [projectId, initialRunId])

  const project = projects.find((item) => item.id === projectId) ?? initialProject
  const counts = useMemo(() => {
    const value: Record<ResultStatus, number> = { Passed: 0, Failed: 0, Blocked: 0, Skipped: 0, Untested: 0 }
    run?.results.forEach((result) => { value[result.status] += 1 })
    return value
  }, [run])
  const total = run?.results.length ?? 0
  const executed = total - counts.Untested
  const passRate = executed ? Math.round((counts.Passed * 100) / executed) : 0

  async function selectRun(id: number) {
    setError(null)
    try { setRun(await getRun(id)) } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.') }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!projectId || !newRunName.trim()) return
    setError(null)
    try {
      const created = await createRun(projectId, newRunName.trim())
      setRuns((current) => [created, ...current])
      setRun(created)
      setNewRunName('')
      setIsCreating(false)
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.') }
  }

  async function changeStatus(resultId: number, status: Exclude<ResultStatus, 'Untested'>) {
    if (!run || run.completedAt) return
    const result = run.results.find((item) => item.id === resultId)
    if (!result) return
    const nextStatus: ResultStatus = result.status === status ? 'Untested' : status
    try {
      await updateResult(resultId, nextStatus, result.comment ?? '')
      setRun({ ...run, results: run.results.map((item) => item.id === resultId ? { ...item, status: nextStatus } : item) })
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.') }
  }

  function changeComment(resultId: number, comment: string) {
    if (!run) return
    setRun({ ...run, results: run.results.map((item) => item.id === resultId ? { ...item, comment } : item) })
  }

  async function saveComment(resultId: number) {
    const result = run?.results.find((item) => item.id === resultId)
    if (!result || run?.completedAt) return
    try { await updateResult(result.id, result.status, result.comment ?? '') }
    catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.') }
  }

  async function handleComplete() {
    if (!run) return
    try {
      await completeRun(run.id)
      const completedAt = new Date().toISOString()
      setRun({ ...run, completedAt })
      setRuns((current) => current.map((item) => item.id === run.id ? { ...item, completedAt } : item))
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.') }
  }

  return (
    <main className="runs-page">
      <nav className="runs-breadcrumb" aria-label="Breadcrumb"><span>Projects</span><span>/</span><span>{project?.name ?? 'Test runs'}</span><span>/</span><span>Test runs</span></nav>

      <section className="runs-controls" aria-label="Choose a test run">
        <label><span>Project</span><select value={projectId} onChange={(event) => setProjectId(Number(event.target.value))}>
          {projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select></label>
        <label><span>Run</span><select value={run?.id ?? ''} onChange={(event) => selectRun(Number(event.target.value))} disabled={!runs.length}>
          {!runs.length && <option value="">No runs yet</option>}
          {runs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select></label>
        <button className="button-secondary" type="button" disabled={!projectId} onClick={() => setIsCreating(true)}>New run</button>
      </section>

      {isCreating && <form className="new-run-form" onSubmit={handleCreate}>
        <label><span>Run name</span><input value={newRunName} onChange={(event) => setNewRunName(event.target.value)} maxLength={200} autoFocus placeholder="e.g. Regression — Sprint 12" /></label>
        <button type="button" className="button-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
        <button type="submit" className="button-primary" disabled={!newRunName.trim()}>Create run</button>
      </form>}

      {isLoading && <p className="page-message">Loading projects…</p>}
      {error && <p className="page-message page-message-error" role="alert">{error}</p>}
      {!isLoading && projects.length === 0 && <p className="runs-empty">Create a project and test cases before starting a test run.</p>}
      {!isLoading && projects.length > 0 && !run && !error && <p className="runs-empty">No test runs in this project yet. Create the first one.</p>}

      {run && <>
        <header className="run-header">
          <div><div className="run-title-row"><h1>{run.name}</h1><span className={run.completedAt ? 'run-state complete' : 'run-state'}>{run.completedAt ? 'Completed' : 'In progress'}</span></div>
          <p>Started {new Date(run.startedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}{run.createdByName ? ` by ${run.createdByName}` : ''}</p></div>
          {!run.completedAt && <button type="button" className="button-primary" onClick={handleComplete}>Complete run</button>}
        </header>

        <section className="run-progress" aria-label="Run progress">
          <div className="run-progress-heading"><strong>{executed} of {total} executed</strong><b>{passRate}% passed</b></div>
          <div className="run-progress-bar">{resultStatuses.map((status) => <span key={status} className={`segment segment-${status}`} style={{ width: total ? `${counts[status] * 100 / total}%` : 0 }} />)}</div>
          <div className="run-legend">{([...resultStatuses, 'Untested'] as ResultStatus[]).map((status) => <span key={status}><i className={`dot dot-${status}`} />{status} <strong>{counts[status]}</strong></span>)}</div>
        </section>

        <RunExecutionWorkspace
          key={run.id}
          results={run.results}
          isCompleted={Boolean(run.completedAt)}
          onStatusChange={changeStatus}
          onCommentChange={changeComment}
          onCommentSave={saveComment}
        />
      </>}
    </main>
  )
}

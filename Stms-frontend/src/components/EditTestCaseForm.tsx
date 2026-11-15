import { useState, type FormEvent } from 'react'
import type { Priority, TestCase, TestSuite, UpdateTestCaseData } from '../types/testCase'
import { formatDate } from '../utils/formatDate'
import './EditTestCaseForm.css'

type EditTestCaseFormProps = {
  testCase: TestCase
  suites: TestSuite[]
  projectName: string
  onSave: (data: UpdateTestCaseData) => Promise<void>
  onDelete: () => Promise<void>
  onCancel: () => void
}

const priorities: Priority[] = ['Low', 'Medium', 'High']

export default function EditTestCaseForm({
  testCase,
  suites,
  projectName,
  onSave,
  onDelete,
  onCancel,
}: EditTestCaseFormProps) {
  const [suiteId, setSuiteId] = useState(testCase.testSuiteId)
  const [title, setTitle] = useState(testCase.title)
  const [priority, setPriority] = useState<Priority>(testCase.priority)
  const [preconditions, setPreconditions] = useState(testCase.preconditions ?? '')
  const [steps, setSteps] = useState(testCase.steps)
  const [expectedResult, setExpectedResult] = useState(testCase.expectedResult)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const selectedSuite = suites.find((suite) => suite.id === suiteId)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !steps.trim() || !expectedResult.trim()) {
      setError('Title, steps and expected result are required.')
      return
    }

    setError(null)
    setIsSaving(true)
    try {
      await onSave({
        testSuiteId: suiteId,
        title: title.trim(),
        priority,
        preconditions: preconditions.trim(),
        steps: steps.trim(),
        expectedResult: expectedResult.trim(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete TC-${testCase.id}? This action cannot be undone.`)) return
    setError(null)
    setIsDeleting(true)
    try {
      await onDelete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setIsDeleting(false)
    }
  }

  return (
    <section className="edit-case-page" aria-label={`Edit TC-${testCase.id}`}>
      <nav aria-label="Breadcrumb" className="edit-case-breadcrumb">
        <span>{projectName}</span><span aria-hidden="true">/</span>
        <span>{selectedSuite?.name ?? 'Suite'}</span><span aria-hidden="true">/</span>
        <span>TC-{testCase.id}</span>
      </nav>

      <form id="edit-case-form" className="edit-case-content" onSubmit={handleSubmit}>
        <header className="edit-case-header">
          <h2>Edit test case</h2>
          <div className="edit-case-actions">
            <button type="button" className="button-danger" onClick={handleDelete} disabled={isDeleting || isSaving}>
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
            <button type="button" className="button-secondary" onClick={onCancel} disabled={isDeleting || isSaving}>Cancel</button>
            <button type="submit" className="button-primary" disabled={isDeleting || isSaving}>
              {isSaving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </header>

        <div className="edit-case-columns">
          <div className="edit-case-fields">
            <label className="edit-field edit-field-wide">
              <span>Title <b>*</b></span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={300} autoFocus />
            </label>

            <label className="edit-field">
              <span>Suite</span>
              <select value={suiteId} onChange={(event) => setSuiteId(Number(event.target.value))}>
                {suites.map((suite) => <option key={suite.id} value={suite.id}>{suite.name}</option>)}
              </select>
            </label>

            <fieldset className="edit-priority">
              <legend>Priority</legend>
              <div>
                {priorities.map((item) => (
                  <button key={item} type="button" className={priority === item ? 'active' : ''}
                    aria-pressed={priority === item} onClick={() => setPriority(item)}>{item}</button>
                ))}
              </div>
            </fieldset>

            <label className="edit-field edit-field-wide">
              <span>Preconditions</span>
              <textarea value={preconditions} onChange={(event) => setPreconditions(event.target.value)} maxLength={2000} rows={2} />
            </label>
            <label className="edit-field edit-field-wide">
              <span>Steps <b>*</b></span>
              <textarea value={steps} onChange={(event) => setSteps(event.target.value)} rows={5} />
            </label>
            <label className="edit-field edit-field-wide">
              <span>Expected result <b>*</b></span>
              <textarea value={expectedResult} onChange={(event) => setExpectedResult(event.target.value)} rows={2} />
            </label>
            {error && <p className="form-error edit-field-wide" role="alert">{error}</p>}
          </div>

          <aside className="edit-case-side" aria-label="Case details">
            <section>
              <h3>Details</h3>
              <div><span>ID</span><strong>TC-{testCase.id}</strong></div>
              <div><span>Created</span><strong>{formatDate(testCase.createdAt)}</strong></div>
              <div><span>Project</span><strong>{projectName}</strong></div>
            </section>
            <section>
              <h3>Recent results</h3>
              <p>Run history is not available yet.</p>
            </section>
          </aside>
        </div>
      </form>
    </section>
  )
}

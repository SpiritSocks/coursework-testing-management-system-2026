import { useState, type FormEvent } from 'react'
import type { CreateTestCaseData, Priority, TestSuite } from '../types/testCase'
// Те же стили полей и кнопок, что у формы нового проекта
import './NewProjectForm.css'

type NewTestCaseFormProps = {
  suites: TestSuite[]
  onSubmit: (suiteId: number, data: CreateTestCaseData) => Promise<void>
  onCancel: () => void
}

export default function NewTestCaseForm({ suites, onSubmit, onCancel }: NewTestCaseFormProps) {
  const [suiteId, setSuiteId] = useState(suites[0]?.id ?? 0)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [preconditions, setPreconditions] = useState('')
  const [steps, setSteps] = useState('')
  const [expectedResult, setExpectedResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Те же правила, что в CreateTestCaseDto на бэкенде
    if (title.trim() === '' || steps.trim() === '' || expectedResult.trim() === '') {
      setError('Title, steps and expected result are required.')
      return
    }

    setError(null)
    setIsSaving(true)
    try {
      await onSubmit(suiteId, {
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

  return (
    <form className="new-project-form" onSubmit={handleSubmit}>
      <h2 className="new-project-title">New test case</h2>

      <label className="field">
        <span className="field-label">Suite</span>
        <select className="field-input" value={suiteId} onChange={(e) => setSuiteId(Number(e.target.value))}>
          {suites.map((suite) => (
            <option key={suite.id} value={suite.id}>{suite.name}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">Title</span>
        <input
          className="field-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={300}
          placeholder="e.g. Payment is declined for an expired card"
          autoFocus
        />
      </label>

      <label className="field">
        <span className="field-label">Priority</span>
        <select className="field-input" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>

      <label className="field">
        <span className="field-label">Preconditions (optional)</span>
        <textarea
          className="field-input"
          value={preconditions}
          onChange={(e) => setPreconditions(e.target.value)}
          maxLength={2000}
          rows={2}
        />
      </label>

      <label className="field">
        <span className="field-label">Steps (one per line)</span>
        <textarea
          className="field-input"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          rows={4}
          placeholder={'Open the cart\nClick "Checkout"'}
        />
      </label>

      <label className="field">
        <span className="field-label">Expected result</span>
        <textarea
          className="field-input"
          value={expectedResult}
          onChange={(e) => setExpectedResult(e.target.value)}
          rows={2}
        />
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-buttons">
        <button type="button" className="button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button-primary" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Create case'}
        </button>
      </div>
    </form>
  )
}

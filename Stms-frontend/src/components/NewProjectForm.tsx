import { useState, type FormEvent } from 'react'
import type { CreateProjectData } from '../types/project'
import './NewProjectForm.css'

type NewProjectFormProps = {
  onSubmit: (data: CreateProjectData) => Promise<void>
  onCancel: () => void
}

export default function NewProjectForm({ onSubmit, onCancel }: NewProjectFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // не перезагружать страницу

    // Те же правила, что в CreateProjectDto на бэкенде
    if (name.trim() === '') {
      setError('Please enter a project name.')
      return
    }

    setError(null)
    setIsSaving(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setIsSaving(false)
    }
  }

  return (
    <form className="new-project-form" onSubmit={handleSubmit}>
      <h2 className="new-project-title">New project</h2>

      <label className="field">
        <span className="field-label">Name</span>
        <input
          className="field-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
          placeholder="e.g. Online shop"
          autoFocus
        />
      </label>

      <label className="field">
        <span className="field-label">Description (optional)</span>
        <textarea
          className="field-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="What is this product?"
        />
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-buttons">
        <button type="button" className="button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button-primary" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Create project'}
        </button>
      </div>
    </form>
  )
}

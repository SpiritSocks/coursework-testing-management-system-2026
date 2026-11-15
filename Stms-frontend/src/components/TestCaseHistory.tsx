import type { TestCaseHistoryItem } from '../types/testCase'
import './TestCaseHistory.css'

type TestCaseHistoryProps = {
  history: TestCaseHistoryItem[] | undefined
  onOpenRun: (runId: number) => void
  limit?: number
  error?: string
}

function formatHistoryDate(item: TestCaseHistoryItem) {
  const value = item.executedAt ?? item.completedAt ?? item.startedAt
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function TestCaseHistory({ history, onOpenRun, limit = 5, error }: TestCaseHistoryProps) {
  if (error) return <p className="history-message history-error">{error}</p>
  if (!history) return <p className="history-message">Loading…</p>
  if (history.length === 0) return <p className="history-message">No runs yet.</p>

  return (
    <div className="case-history-list">
      {history.slice(0, limit).map((item) => (
        <button key={item.resultId} type="button" className="case-history-row" onClick={() => onOpenRun(item.runId)}>
          <span className="history-copy">
            <strong>{item.runName}</strong>
            <small>{formatHistoryDate(item)}{item.comment ? ` · ${item.comment}` : ''}</small>
          </span>
          <span className={`history-status history-status-${item.status}`}>{item.status}</span>
        </button>
      ))}
    </div>
  )
}

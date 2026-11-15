import type { TestCaseHistoryItem } from '../types/testCase'
import './TestCaseHistory.css'

type TestCaseHistoryProps = {
  history: TestCaseHistoryItem[] | undefined
  onOpenRun: (runId: number) => void
  error?: string
  label?: string
}

function formatHistoryDate(item: TestCaseHistoryItem) {
  const value = item.executedAt ?? item.completedAt ?? item.startedAt
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function TestCaseHistory({ history, onOpenRun, error, label = 'Run history' }: TestCaseHistoryProps) {
  return (
    <details className="case-history-dropdown">
      <summary>
        <span>{label}</span>
        <span className="history-count">{history ? history.length : '…'}</span>
      </summary>
      <div className="case-history-content">
        {error && <p className="history-message history-error">{error}</p>}
        {!error && !history && <p className="history-message">Loading…</p>}
        {!error && history?.length === 0 && <p className="history-message">No runs yet.</p>}
        {!error && history && history.length > 0 && <div className="case-history-list">
          {history.map((item) => (
            <button key={item.resultId} type="button" className="case-history-row" onClick={() => onOpenRun(item.runId)}>
              <span className="history-copy">
                <strong>{item.runName}</strong>
                <small>{formatHistoryDate(item)}{item.comment ? ` · ${item.comment}` : ''}</small>
              </span>
              <span className={`history-status history-status-${item.status}`}>{item.status}</span>
            </button>
          ))}
        </div>}
      </div>
    </details>
  )
}

import type { TestCase } from '../types/testCase'
import { formatDate } from '../utils/formatDate'
import { CheckCircleIcon } from './Icons'
import './TestCaseDetails.css'

type TestCaseDetailsProps = {
  testCase: TestCase
  suiteName: string
}

// Правая колонка: всё о выбранном кейсе.
export default function TestCaseDetails({ testCase, suiteName }: TestCaseDetailsProps) {
  // Шаги хранятся одной строкой, каждый шаг на новой строке.
  // Пустые строки отбрасываем.
  const steps = testCase.steps
    .split('\n')
    .map((step) => step.trim())
    .filter((step) => step !== '')

  return (
    <article aria-label="Test case" className="case-details">
      <div className="case-details-top">
        <div className="case-badges">
          <span className="case-id case-id-badge">TC-{testCase.id}</span>
          <span className={`priority-badge priority-${testCase.priority}`}>
            {testCase.priority} priority
          </span>
          <span className="case-suite">in {suiteName}</span>
        </div>
        <h2 className="case-details-title">{testCase.title}</h2>
      </div>

      <div className="case-details-body">
        <div className="case-details-main">
          <section className="case-section">
            <h3 className="section-label">Preconditions</h3>
            <p className="case-text">{testCase.preconditions || 'None.'}</p>
          </section>

          <section className="case-section">
            <h3 className="section-label">Steps</h3>
            <ol className="step-list">
              {steps.map((step, index) => (
                <li key={index} className="step">
                  <span className="step-number">{index + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="expected-box">
            <CheckCircleIcon />
            <div className="case-section">
              <h3 className="section-label expected-label">Expected result</h3>
              <p className="case-text">{testCase.expectedResult}</p>
            </div>
          </section>
        </div>

        <aside aria-label="Case details" className="case-meta">
          <div className="meta-item">
            <span className="meta-label">Suite</span>
            <span>{suiteName}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Priority</span>
            <span>{testCase.priority}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created</span>
            <span>{formatDate(testCase.createdAt)}</span>
          </div>
          {/* История прогонов появится, когда на бэкенде будет API для TestRun/TestResult */}
          <div className="meta-item">
            <span className="meta-label">Run history</span>
            <span className="meta-muted">Not available yet</span>
          </div>
        </aside>
      </div>
    </article>
  )
}

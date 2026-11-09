import type { Project } from '../types/project'
import { formatDate } from '../utils/formatDate'
import './ProjectCard.css'

type ProjectCardProps = {
  project: Project
  onOpen: (project: Project) => void
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const passed = project.lastRunPassed ?? 0
  const failed = project.lastRunFailed ?? 0
  const runCount = project.runCount ?? 0

  return (
    <button type="button" className="project-card" onClick={() => onOpen(project)}>
      <div className="project-card-top">
        <h2 className="project-card-name">{project.name}</h2>
        <span className="project-card-date">{formatDate(project.createdAt)}</span>
      </div>

      <p className="project-card-description">
        {project.description || 'No description yet.'}
      </p>

      <div className="project-card-stats">
        <span><strong>{project.suiteCount ?? 0}</strong> suites</span>
        <span><strong>{project.caseCount ?? 0}</strong> cases</span>
        <span><strong>{runCount}</strong> runs</span>
      </div>

      <div className="project-card-run">
        <div className="project-card-run-label">
          <span>Last run</span>
          {runCount > 0 ? (
            <span className="project-card-pass">{passed}% passed</span>
          ) : (
            <span>No runs yet</span>
          )}
        </div>
        <div className="progress" aria-hidden="true">
          <div className="progress-passed" style={{ width: `${passed}%` }} />
          <div className="progress-failed" style={{ width: `${failed}%` }} />
        </div>
      </div>
    </button>
  )
}

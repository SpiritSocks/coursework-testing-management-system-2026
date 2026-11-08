import { useEffect, useState } from "react";
import { createProject, getProjects } from "../api/projectsApi";
import NewProjectForm from "../components/NewProjectForm";
import ProjectCard from "../components/ProjectCard";
import { PlusIcon, SearchIcon } from "../components/Icons";
import type { CreateProjectData, Project } from "../types/project";
import "./ProjectsPage.css";

type ProjectsPageProps = {
  onOpenProject: (project: Project) => void;
};

export default function ProjectsPage({ onOpenProject }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Загружаем проекты один раз при открытии страницы
  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data))
      .catch((err: Error) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleCreate(data: CreateProjectData) {
    const created = await createProject(data);
    setProjects((current) => [...current, created]);
    setIsFormOpen(false);
  }

  const searchText = search.trim().toLowerCase();
  const visibleProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchText) ||
      (p.description ?? "").toLowerCase().includes(searchText),
  );

  return (
    <main className="projects-page">
      <header className="page-header">
        <div className="page-heading">
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            All products under test. Open one to manage its suites and runs.
          </p>
        </div>

        <div className="page-actions">
          <label className="search-box">
            <SearchIcon />
            <span className="visually-hidden">Search projects</span>
            <input
              type="search"
              placeholder="Search projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="button-primary"
            onClick={() => setIsFormOpen(true)}
          >
            <PlusIcon />
            New project
          </button>
        </div>
      </header>

      {isFormOpen && (
        <NewProjectForm
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isLoading && <p className="page-message">Loading projects…</p>}

      {loadError && (
        <p className="page-message page-message-error" role="alert">
          {loadError}
        </p>
      )}

      {!isLoading && !loadError && visibleProjects.length === 0 && (
        <p className="page-message">
          {search
            ? `No projects match "${search}".`
            : "No projects yet. Create the first one."}
        </p>
      )}

      <section aria-label="Project list" className="project-grid">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={onOpenProject}
          />
        ))}
      </section>
    </main>
  );
}

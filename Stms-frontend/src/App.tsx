import { useState } from "react";
import Sidebar, { type PageName } from "./components/Sidebar";
import ProjectsPage from "./pages/ProjectsPage";
import TestCasesPage from "./pages/TestCasesPage";
import TestRunsPage from "./pages/TestRunsPage";
import type { Project } from "./types/project";
import "./App.css";

function App() {
  // Простое переключение страниц; позже можно заменить на React Router
  const [activePage, setActivePage] = useState<PageName>("projects");
  // Проект, открытый на странице Projects; от него зависят тест-кейсы
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  function openProject(project: Project) {
    setCurrentProject(project);
    setActivePage("cases");
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {activePage === "projects" && <ProjectsPage onOpenProject={openProject} />}

      {/* key: при смене проекта страница создаётся заново и грузит свои данные */}
      {activePage === "cases" && currentProject && (
        <TestCasesPage
          key={currentProject.id}
          project={currentProject}
          onBackToProjects={() => setActivePage("projects")}
        />
      )}

      {activePage === "cases" && !currentProject && (
        <main className="placeholder-page">
          <h1 className="page-title">Test cases</h1>
          <p className="page-subtitle">Open a project first to see its test cases.</p>
          <button
            type="button"
            className="button-secondary placeholder-button"
            onClick={() => setActivePage("projects")}
          >
            Go to projects
          </button>
        </main>
      )}

      {activePage === "runs" && <TestRunsPage initialProject={currentProject} />}
    </div>
  );
}

export default App;

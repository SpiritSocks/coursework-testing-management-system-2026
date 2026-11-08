import { useState } from 'react'
import Sidebar, { type PageName } from './components/Sidebar'
import ProjectsPage from './pages/ProjectsPage'
import './App.css'

// Позже пользователь будет браться из JWT после входа
const currentUser = { name: 'Anna Testova', role: 'Tester' }

function App() {
  // Простое переключение страниц; позже можно заменить на React Router
  const [activePage, setActivePage] = useState<PageName>('projects')

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        userName={currentUser.name}
        userRole={currentUser.role}
      />

      {activePage === 'projects' && (
        <ProjectsPage onOpenProject={() => setActivePage('cases')} />
      )}

      {activePage !== 'projects' && (
        <main className="placeholder-page">
          <h1 className="page-title">
            {activePage === 'cases' ? 'Test cases' : 'Test runs'}
          </h1>
          <p className="page-subtitle">This page is not built yet.</p>
        </main>
      )}
    </div>
  )
}

export default App

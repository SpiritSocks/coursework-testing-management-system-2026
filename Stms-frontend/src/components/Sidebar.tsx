import type { ReactNode } from 'react'
import { CheckIcon, FolderIcon, LayersIcon, PlayIcon } from './Icons'
import './Sidebar.css'

// Пока готова только страница "projects".
export type PageName = 'projects' | 'cases' | 'runs'

type NavItem = {
  page: PageName
  label: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  { page: 'projects', label: 'Projects', icon: <FolderIcon /> },
  { page: 'cases', label: 'Test cases', icon: <LayersIcon /> },
  { page: 'runs', label: 'Test runs', icon: <PlayIcon /> },
]

type SidebarProps = {
  activePage: PageName
  onNavigate: (page: PageName) => void
  userName: string
  userRole: string
}

export default function Sidebar({ activePage, onNavigate, userName, userRole }: SidebarProps) {
  // "Anna Testova" -> "AT"
  const initials = userName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <CheckIcon />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">STMS</span>
          <span className="sidebar-logo-caption">Test management</span>
        </div>
      </div>

      <nav aria-label="Main" className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.page}
            type="button"
            className={item.page === activePage ? 'nav-item active' : 'nav-item'}
            aria-current={item.page === activePage ? 'page' : undefined}
            onClick={() => onNavigate(item.page)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{initials}</div>
        <div className="sidebar-user-text">
          <span className="sidebar-user-name">{userName}</span>
          <span className="sidebar-user-role">{userRole}</span>
        </div>
      </div>
    </aside>
  )
}

import { NavLink, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface SidebarItem {
  to: string
  icon: string
  label: string
  end?: boolean
}

const items: SidebarItem[] = [
  { to: '/admin', icon: 'bi-speedometer2', label: 'Dashboard', end: true },
  { to: '/admin/books', icon: 'bi-journal-bookmark', label: 'Manage Books' },
  { to: '/admin/users', icon: 'bi-people', label: 'Users' },
  { to: '/admin/borrowed', icon: 'bi-arrow-left-right', label: 'Borrowed Books' },
  { to: '/admin/reports', icon: 'bi-bar-chart', label: 'Reports' },
  { to: '/admin/settings', icon: 'bi-gear', label: 'Settings' },
]

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Logout?',
      text: 'Do you want to end the librarian session?',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      confirmButtonColor: '#dc3545',
    })

    if (!result.isConfirmed) return

    logout()
    localStorage.removeItem('currentUserName')
    toast.success('Logged out successfully.')
    navigate('/')
  }

  return (
    <aside className={`admin-sidebar-fixed ${collapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <span className="admin-logo-icon"><i className="bi bi-building" /></span>
          {!collapsed && (
            <span>
              <strong className="d-block">LRMS</strong>
              <small>Librarian Dashboard</small>
            </span>
          )}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-light"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`} />
        </button>
      </div>

      <nav className="admin-nav-links">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <i className={`bi ${item.icon}`} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="btn admin-sidebar-logout" onClick={handleLogout}>
        <i className="bi bi-box-arrow-left" />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  )
}

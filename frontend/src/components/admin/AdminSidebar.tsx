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

const navItems: SidebarItem[] = [
  { to: '/admin', icon: 'bi-speedometer2', label: 'Dashboard', end: true },
  { to: '/admin/inventory', icon: 'bi-journal-bookmark', label: 'Books' },
  { to: '/admin/users', icon: 'bi-people', label: 'Users' },
  { to: '/admin/borrow-requests', icon: 'bi-hand-index', label: 'Borrow Requests' },
  { to: '/admin/reports', icon: 'bi-bar-chart-line', label: 'Reports' },
  { to: '/admin/settings', icon: 'bi-sliders', label: 'Settings' },
]

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Logout?',
      text: 'Do you want to end your session?',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      confirmButtonColor: '#ff5a5f',
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
        <div className="admin-logo" title="Libris Admin">
          <span className="admin-logo-icon">
            <i className="bi bi-building" />
          </span>
          <span>
            <strong>Libris</strong>
            <small>Admin</small>
          </span>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={onToggle}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`} />
        </button>
      </div>

      <nav className="admin-nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" className="admin-sidebar-logout" onClick={handleLogout} title="Logout">
        <i className="bi bi-box-arrow-left" />
        <span>Logout</span>
      </button>
    </aside>
  )
}

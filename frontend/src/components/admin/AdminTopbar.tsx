import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

interface AdminAlert {
  id: string
  text: string
  time: string
  read: boolean
}

const titleByRoute: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/books': 'Manage Books',
  '/admin/users': 'Users',
  '/admin/borrowed': 'Borrowed Books',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
}

function getAdminNameFromStorage() {
  const directName = localStorage.getItem('currentUserName')
  if (directName && directName.trim()) return directName.trim()

  const rawCurrentUser = localStorage.getItem('currentUser')
  if (!rawCurrentUser) return 'Librarian'

  try {
    const parsed = JSON.parse(rawCurrentUser) as { name?: string; username?: string; email?: string }
    if (parsed?.name && parsed.name.trim()) return parsed.name.trim()
    if (parsed?.username && parsed.username.trim()) return parsed.username.trim()
    if (parsed?.email && parsed.email.trim()) return parsed.email.trim()
  } catch {
    return 'Librarian'
  }

  return 'Librarian'
}

export default function AdminTopbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()

  const notificationsRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)

  const [adminName, setAdminName] = useState('Librarian')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [alerts, setAlerts] = useState<AdminAlert[]>([
    { id: 'a-1', text: '3 new users registered today.', time: '2m ago', read: false },
    { id: 'a-2', text: '8 books are overdue for return.', time: '15m ago', read: false },
    { id: 'a-3', text: 'Inventory sync completed successfully.', time: '1h ago', read: true },
  ])

  // Keep admin name in sync with local storage updates and route changes.
  useEffect(() => {
    let mounted = true

    const loadAdminName = async () => {
      await new Promise((resolve) => setTimeout(resolve, 120))
      if (mounted) setAdminName(getAdminNameFromStorage())
    }

    const syncFromStorage = () => {
      if (mounted) setAdminName(getAdminNameFromStorage())
    }

    loadAdminName()
    window.addEventListener('storage', syncFromStorage)

    return () => {
      mounted = false
      window.removeEventListener('storage', syncFromStorage)
    }
  }, [location.pathname])

  // Close dropdowns when user clicks outside each menu container.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const targetNode = event.target as Node
      if (notificationsRef.current && !notificationsRef.current.contains(targetNode)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(targetNode)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    setShowNotifications(false)
    setShowProfileMenu(false)
  }, [location.pathname])

  const pageTitle = useMemo(() => {
    if (titleByRoute[location.pathname]) return titleByRoute[location.pathname]
    if (location.pathname.startsWith('/admin/books')) return 'Manage Books'
    if (location.pathname.startsWith('/admin/users')) return 'Users'
    if (location.pathname.startsWith('/admin/borrowed')) return 'Borrowed Books'
    if (location.pathname.startsWith('/admin/reports')) return 'Reports'
    if (location.pathname.startsWith('/admin/settings')) return 'Settings'
    return 'Librarian Panel'
  }, [location.pathname])

  const unreadCount = useMemo(() => alerts.filter((alert) => !alert.read).length, [alerts])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) return
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
    toast.info(`Searching "${trimmedQuery}" across books, users, and records.`)
  }

  const handleToggleNotifications = () => {
    setShowNotifications((previous) => !previous)
    setShowProfileMenu(false)
    setAlerts((previousAlerts) => previousAlerts.map((alert) => ({ ...alert, read: true })))
  }

  const handleToggleProfileMenu = () => {
    setShowProfileMenu((previous) => !previous)
    setShowNotifications(false)
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Logout?',
      text: 'Do you want to end your librarian session?',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      confirmButtonColor: '#dc3545',
    })

    if (!result.isConfirmed) return

    logout()
    localStorage.removeItem('currentUserName')
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  return (
    <header className="admin-navbar card border-0 shadow-sm">
      <div className="admin-navbar-body">
        <section className="admin-navbar-left">
          <p className="admin-navbar-caption mb-1">Library Information Retrieval System</p>
          <h4 className="admin-navbar-title mb-0">{pageTitle}</h4>
        </section>

        <section className="admin-navbar-center">
          <form className="admin-global-search" onSubmit={handleSearchSubmit}>
            <i className="bi bi-search" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search books, users, and records..."
              aria-label="Global search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </form>
        </section>

        <section className="admin-navbar-right">
          <button type="button" className="btn btn-primary btn-sm admin-quick-action" onClick={() => navigate('/admin/books')}>
            <i className="bi bi-plus-lg me-1" />
            <span>Add Book</span>
          </button>

          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'} me-1`} />
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <div className="admin-menu-wrap" ref={notificationsRef}>
            <button
              type="button"
              className="btn btn-light admin-icon-btn"
              onClick={handleToggleNotifications}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <i className="bi bi-bell" />
              {unreadCount > 0 && <span className="admin-notification-badge">{unreadCount}</span>}
            </button>

            <div className={`admin-dropdown-menu ${showNotifications ? 'show' : ''}`}>
              <div className="admin-dropdown-header">Recent Alerts</div>
              {alerts.length ? (
                alerts.map((alert) => (
                  <button key={alert.id} type="button" className="admin-dropdown-item">
                    <span>{alert.text}</span>
                    <small>{alert.time}</small>
                  </button>
                ))
              ) : (
                <p className="admin-dropdown-empty mb-0">No notifications yet.</p>
              )}
            </div>
          </div>

          <div className="admin-menu-wrap" ref={profileRef}>
            <button
              type="button"
              className="btn btn-light admin-profile-btn"
              onClick={handleToggleProfileMenu}
              aria-expanded={showProfileMenu}
            >
              <span className="admin-profile-avatar"><i className="bi bi-person-circle" /></span>
              <span className="admin-profile-meta">
                <strong>{adminName}</strong>
                <small>Librarian</small>
              </span>
              <i className="bi bi-chevron-down" />
            </button>

            <div className={`admin-dropdown-menu admin-profile-menu ${showProfileMenu ? 'show' : ''}`}>
              <button type="button" className="admin-dropdown-item" onClick={() => navigate('/admin/settings')}>
                <i className="bi bi-person me-2" />
                Profile
              </button>
              <button type="button" className="admin-dropdown-item" onClick={() => navigate('/admin/settings')}>
                <i className="bi bi-gear me-2" />
                Settings
              </button>
              <button type="button" className="admin-dropdown-item text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" />
                Logout
              </button>
            </div>
          </div>
        </section>
      </div>
    </header>
  )
}

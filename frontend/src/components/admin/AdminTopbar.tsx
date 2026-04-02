import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import AddBookForm from '../AddBookForm'

interface AdminAlert {
  id: string
  text: string
  time: string
  read: boolean
}

const pageTitle: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/inventory': 'Books Management',
  '/admin/users': 'Users',
  '/admin/borrow-requests': 'Borrow Requests',
  '/admin/reports': 'Reports',
  '/admin/settings': 'Settings',
}

function getAdminNameFromStorage() {
  const directName = localStorage.getItem('currentUserName')
  if (directName?.trim()) return directName.trim()

  const rawCurrentUser = localStorage.getItem('currentUser')
  if (!rawCurrentUser) return 'Admin'

  try {
    const parsed = JSON.parse(rawCurrentUser) as { name?: string; email?: string }
    return parsed?.name?.trim() || parsed?.email?.trim() || 'Admin'
  } catch {
    return 'Admin'
  }
}

export default function AdminTopbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()

  const notificationsRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)

  const [adminName, setAdminName] = useState('Admin')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [alerts] = useState<AdminAlert[]>([
    { id: 'a-1', text: '3 new users registered today.', time: '2m ago', read: false },
    { id: 'a-2', text: '8 books are overdue for return.', time: '15m ago', read: false },
    { id: 'a-3', text: 'System sync completed successfully.', time: '1h ago', read: true },
  ])

  useEffect(() => {
    setAdminName(getAdminNameFromStorage())
  }, [location.pathname])

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

  const currentTitle = useMemo(() => {
    return pageTitle[location.pathname] || 'Panel'
  }, [location.pathname])

  const unreadCount = useMemo(() => alerts.filter((a) => !a.read).length, [alerts])

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    navigate(`/search?q=${encodeURIComponent(query)}`)
    toast.info(`Searching for "${query}"...`)
  }

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
    <>
      <header className="admin-navbar">
        <section className="admin-navbar-left">
          <p className="admin-navbar-caption">Dashboard</p>
          <h4 className="admin-navbar-title">{currentTitle}</h4>
        </section>

        <section className="admin-navbar-center">
          <form className="admin-global-search" onSubmit={handleSearchSubmit}>
            <i className="bi bi-search" />
            <input
              type="search"
              placeholder="Search books, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </section>

        <section className="admin-navbar-right">
          <button
            type="button"
            className="admin-quick-action"
            onClick={() => setShowAddBookModal(true)}
          >
            <i className="bi bi-plus-lg" />
            <span>Add Book</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`} />
          </button>

          <div className="admin-menu-wrap" ref={notificationsRef}>
            <button
              type="button"
              className="admin-icon-btn"
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfileMenu(false)
              }}
              title="Notifications"
            >
              <i className="bi bi-bell" />
              {unreadCount > 0 && <span className="admin-notification-badge">{unreadCount}</span>}
            </button>

            <div className={`admin-dropdown-menu ${showNotifications ? 'show' : ''}`}>
              <div className="admin-dropdown-header">Notifications</div>
              {alerts.map((alert) => (
                <button key={alert.id} className="admin-dropdown-item" type="button">
                  <span>{alert.text}</span>
                  <small>{alert.time}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-menu-wrap" ref={profileRef}>
            <button
              type="button"
              className="admin-profile-btn"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu)
                setShowNotifications(false)
              }}
            >
              <span className="admin-profile-avatar">
                <i className="bi bi-person-circle" />
              </span>
              <span className="admin-profile-meta">
                <strong>{adminName}</strong>
                <small>Librarian</small>
              </span>
              <i className="bi bi-chevron-down" />
            </button>

            <div className={`admin-dropdown-menu admin-profile-menu ${showProfileMenu ? 'show' : ''}`}>
              <button
                type="button"
                className="admin-dropdown-item"
                onClick={() => navigate('/admin/settings')}
              >
                <i className="bi bi-person" />
                Profile
              </button>
              <button
                type="button"
                className="admin-dropdown-item"
                onClick={() => navigate('/admin/settings')}
              >
                <i className="bi bi-sliders" />
                Settings
              </button>
              <button type="button" className="admin-dropdown-item text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right" />
                Logout
              </button>
            </div>
          </div>
        </section>
      </header>

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-fullscreen-custom">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddBookModal(false)}
                  aria-label="Close"
                />
              </div>
              <AddBookForm
                isModal
                onClose={() => setShowAddBookModal(false)}
                onBookAdded={() => {
                  setShowAddBookModal(false)
                  toast.success('✅ Book added to inventory!')
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

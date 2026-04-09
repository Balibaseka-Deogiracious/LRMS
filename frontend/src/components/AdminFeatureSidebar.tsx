import { NavLink } from 'react-router-dom'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './AdminFeatureSidebar.css'

const links = [
  { to: '/admin', icon: 'bi-grid-1x2', label: 'Summary' },
  { to: '/admin/users', icon: 'bi-people', label: 'Users' },
  { to: '/add', icon: 'bi-journal-plus', label: 'Inventory' },
  { to: '/search', icon: 'bi-search', label: 'Resources' },
]

interface AdminFeatureSidebarProps {
  onLogout?: () => void
}

export default function AdminFeatureSidebar({ onLogout }: AdminFeatureSidebarProps) {
  const { role } = useAuth()
  const [photoSrc, setPhotoSrc] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('libris_admin_sidebar_photo')
    if (saved) setPhotoSrc(saved)
  }, [])

  const handleChoosePhoto = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const next = String(reader.result || '')
      setPhotoSrc(next)
      localStorage.setItem('libris_admin_sidebar_photo', next)
    }
    reader.readAsDataURL(file)
  }

  return (
    <aside className="admin-sidebar card border-0 shadow-sm">
      <div className="card-body p-3 p-lg-4">
        <div className="admin-brand mb-3">
          <div className="admin-brand-icon" aria-hidden="true">
            <i className="bi bi-boxes" />
          </div>
          <div>
            <strong className="d-block">Libris</strong>
            <small>Librarian Dashboard</small>
          </div>
        </div>

        <div className="admin-profile mb-4">
          <div className="admin-profile-photo-wrap mb-2">
            {photoSrc ? (
              <img src={photoSrc} alt="Librarian profile" className="admin-profile-photo" />
            ) : (
              <div className="admin-profile-photo admin-profile-photo-fallback" aria-hidden="true">
                <i className="bi bi-person-circle" />
              </div>
            )}
          </div>

          <button type="button" className="btn btn-sm btn-outline-primary w-100" onClick={handleChoosePhoto}>
            <i className="bi bi-upload me-1" />
            Upload Photo
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="d-none"
            onChange={handlePhotoChange}
          />

          <p className="admin-role mt-2 mb-0">Role: {role === 'admin' ? 'Librarian' : 'User'}</p>
        </div>

        <div className="admin-sidebar-header mb-2">
          <p className="admin-sidebar-kicker mb-0">Navigation</p>
        </div>

        <nav className="d-grid gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
            >
              <div className="d-flex align-items-center gap-3">
                <span className="admin-sidebar-icon">
                  <i className={`bi ${link.icon}`} />
                </span>
                <span>
                  <strong className="d-block">{link.label}</strong>
                </span>
                <span className="admin-sidebar-arrow" aria-hidden="true">
                  <i className="bi bi-chevron-right" />
                </span>
              </div>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="btn btn-sm admin-logout-btn mt-4 w-100" onClick={onLogout}>
          <i className="bi bi-box-arrow-left me-1" />
          Log out
        </button>
      </div>
    </aside>
  )
}

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import './admin-layout.css'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className={`admin-layout-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <AdminSidebar collapsed={false} onToggle={closeSidebar} />
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={closeSidebar} />}
      <div className="admin-main">
        <div className="admin-fixed-topbar">
          <AdminTopbar onMenuToggle={handleSidebarToggle} sidebarOpen={sidebarOpen} />
        </div>
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

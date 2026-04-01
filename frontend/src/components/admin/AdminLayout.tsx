import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import './admin-layout.css'

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`admin-layout-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="admin-main">
        <div className="admin-fixed-topbar">
          <AdminTopbar />
        </div>
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import React from 'react'
import { FiHome, FiSearch, FiDatabase, FiSun, FiMoon, FiLogOut } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'

interface LayoutProps {
  children: React.ReactNode
  currentPage: 'dashboard' | 'search' | 'inventory'
  onNavigate: (page: 'dashboard' | 'search' | 'inventory') => void
  userRole: 'patron' | 'librarian'
  onToggleRole: () => void
}

export default function Layout({
  children,
  currentPage,
  onNavigate,
  userRole,
  onToggleRole,
}: LayoutProps) {
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'search', label: 'Search', icon: FiSearch },
    ...(userRole === 'librarian' ? [{ id: 'inventory', label: 'Inventory', icon: FiDatabase }] : []),
  ]

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            LRMS
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Library Retrieval Management
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id as 'dashboard' | 'search' | 'inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
            <p className="text-xs font-semibold text-slate-900 dark:text-white mb-2">Role</p>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 capitalize">
              {userRole}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentPage === 'dashboard' && 'Dashboard'}
              {currentPage === 'search' && 'Search Library'}
              {currentPage === 'inventory' && 'Inventory Management'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <FiMoon className="w-5 h-5 text-slate-600" />
              ) : (
                <FiSun className="w-5 h-5 text-yellow-500" />
              )}
            </button>

            {/* Role Toggle */}
            <button
              onClick={onToggleRole}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Switch to {userRole === 'patron' ? 'Librarian' : 'Patron'}
            </button>

            {/* Logout */}
            <button
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

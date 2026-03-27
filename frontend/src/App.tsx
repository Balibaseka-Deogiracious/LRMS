import React, { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SearchPage from './pages/SearchPage'
import InventoryPage from './pages/InventoryPage'

type Page = 'dashboard' | 'search' | 'inventory'
type UserRole = 'patron' | 'librarian'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [userRole, setUserRole] = useState<UserRole>('patron')

  const toggleRole = () => {
    setUserRole(prev => (prev === 'patron' ? 'librarian' : 'patron'))
  }

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      userRole={userRole}
      onToggleRole={toggleRole}
    >
      {currentPage === 'dashboard' && <Dashboard userRole={userRole} />}
      {currentPage === 'search' && <SearchPage userRole={userRole} />}
      {currentPage === 'inventory' && userRole === 'librarian' && <InventoryPage />}
      
      {currentPage === 'inventory' && userRole === 'patron' && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Inventory management is only available for librarians.
            </p>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Layout>
  )
}

export default App

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import AppErrorBoundary from './components/AppErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
            <ToastContainer position="bottom-right" autoClose={2500} newestOnTop />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
)

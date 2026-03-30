import { useEffect, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import logo from '../assets/library-logo.svg'

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'Process' },
  { id: 'contact', label: 'Contact' },
]

export default function LandingNavbar() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 120
      for (let i = navLinks.length - 1; i >= 0; i -= 1) {
        const section = document.getElementById(navLinks[i].id)
        if (section && section.offsetTop <= scrollY) {
          setActiveSection(navLinks[i].id)
          break
        }
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSmoothScroll = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault()
    const target = document.getElementById(sectionId)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md ${isDark ? 'border-slate-700/45 bg-slate-900/75' : 'border-slate-200/70 bg-white/75'}`}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold" style={{ color: '#254194' }}>
            <img src={logo} alt="LRMS logo" width="32" height="32" className="rounded" />
            <span>LRMS</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(event) => handleSmoothScroll(event, link.id)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'font-semibold text-[#254194]'
                      : isDark
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-md transition ${isDark ? 'text-slate-200 hover:bg-slate-800 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}`}
              onClick={toggleTheme}
              title="Toggle dark/light mode"
              aria-label="Toggle dark/light mode"
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`} />
            </button>

            <Link
              to="/login"
              className={`hidden sm:inline-block rounded-md px-3 py-2 text-sm font-medium transition ${isDark ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="hidden sm:inline-block rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: '#254194' }}
            >
              Join Library
            </Link>

            <button
              type="button"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden ${isDark ? 'text-white hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-xl`} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/30"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu overlay"
        />
        <aside
          className={`absolute right-0 top-0 h-full w-72 border-l bg-white p-5 shadow-2xl transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: '#254194' }}>Navigation</span>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="text-slate-600">
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(event) => handleSmoothScroll(event, link.id)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? 'text-white' : 'text-slate-700'
                  }`}
                  style={isActive ? { backgroundColor: '#254194' } : undefined}
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
            <Link to="/login" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700">
              Sign In
            </Link>
            <Link
              to="/register"
              className="block rounded-full px-3 py-2 text-center text-sm font-semibold text-white"
              style={{ backgroundColor: '#254194' }}
            >
              Join Library
            </Link>
          </div>
        </aside>
      </div>

      <div className="h-16" />
    </>
  )
}

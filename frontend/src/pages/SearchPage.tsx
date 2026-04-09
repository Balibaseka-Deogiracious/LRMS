import {
  BookMarked,
  BookOpen,
  CalendarDays,
  Download,
  FileText,
  FolderTree,
  GraduationCap,
  History,
  LayoutDashboard,
  Library,
  ListChecks,
  LogIn,
  Search,
  Sigma,
  UserRound,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'
import './search-page.css'

const browseLinks = [
  { label: 'Communities & Collections', icon: FolderTree },
  { label: 'Issue Date', icon: CalendarDays },
  { label: 'Authors', icon: UserRound },
  { label: 'Titles', icon: BookMarked },
  { label: 'Subjects', icon: Sigma },
]

const accountLinks = [
  { label: 'Login/Profile', icon: LogIn },
  { label: 'Subscriptions', icon: ListChecks },
  { label: 'Profile', icon: Users },
  { label: 'Borrowing History', icon: History },
]

const discoverLinks = [
  { label: 'Recent Submissions', icon: FileText },
  { label: 'Statistics', icon: LayoutDashboard },
]

const communities = [
  { name: 'Faculty of Engineering', count: 184 },
  { name: 'School of Computing', count: 263 },
  { name: 'Faculty of Science', count: 156 },
  { name: 'School of Business', count: 141 },
  { name: 'Faculty of Education', count: 109 },
  { name: 'School of Health Sciences', count: 127 },
]

const recentSubmissions = [
  { date: '2026-03-29', title: 'IoT-Based Smart Irrigation for Semi-Arid Regions', authors: 'M. Kibet; A. Njeri' },
  { date: '2026-03-27', title: 'Federated Learning for Campus Data Privacy', authors: 'S. Wambui; L. Kiptoo' },
  { date: '2026-03-25', title: 'Assessing Groundwater Quality in Urban Settlements', authors: 'J. Maina' },
  { date: '2026-03-22', title: 'Digital Transformation Readiness in Public Universities', authors: 'R. Ouma; K. Cheruiyot' },
  { date: '2026-03-20', title: 'AI Tutoring Models for Introductory Programming Courses', authors: 'T. Atieno' },
]

function SidebarSection({ title, items }: { title: string; items: { label: string; icon: ComponentType<{ size?: number }> }[] }) {
  return (
    <section className="repo-sidebar-section">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.label}>
              <button type="button" className="repo-nav-item">
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function SearchPage() {
  return (
    <div className="repo-page">
      <header className="repo-topbar">
        <div className="repo-topbar-inner">
          <Library size={20} />
          <div className="repo-search-wrap" role="search">
            <Search size={17} />
            <input type="search" placeholder="Search across Libris repositories..." aria-label="Search all Libris records" />
            <select aria-label="Search scope">
              <option>All of Libris</option>
              <option>Communities & Collections</option>
              <option>Authors</option>
            </select>
            <button type="button">Search</button>
          </div>
        </div>
      </header>

      <div className="repo-content-shell">
        <aside className="repo-sidebar">
          <div className="repo-sidebar-brand">
            <GraduationCap size={20} />
            <div>
              <strong>Libris Repository</strong>
              <small>Student Knowledge Space</small>
            </div>
          </div>

          <SidebarSection title="Browse" items={browseLinks} />
          <SidebarSection title="My Account" items={accountLinks} />
          <SidebarSection title="Discover" items={discoverLinks} />
        </aside>

        <main className="repo-main">
          <section className="repo-hero">
            <div>
              <p className="repo-hero-kicker">Institutional Knowledge Hub</p>
              <h1>Search Research & Theses</h1>
              <p>Explore university research outputs, archived theses, and peer-reviewed submissions from one connected Libris space.</p>
            </div>
            <button type="button" className="repo-submit-btn">
              <FileText size={16} />
              Submit Research Work
            </button>
          </section>

          <section className="repo-card">
            <div className="repo-section-head">
              <h2>Communities & Collections</h2>
              <p>Browse by faculty and school collections.</p>
            </div>
            <div className="repo-community-grid">
              {communities.map((community, index) => (
                <article key={community.name} className="repo-community-card" style={{ animationDelay: `${index * 70}ms` }}>
                  <div>
                    <h3>{community.name}</h3>
                    <p>Research papers, theses, and technical reports.</p>
                  </div>
                  <span>{community.count} items</span>
                </article>
              ))}
            </div>
          </section>

          <section className="repo-grid-two">
            <article className="repo-card">
              <div className="repo-section-head">
                <h2>Recent Submissions</h2>
                <p>Latest 5 uploads to the institutional repository.</p>
              </div>
              <div className="table-responsive">
                <table className="table repo-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Date of Issue</th>
                      <th>Title</th>
                      <th>Author(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.map((item) => (
                      <tr key={item.title}>
                        <td>{item.date}</td>
                        <td>{item.title}</td>
                        <td>{item.authors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <div className="repo-side-stack">
              <article className="repo-card repo-mini-card">
                <div className="repo-section-head">
                  <h2>My Library Space</h2>
                  <p>Student activity at a glance.</p>
                </div>
                <ul className="repo-stat-list">
                  <li>
                    <BookOpen size={16} />
                    <span>Active sessions: 2</span>
                  </li>
                  <li>
                    <CalendarDays size={16} />
                    <span>Reserved research carrels: 1</span>
                  </li>
                  <li>
                    <Download size={16} />
                    <span>Downloaded e-resources: 14</span>
                  </li>
                </ul>
              </article>

              <article className="repo-card repo-mini-card">
                <div className="repo-section-head">
                  <h2>Digital Repository Quick Access</h2>
                  <p>Open core platforms in one click.</p>
                </div>
                <div className="repo-quick-links">
                  <button type="button">Institutional Repository</button>
                  <button type="button">Library Catalog (Koha)</button>
                  <button type="button">e-Resources (MyLoft)</button>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

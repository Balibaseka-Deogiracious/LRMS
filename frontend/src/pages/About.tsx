import { useTheme } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import logo from '../assets/library-logo.svg'
import './About.css'
import Alice from '../../public/team/Nalubiri Alice.jpg'
import Aine from '../../public/team/Ainembabazi Alicia.jpg'
import Rhodah from '../../public/team/Watsemba Rhodah.jpg'
import Akao from '../../public/team/Akao Diana Hilder.jpg'
import Arishaba from '../../public/team/Arishaba Shibella.jpg'
import Awor from '../../public/team/Awor Winnie Apell.jpg'
import Awori from '../../public/team/Awori Janet.jpg'
import Ego from'../../public/team/Egoo Aaron Oyoyi.jpg'
import kirabo from '../../public/team/Kirabo Jovia Mulumya.jpg'
import sebina from '../../public/team/Nagawa Florence Sebina.jpg'
import Shadia from '../../public/team/Nakanwagi Shadia.jpg'
import fatumah from '../../public/team/Nantumbwe Fatumah.jpg'
import Walter from '../../public/team/Okullu Walter Joseph.jpg'


interface TeamMember {
  id: number
  name: string
  role: string
  registrationNumber: string
  image: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Nalubiri Alice',
    role: 'Project Lead & System Architect',
    registrationNumber: '24/U/LID/15398/PD',
    image: Alice,
  },
  {
    id: 2,
    name: 'Watsemba Rhodah',
    role: 'Quality Assurance Lead',
    registrationNumber: '24/U/LID/12567/PD',
    image: Rhodah,
  },
  {
    id: 3,
    name: 'Akao Diana Hilder',
    role: 'Full Stack Developer',
    registrationNumber: '24/U/LID/02699/PD',
    image: Akao,
  },
  {
    id: 4,
    name: 'Arishaba Shibella',
    role: 'UX/UI Designer',
    registrationNumber: '24/U/LID/03508/PD',
    image: Arishaba,
  },
  {
    id: 5,
    name: 'Awor Winnie Apella',
    role: 'Backend Engineering Lead',
    registrationNumber: '24/U/LID/03990/PD',
    image: Awor,
  },
  {
    id: 6,
    name: 'Awori Janet',
    role: 'Database Administrator',
    registrationNumber: '24/U/LID/03998/PD',
    image: Awori,
  },
  {
    id: 7,
    name: 'Ego Aaron Oyoyi',
    role: 'Quality Assurance Lead',
    registrationNumber: '24/U/LIE/04753/PE',
    image: Ego,
  },
  {
    id: 8,
    name: 'Kirabo Jovia Mulumya',
    role: 'Quality Assurance Lead',
    registrationNumber: '24/U/LID/06187/PD',
    image: kirabo,
  },
  {
    id: 9,
    name: 'Nagawa Florence Sebina',
    role: 'Quality Assurance Lead',
    registrationNumber: '24/U/LID/08471/PD',
    image: sebina,
  },
  {
    id: 10,
    name: 'Nakanwagi Shadia',
    role: 'Quality Assurance Lead',
    registrationNumber: '24/U/LID/08698/PD',
    image: Shadia,
  },
  {
    id: 11,
    name: 'Nantumbwe Fatumah',
    role: 'Quality Assurance Lead',
    registrationNumber: '24/U/LID/09865/PD',
    image: fatumah,
  },
  {
    id: 12,
    name: 'Okullu Walter Joseph',
    role: 'Quality Assurance Lead',
    registrationNumber: '24/U/LID/11040/PD',
    image: Walter,
  },
  {
    id: 13,
    name: 'Ainembabazi Alicia',
    role: 'Quality Assurance Lead',
    registrationNumber: '24/U/LID/02482/PD',
    image: Aine,
  },
]

export default function About() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={isDark ? 'bg-slate-950' : 'bg-white'}>
      {/* Navigation */}
      <nav className={`fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md ${isDark ? 'border-slate-700/45 bg-slate-900/75' : 'border-slate-200/70 bg-white/75'}`}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold about-logo">
            <img src={logo} alt="Libris logo" width="32" height="32" className="rounded" />
            <span>Libris</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
              aria-label="Toggle theme"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
            <Link
              to="/"
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <section className="mb-16 text-center">
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              About Libris
            </h1>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Library Retrieval Management System
            </p>
          </section>

          {/* System Overview */}
          <section className={`mb-16 rounded-lg p-8 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
            <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              About Our System
            </h2>
            <div className={`space-y-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>
                The Library Retrieval Management System (Libris) is a comprehensive digital solution designed to streamline and enhance library operations. Our system enables librarians and students to efficiently manage book inventories, track borrowing patterns, and foster a vibrant reading community.
              </p>
              <p>
                Libris combines modern web technologies with intuitive user interfaces to provide a seamless experience for both administrators and library users. From real-time inventory management to personalized book recommendations, our platform simplifies library administration and enriches the student learning experience.
              </p>
              <div className={`mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4`}>
                <div className={`p-4 rounded-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className="text-2xl font-bold text-[#254194] mb-2">500+</div>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Books Available</p>
                </div>
                <div className={`p-4 rounded-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className="text-2xl font-bold text-[#254194] mb-2">1000+</div>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Active Users</p>
                </div>
                <div className={`p-4 rounded-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                  <div className="text-2xl font-bold text-[#254194] mb-2">98%</div>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>User Satisfaction</p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-16">
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Digital Inventory', description: 'Comprehensive book database with real-time availability tracking' },
                { title: 'Easy Borrowing', description: 'Streamlined book borrowing and return processes' },
                { title: 'Advanced Search', description: 'Powerful search functionality to find books by title, author, or subject' },
                { title: 'Admin Dashboard', description: 'Intuitive dashboard for library administrators to manage operations' },
                { title: 'Analytics & Reports', description: 'Data-driven insights on borrowing trends and user behavior' },
                { title: 'Notifications', description: 'Timely alerts for due dates, new arrivals, and system updates' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border transition hover:shadow-lg ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className={`text-3xl font-bold mb-12 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`rounded-lg overflow-hidden border transition hover:shadow-lg ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Avatar */}
                  <div className="h-40 flex items-center justify-center bg-slate-200">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-40 w-40 object-cover team-member-image"
                    />
                  </div>

                  {/* Member Details */}
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {member.name}
                    </h3>
                    <p className="text-[#254194] font-semibold mb-4">
                      {member.role}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <p className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          Registration Number
                        </p>
                        <p className={`text-sm font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {member.registrationNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className={`mt-20 rounded-lg p-12 text-center ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Ready to Explore?
            </h2>
            <p className={`mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Join our library community today and discover thousands of retrievals at your fingertips.
            </p>
            <Link
              to="/register"
              className="inline-block rounded-full px-8 py-3 text-white font-semibold transition hover:opacity-90 about-cta-button"
            >
              Join Library
            </Link>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className={`mt-20 border-t ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            © 2026 Library Retrieval Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

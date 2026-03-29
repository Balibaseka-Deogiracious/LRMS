import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

type Sender = 'assistant' | 'user'

type AssistantContext = 'landing' | 'user' | 'admin'

interface ChatMessage {
  id: string
  sender: Sender
  text: string
}

interface QuickAction {
  label: string
  reply: string
}

const quickActionsByContext: Record<AssistantContext, QuickAction[]> = {
  landing: [
    { label: 'How to join?', reply: 'To join LRMS, select Register, create your account, and verify your email to access catalog features.' },
    { label: 'Search Catalog', reply: 'Use the Search Books page to filter by title, author, category, and availability in seconds.' },
    { label: 'Library Hours', reply: 'Library service hours are Mon-Fri 8:00 AM to 8:00 PM and Sat 9:00 AM to 5:00 PM.' },
  ],
  user: [
    { label: 'My Borrowed Books', reply: 'Open My Borrowed Books to track due dates and quickly return currently borrowed titles.' },
    { label: 'Renew a Book', reply: 'Renewal is available from your borrowed list when no hold is active for that title.' },
    { label: 'Find Study Space', reply: 'I can suggest quiet study zones and peak hours. Late mornings are usually the least crowded.' },
  ],
  admin: [
    { label: 'Generate Weekly Report', reply: 'I can prepare a weekly snapshot of borrowing trends, active users, and overdue counts.' },
    { label: 'Check System Health', reply: 'System health is stable. Search, borrowing sync, and notifications are currently operational.' },
    { label: 'Add New Member', reply: 'Open Users and create a member account, then assign role and access status from Admin controls.' },
  ],
}

function getContext(pathname: string, role: 'admin' | 'user'): AssistantContext {
  if (pathname === '/') return 'landing'
  if (pathname.startsWith('/admin')) return 'admin'
  return role === 'admin' ? 'admin' : 'user'
}

function getGreeting(context: AssistantContext): string {
  if (context === 'admin') {
    return "Hello Admin! I've noticed 33 books are currently out. Would you like me to send return reminders?"
  }
  if (context === 'user') {
    return 'Hello! I can help you find books, manage renewals, and navigate library services quickly.'
  }
  return 'Welcome to LRMS. I can help with joining, searching the catalog, and checking library information.'
}

export default function LibryAssistant() {
  const location = useLocation()
  const { role } = useAuth()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const context = useMemo(() => getContext(location.pathname, role), [location.pathname, role])
  const quickActions = quickActionsByContext[context]

  useEffect(() => {
    setMessages([{ id: 'greeting', sender: 'assistant', text: getGreeting(context) }])
  }, [context])

  const addMessage = (sender: Sender, text: string) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, sender, text }])
  }

  const sendUserMessage = (text: string) => {
    const clean = text.trim()
    if (!clean) return

    addMessage('user', clean)
    setInput('')

    window.setTimeout(() => {
      addMessage(
        'assistant',
        'Thanks for your message. I am checking LRMS context and will guide you with the best next step.'
      )
    }, 280)
  }

  const handleQuickAction = (action: QuickAction) => {
    addMessage('user', action.label)
    window.setTimeout(() => {
      addMessage('assistant', action.reply)
    }, 220)
  }

  const handleFilePicked = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    addMessage('user', `Uploaded file: ${file.name}`)
    window.setTimeout(() => {
      addMessage('assistant', 'File received. I can scan this cover or ID and help you locate the matching library record.')
    }, 250)

    event.target.value = ''
  }

  return (
    <div className="fixed bottom-5 right-5 z-[1200]" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="fixed bottom-20 right-0 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[390px] max-sm:left-3 max-sm:right-3 max-sm:bottom-3 max-sm:h-[56vh]"
          >
            <div className="flex items-center justify-between bg-[#254194] px-4 py-3 text-white">
              <div>
                <p className="mb-0 text-sm font-semibold">Libry Assistant</p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-blue-100">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  Online
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-white/35 px-2 py-1 text-xs text-white transition hover:bg-white/15"
                onClick={() => setIsOpen(false)}
              >
                Minimize
              </button>
            </div>

            <div className="h-[330px] space-y-2 overflow-y-auto bg-slate-50 px-3 py-3 max-sm:h-[calc(56vh-146px)]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                    message.sender === 'user'
                      ? 'ml-auto bg-blue-100 text-slate-800'
                      : 'bg-[#f1f5f9] text-slate-800'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 bg-white px-3 py-2">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <form
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5"
                onSubmit={(event) => {
                  event.preventDefault()
                  sendUserMessage(input)
                }}
              >
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload file"
                >
                  <i className="bi bi-paperclip text-base" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask Libry anything..."
                  className="h-8 flex-1 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#254194] text-white transition hover:bg-[#1e3578]"
                  aria-label="Send message"
                >
                  <i className="bi bi-send text-xs" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFilePicked}
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#254194] text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#1f357a]"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open Libry assistant"
      >
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-stars'} text-lg`} />
      </button>
    </div>
  )
}

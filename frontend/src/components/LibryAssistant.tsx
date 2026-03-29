import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Avatar from './Avatar'

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

type VoiceStatus = 'idle' | 'listening' | 'speaking'

interface VoiceTurn {
  speaker: 'User' | 'Libry'
  text: string
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
    { label: 'Add New Member', reply: 'Open Users and create a member account, then assign role and access status from Librarian controls.' },
  ],
}

function getContext(pathname: string, role: 'admin' | 'user'): AssistantContext {
  if (pathname === '/') return 'landing'
  if (pathname.startsWith('/admin')) return 'admin'
  return role === 'admin' ? 'admin' : 'user'
}

function getGreeting(context: AssistantContext): string {
  if (context === 'admin') {
    return "Hello Librarian! I've noticed 33 books are currently out. Would you like me to send return reminders?"
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
  const replyTimerRef = useRef<number | null>(null)
  const recognitionRef = useRef<any>(null)
  const isVoiceModeRef = useRef(false)
  const isMutedRef = useRef(false)
  const voiceStatusRef = useRef<VoiceStatus>('idle')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle')
  const [voiceTurns, setVoiceTurns] = useState<VoiceTurn[]>([])
  const [showBip, setShowBip] = useState(false)

  const context = useMemo(() => getContext(location.pathname, role), [location.pathname, role])
  const quickActions = quickActionsByContext[context]
  const recognitionSupported = useMemo(() => {
    const speechCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    return !!speechCtor
  }, [])

  useEffect(() => {
    if (replyTimerRef.current) {
      window.clearTimeout(replyTimerRef.current)
      replyTimerRef.current = null
    }
    window.speechSynthesis?.cancel()
    setIsVoiceMode(false)
    setVoiceStatus('idle')
    setVoiceTurns([])
    setIsTyping(false)
    setMessages([{ id: 'greeting', sender: 'assistant', text: getGreeting(context) }])
  }, [context])

  useEffect(() => {
    isVoiceModeRef.current = isVoiceMode
  }, [isVoiceMode])

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

  useEffect(() => {
    voiceStatusRef.current = voiceStatus
  }, [voiceStatus])

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current)
      if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current)
      recognitionRef.current?.stop?.()
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(() => {
    if (!isVoiceMode) return
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let tick = 0

    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      canvas.width = width * (window.devicePixelRatio || 1)
      canvas.height = height * (window.devicePixelRatio || 1)
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0)

      ctx.clearRect(0, 0, width, height)

      const bars = 40
      const barWidth = Math.max(3, width / (bars * 1.8))
      const gap = barWidth * 0.7
      const totalWidth = bars * barWidth + (bars - 1) * gap
      const startX = (width - totalWidth) / 2
      const midY = height / 2

      const baseAmp = voiceStatusRef.current === 'speaking' ? 30 : voiceStatusRef.current === 'listening' ? 20 : 8

      for (let i = 0; i < bars; i += 1) {
        const wave = Math.sin((tick + i * 8) * 0.06)
        const pulse = Math.cos((tick + i * 5) * 0.045)
        const magnitude = Math.max(6, Math.abs((wave + pulse) * 0.5) * baseAmp + 6)
        const x = startX + i * (barWidth + gap)

        const alpha = 0.25 + (i / bars) * 0.55
        ctx.fillStyle = `rgba(165, 243, 252, ${alpha})`
        ctx.fillRect(x, midY - magnitude / 2, barWidth, magnitude)
      }

      tick += 1.6
      animationFrameRef.current = window.requestAnimationFrame(draw)
    }

    animationFrameRef.current = window.requestAnimationFrame(draw)

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isVoiceMode])

  const triggerBip = () => {
    setShowBip(true)
    window.setTimeout(() => setShowBip(false), 460)
  }

  const addMessage = (sender: Sender, text: string) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, sender, text }])
  }

  const addVoiceTurn = (speaker: 'User' | 'Libry', text: string) => {
    setVoiceTurns((prev) => [...prev, { speaker, text }])
  }

  const buildAssistantReply = (prompt: string) => {
    const low = prompt.toLowerCase()

    if (low.includes('report')) return 'Weekly report is ready to generate. I can include borrowing trends, overdue items, and active members.'
    if (low.includes('renew')) return 'To renew a book, open My Borrowed Books and choose Renew for the selected title if no reservation exists.'
    if (low.includes('hours')) return 'Library service hours are Monday to Friday 8 AM to 8 PM, and Saturday 9 AM to 5 PM.'
    if (low.includes('health')) return 'System health looks stable. Search latency and borrowing sync are both running normally.'

    return 'Understood. I can help with catalog search, user support, and librarian actions. Tell me what you want to do next.'
  }

  const stopRecognition = () => {
    try {
      recognitionRef.current?.stop?.()
    } catch {
      // ignore stop races
    }
  }

  const startRecognition = () => {
    if (!recognitionSupported || isMutedRef.current || !isVoiceModeRef.current) return

    const SpeechCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechCtor) return

    if (!recognitionRef.current) {
      const recognition = new SpeechCtor()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        if (voiceStatusRef.current !== 'speaking') {
          setVoiceStatus('listening')
          triggerBip()
        }
      }

      recognition.onerror = () => {
        setVoiceStatus('idle')
      }

      recognition.onresult = (event: any) => {
        const latest = event.results?.[event.results.length - 1]
        if (!latest) return

        const transcript = String(latest[0]?.transcript || '').trim()
        const isFinal = !!latest.isFinal
        if (!isFinal || !transcript) return

        triggerBip()
        addMessage('user', transcript)
        addVoiceTurn('User', transcript)

        const reply = buildAssistantReply(transcript)
        setVoiceStatus('speaking')
        stopRecognition()
        addMessage('assistant', reply)
        addVoiceTurn('Libry', reply)

        if (!isSpeakerOn) {
          setVoiceStatus('listening')
          window.setTimeout(() => startRecognition(), 120)
          return
        }

        const utterance = new SpeechSynthesisUtterance(reply)
        utterance.lang = 'en-US'
        utterance.rate = 1
        utterance.pitch = 1.02
        utterance.onend = () => {
          if (!isVoiceModeRef.current) return
          if (isMutedRef.current) {
            setVoiceStatus('idle')
            return
          }
          setVoiceStatus('listening')
          window.setTimeout(() => startRecognition(), 120)
        }
        window.speechSynthesis?.cancel()
        window.speechSynthesis?.speak(utterance)
      }

      recognition.onend = () => {
        if (!isVoiceModeRef.current || isMutedRef.current || voiceStatusRef.current === 'speaking') return
        window.setTimeout(() => startRecognition(), 160)
      }

      recognitionRef.current = recognition
    }

    try {
      recognitionRef.current.start()
    } catch {
      // ignore repeated starts
    }
  }

  const startVoiceCall = () => {
    setIsVoiceMode(true)
    setVoiceStatus('idle')
    if (recognitionSupported) {
      window.setTimeout(() => startRecognition(), 120)
    }
  }

  const endVoiceCall = () => {
    setIsVoiceMode(false)
    setVoiceStatus('idle')
    stopRecognition()
    window.speechSynthesis?.cancel()

    if (voiceTurns.length > 0) {
      const summary = voiceTurns
        .map((turn) => `${turn.speaker}: ${turn.text}`)
        .join(' | ')
      addMessage('assistant', `Voice call transcript: ${summary}`)
    } else {
      addMessage('assistant', 'Voice call ended. No transcript captured in this session.')
    }

    setVoiceTurns([])
  }

  useEffect(() => {
    if (!isVoiceMode) {
      stopRecognition()
      window.speechSynthesis?.cancel()
      return
    }

    if (isMuted) {
      stopRecognition()
      setVoiceStatus('idle')
      return
    }

    if (voiceStatus !== 'speaking') {
      startRecognition()
    }
  }, [isVoiceMode, isMuted, recognitionSupported, voiceStatus])

  const queueAssistantReply = (reply: string, delay = 320) => {
    setIsTyping(true)
    if (replyTimerRef.current) window.clearTimeout(replyTimerRef.current)

    replyTimerRef.current = window.setTimeout(() => {
      addMessage('assistant', reply)
      setIsTyping(false)
      replyTimerRef.current = null
    }, delay)
  }

  const sendUserMessage = (text: string) => {
    const clean = text.trim()
    if (!clean) return

    addMessage('user', clean)
    setInput('')

    queueAssistantReply(
      'Thanks for your message. I am checking LRMS context and will guide you with the best next step.',
      420
    )
  }

  const handleQuickAction = (action: QuickAction) => {
    addMessage('user', action.label)
    queueAssistantReply(action.reply, 360)
  }

  const handleFilePicked = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    addMessage('user', `Uploaded file: ${file.name}`)
    queueAssistantReply('File received. I can scan this cover or ID and help you locate the matching library record.', 420)

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
            className="fixed bottom-20 right-0 flex h-[620px] max-h-[82vh] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[390px] max-sm:left-3 max-sm:right-3 max-sm:bottom-3 max-sm:h-[70vh]"
          >
            <div className="flex shrink-0 items-center justify-between gap-2 bg-[#254194] px-4 py-3 text-white">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar size="md" className="ring-1 ring-white/45" />
                <div className="min-w-0">
                  <p className="mb-0 text-sm font-semibold">Libry Assistant</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-blue-100">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    Online
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white bg-white text-[#254194] shadow-sm transition hover:bg-blue-50"
                  onClick={() => {
                    if (isVoiceMode) {
                      endVoiceCall()
                      return
                    }
                    startVoiceCall()
                  }}
                  title={isVoiceMode ? 'Return to chat' : 'Start voice mode'}
                >
                  <i className={`bi ${isVoiceMode ? 'bi-chat-left-text' : 'bi-mic-fill'} text-sm`} />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white bg-white px-3 py-1.5 text-xs font-semibold text-[#254194] shadow-sm transition hover:bg-blue-50"
                  onClick={() => {
                    if (isVoiceMode) endVoiceCall()
                    setIsOpen(false)
                  }}
                >
                  Minimize
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isVoiceMode ? (
                <motion.div
                  key="voice-mode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative h-full flex-1 overflow-hidden bg-gradient-to-b from-[#254194] to-[#1d3276]"
                >
                  <div className="relative flex h-full flex-col items-center justify-center px-4">
                    <motion.span
                      className="absolute h-40 w-40 rounded-full border border-cyan-200/35"
                      animate={{ scale: [1, 1.22, 1], opacity: [0.45, 0.08, 0.45] }}
                      transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                      className="absolute h-52 w-52 rounded-full border border-cyan-100/20"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.32, 0.05, 0.32] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                      <Avatar size="lg" className="h-24 w-24 ring-2 ring-white/35" />
                      <p className="mt-4 text-sm font-medium text-blue-100">
                        {voiceStatus === 'speaking' ? 'Libry is speaking...' : voiceStatus === 'listening' ? 'Libry is listening...' : 'Voice mode is ready'}
                      </p>

                      <canvas ref={canvasRef} className="mt-3 h-16 w-72 max-w-full" />
                    </div>

                    <AnimatePresence>
                      {showBip && (
                        <motion.div
                          initial={{ scale: 0.3, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.2, opacity: 0 }}
                          className="absolute top-5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white"
                        >
                          Bip
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <div className="mx-auto flex max-w-[330px] items-center justify-center gap-4 rounded-2xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-md">
                      <button
                        type="button"
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-white transition ${
                          isMuted ? 'border-amber-300/80 bg-amber-500/30' : 'border-white/35 bg-white/15 hover:bg-white/25'
                        }`}
                        onClick={() => {
                          const next = !isMuted
                          setIsMuted(next)
                          if (next) {
                            stopRecognition()
                            setVoiceStatus('idle')
                          } else {
                            startRecognition()
                          }
                        }}
                        title="Mute microphone"
                      >
                        <i className={`bi ${isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'} text-base`} />
                      </button>

                      <button
                        type="button"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600"
                        onClick={endVoiceCall}
                        title="End call"
                      >
                        <i className="bi bi-telephone-x-fill text-base" />
                      </button>

                      <button
                        type="button"
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-white transition ${
                          isSpeakerOn ? 'border-white/35 bg-white/15 hover:bg-white/25' : 'border-white/20 bg-white/8'
                        }`}
                        onClick={() => {
                          const next = !isSpeakerOn
                          setIsSpeakerOn(next)
                          if (!next) window.speechSynthesis?.cancel()
                        }}
                        title="Speaker"
                      >
                        <i className={`bi ${isSpeakerOn ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'} text-base`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="text-mode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-0 flex-1 flex-col"
                >
                  <div className="flex-1 min-h-0 space-y-2 overflow-y-auto bg-slate-50 px-3 py-3">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.sender === 'assistant' && <Avatar size="sm" className="shrink-0" />}
                        <div
                          className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                            message.sender === 'user'
                              ? 'ml-auto bg-blue-100 text-slate-800'
                              : 'bg-[#f1f5f9] text-slate-800'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-end gap-2">
                        <Avatar size="sm" className="shrink-0" />
                        <div className="rounded-2xl bg-[#f1f5f9] px-3 py-2 text-slate-700 shadow-sm">
                          <div className="flex items-center gap-1.5">
                            <motion.span
                              className="h-1.5 w-1.5 rounded-full bg-slate-400"
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
                            />
                            <motion.span
                              className="h-1.5 w-1.5 rounded-full bg-slate-400"
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }}
                            />
                            <motion.span
                              className="h-1.5 w-1.5 rounded-full bg-slate-400"
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.24 }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Upload file"
                      >
                        <i className="bi bi-paperclip text-[17px]" />
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
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#254194] p-1.5 text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#1f357a]"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open Libry assistant"
      >
        {isOpen ? (
          <i className="bi bi-x-lg text-lg" />
        ) : (
          <Avatar size="lg" className="h-10 w-10 ring-2 ring-white/35" />
        )}
      </button>
    </div>
  )
}

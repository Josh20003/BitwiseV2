import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Send } from 'lucide-react'
import { apiService } from '@/services/api.service'
import bitbotIdle from '@/assets/bitbot/idle.svg'
import { resetHomepageTour } from '@/components/GlobalOnboardingTour'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'

interface Message {
  role: 'user' | 'bot'
  content: string
}

const QUICK_ACTIONS = [
  { label: 'Start Learning', action: 'navigate', to: '/roadmap' },
  { label: 'Calculator', action: 'navigate', to: '/calculator' },
  { label: 'Converter', action: 'navigate', to: '/converter' },
  { label: 'K-Maps', action: 'navigate', to: '/karnaughMaps' },
  { label: 'Circuits', action: 'navigate', to: '/digitalCircuit' },
  { label: 'Restart Tour', action: 'tour', to: '' },
]

export default function GlobalAiBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content:
        "Hello there! I'm **BitBot**, your digital guide here at Bitwise! \n\nWhether you're looking to master logic gates, convert between binary and hex, solve Karnaugh maps, or build digital circuits, I'm here to help you power up your computer science skills.\n\nWhat would you like to explore today? We can dive into a lesson, work through a problem, or check out one of our interactive tools!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const data = await apiService.post<{ response: string }>('/ai/chat', {
        message: userMsg.content,
      })
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: data.response || "I'm not sure how to answer that. Try asking about Boolean algebra!",
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: "I'm having trouble connecting right now. Try again in a moment!",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[number]) => {
    if (action.action === 'navigate') {
      navigate({ to: action.to })
      setOpen(false)
    } else if (action.action === 'tour') {
      resetHomepageTour(user?.id)
      setOpen(false)
      window.location.href = '/'
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              width: '370px',
              maxWidth: 'calc(100vw - 40px)',
              height: '500px',
              maxHeight: 'calc(100vh - 120px)',
              marginBottom: '12px',
              background: '#1a1f35',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(110, 97, 255, 0.2)',
              border: '1px solid rgba(110, 97, 255, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header — Bitwise navy/purple gradient */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                background: 'linear-gradient(135deg, #29314d, #1a1f35)',
                borderBottom: '1px solid rgba(110, 97, 255, 0.2)',
              }}
            >
              <img src={bitbotIdle} alt="BitBot" style={{ width: '36px', height: '36px' }} />
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#f1f6f1',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  BitBot Assistant
                </h3>
                <p style={{ margin: 0, fontSize: '11px', color: '#8b93a7' }}>
                  Your AI learning guide
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#8b93a7',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                  e.currentTarget.style.color = '#f1f6f1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.color = '#8b93a7'
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, #6e61ff, #9b51e0)'
                          : 'rgba(255, 255, 255, 0.06)',
                      color: msg.role === 'user' ? '#ffffff' : '#c5cad3',
                      border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      padding: '12px 18px',
                      borderRadius: '16px 16px 16px 4px',
                      display: 'flex',
                      gap: '5px',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: '#6e61ff',
                          animation: 'bounce 1.4s infinite',
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '0 14px 8px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action)}
                    style={{
                      fontSize: '11px',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      border: '1px solid rgba(110, 97, 255, 0.25)',
                      background: 'rgba(110, 97, 255, 0.08)',
                      color: '#dac3ff',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(110, 97, 255, 0.2)'
                      e.currentTarget.style.borderColor = 'rgba(110, 97, 255, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(110, 97, 255, 0.08)'
                      e.currentTarget.style.borderColor = 'rgba(110, 97, 255, 0.25)'
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div style={{ padding: '8px 14px 14px' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '14px',
                  padding: '8px 12px',
                  border: '1px solid rgba(110, 97, 255, 0.15)',
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask BitBot anything..."
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    color: '#f1f6f1',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  style={{
                    padding: '7px',
                    borderRadius: '10px',
                    border: 'none',
                    background:
                      !input.trim() || loading
                        ? 'rgba(110, 97, 255, 0.2)'
                        : 'linear-gradient(135deg, #6e61ff, #9b51e0)',
                    color: 'white',
                    cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button — Bitwise purple gradient */}
      <motion.button
        id="global-ai-bot-trigger"
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6e61ff, #9b51e0)',
          boxShadow: '0 8px 30px rgba(110, 97, 255, 0.45)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 0.3s',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 12px 40px rgba(110, 97, 255, 0.6)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow =
            '0 8px 30px rgba(110, 97, 255, 0.45)'
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X style={{ width: '24px', height: '24px', color: 'white' }} />
            </motion.div>
          ) : (
            <motion.img
              key="bot"
              src={bitbotIdle}
              alt="BitBot"
              style={{ width: '38px', height: '38px' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            />
          )}
        </AnimatePresence>
        {!open && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              background: '#27ae60',
              borderRadius: '50%',
              border: '2px solid #1a1f35',
              animation: 'pulse 2s infinite',
            }}
          />
        )}
      </motion.button>
    </div>
  )
}

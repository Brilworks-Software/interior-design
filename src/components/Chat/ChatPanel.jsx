import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, X, Sparkles } from 'lucide-react'
import { parseChatMessage } from '../../utils/chatParser'
import useDesignerStore from '../../store/useDesignerStore'

const SUGGESTIONS = [
  'Design a bedroom with bed, nightstand, study table, chair, rug, wardrobe and sofa',
  'Set up a living room with sofa, coffee table, TV stand, rug and 2 armchairs',
  'Design a kitchen with counter, island, fridge, stove, sink and 3 bar stools',
  'Large open kitchen with counter, fridge, stove, sink, dishwasher and dining table',
]

export default function ChatPanel() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! Describe the room you want and I\'ll set it up for you. Try: "Design a bedroom with bed, nightstand, study table, chair, rug, wardrobe and sofa"',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const setupFromChat = useDesignerStore((s) => s.setupFromChat)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  function handleSend(text) {
    const msg = (text || input).trim()
    if (!msg) return

    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)

    // Parse after a short delay for UX feel
    setTimeout(() => {
      const parsed = parseChatMessage(msg)
      setMessages((prev) => [...prev, { role: 'assistant', text: parsed.message }])
      setLoading(false)

      // Auto-apply after showing the message
      setTimeout(() => {
        setupFromChat(parsed)
        setOpen(false)
      }, 1200)
    }, 500)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Sparkles size={18} />
        Design with AI
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-amber-500 text-white">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} />
          <span className="font-semibold text-sm">Room Designer Chat</span>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 hover:bg-amber-600 rounded">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 380 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-xl rounded-bl-sm text-sm text-gray-500">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="text-xs px-2.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-left"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your room..."
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

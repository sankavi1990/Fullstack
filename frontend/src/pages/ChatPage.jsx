import { useState, useEffect, useRef } from 'react'
import API from '../services/api'

function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [clearing, setClearing] = useState(false)
  const bottomRef = useRef(null)

  // Load chat history on page load
  useEffect(() => {
    fetchHistory()
  }, [])

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchHistory = async () => {
    try {
      const response = await API.get('/chat/history/')
    //   console.log("History response:", response.data)  // ← debug
      const history = response.data.history

      // Convert history to chat bubbles format
      const bubbles = []
      history.forEach((chat) => {
        bubbles.push({ role: 'user', text: chat.message, id: `u-${chat.id}` })
        bubbles.push({ role: 'ai', text: chat.response, id: `a-${chat.id}` })
      })
      setMessages(bubbles)
    } catch (err) {
      console.error('History error:', err)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMessage, id: Date.now() }
    ])

    setLoading(true)

    try {
      const response = await API.post('/chat/send/', {
        message: userMessage
      })

      // Show AI response
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: response.data.response, id: Date.now() + 1 }
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: '⚠️ Something went wrong. Please try again.',
          id: Date.now() + 1
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    setClearing(true)
    try {
      await API.delete('/chat/clear/')
      setMessages([])
    } catch (err) {
      console.error('Clear error:', err)
    } finally {
      setClearing(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h5 style={{ margin: 0 }}>🤖 AI Chat Assistant</h5>
          <small style={{ color: '#a5b4fc' }}>Powered by Groq AI</small>
        </div>
        <button
          onClick={handleClear}
          style={styles.clearBtn}
          disabled={clearing}
        >
          {clearing ? 'Clearing...' : '🗑️ Clear Chat'}
        </button>
      </div>

      {/* Chat Messages */}
      <div style={styles.chatBox}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <p style={{ fontSize: '2rem' }}>🤖</p>
            <p>Hi! I am your AI Assistant.</p>
            <p style={{ color: '#888', fontSize: '14px' }}>
              Ask me anything to get started!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.messageRow,
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {/* AI Avatar */}
            {msg.role === 'ai' && (
              <div style={styles.avatar}>🤖</div>
            )}

            {/* Message Bubble */}
            <div
              style={{
                ...styles.bubble,
                backgroundColor: msg.role === 'user' ? '#4f46e5' : '#f1f5f9',
                color: msg.role === 'user' ? 'white' : '#1e293b',
                borderRadius: msg.role === 'user'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px'
              }}
            >
              {msg.text}
            </div>

            {/* User Avatar */}
            {msg.role === 'user' && (
              <div style={styles.avatar}>👤</div>
            )}
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
            <div style={styles.avatar}>🤖</div>
            <div style={{ ...styles.bubble, backgroundColor: '#f1f5f9' }}>
              <span style={styles.typing}>
                <span>●</span><span>●</span><span>●</span>
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message... (Enter to send)"
          style={styles.textarea}
          rows={2}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          style={{
            ...styles.sendBtn,
            backgroundColor: loading ? '#a5b4fc' : '#4f46e5'
          }}
          disabled={loading}
        >
          {loading ? '...' : '➤'}
        </button>
      </div>

    </div>
  )
}

const styles = {
  container: {
    display: 'flex', flexDirection: 'column',
    height: '90vh', maxWidth: '800px',
    margin: '0 auto', padding: '1rem'
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#4f46e5',
    color: 'white', padding: '1rem 1.5rem',
    borderRadius: '12px 12px 0 0'
  },
  clearBtn: {
    padding: '6px 14px', backgroundColor: 'transparent',
    color: 'white', border: '1px solid white',
    borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
  },
  chatBox: {
    flex: 1, overflowY: 'auto', padding: '1.5rem',
    backgroundColor: 'white', display: 'flex',
    flexDirection: 'column', gap: '1rem'
  },
  emptyState: {
    textAlign: 'center', margin: 'auto',
    color: '#64748b'
  },
  messageRow: {
    display: 'flex', alignItems: 'flex-end', gap: '8px'
  },
  avatar: {
    fontSize: '1.5rem', flexShrink: 0
  },
  bubble: {
    padding: '10px 16px', maxWidth: '70%',
    fontSize: '15px', lineHeight: '1.5',
    whiteSpace: 'pre-wrap', wordBreak: 'break-word'
  },
  inputArea: {
    display: 'flex', gap: '10px', padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0 0 12px 12px',
    border: '1px solid #e2e8f0', borderTop: 'none'
  },
  textarea: {
    flex: 1, padding: '10px',
    borderRadius: '8px', border: '1px solid #cbd5e1',
    fontSize: '14px', resize: 'none',
    fontFamily: 'inherit'
  },
  sendBtn: {
    padding: '0 20px', color: 'white',
    border: 'none', borderRadius: '8px',
    fontSize: '1.2rem', cursor: 'pointer'
  },
  typing: {
    display: 'flex', gap: '4px', fontSize: '20px'
  }
}

export default ChatPage
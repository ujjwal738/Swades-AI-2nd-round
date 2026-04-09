import { useEffect, useMemo, useState } from 'react'

type ChatRole = 'user' | 'agent'
type ChatMessage = { role: ChatRole; content: string }

export function App() {
  const [conversationId, setConversationId] = useState('')
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('conversationId')
    if (saved) setConversationId(saved)
  }, [])

  useEffect(() => {
    if (conversationId) localStorage.setItem('conversationId', conversationId)
  }, [conversationId])

  const canSend = useMemo(() => {
    return conversationId.trim().length > 0 && input.trim().length > 0 && !typing
  }, [conversationId, input, typing])

  async function onSend() {
    if (!canSend) return

    const text = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setTyping(true)

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ conversationId: conversationId.trim(), message: text }),
      })

      const data = (await res.json().catch(() => null)) as any
      if (!res.ok) {
        const msg = typeof data?.error === 'string' ? data.error : `Request failed (${res.status})`
        setMessages((prev) => [...prev, { role: 'agent', content: `Error: ${msg}` }])
        return
      }

      const reply = typeof data?.response === 'string' ? data.response : '(no response)'
      setMessages((prev) => [...prev, { role: 'agent', content: reply }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error'
      setMessages((prev) => [...prev, { role: 'agent', content: `Error: ${msg}` }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: 12, fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginTop: 0 }}>Chat</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={conversationId}
          onChange={(e) => setConversationId(e.target.value)}
          placeholder="conversationId (required)"
          style={{ flex: 1, padding: 8 }}
        />
      </div>

      <div
        style={{
          border: '1px solid #ddd',
          padding: 12,
          minHeight: 240,
          maxHeight: 420,
          overflowY: 'auto',
          marginBottom: 12,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: '#666' }}>Send a message to begin.</div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <strong>{m.role === 'user' ? 'You' : 'Agent'}:</strong> {m.content}
            </div>
          ))
        )}

        {typing && <div style={{ color: '#666' }}>Typing...</div>}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          style={{ flex: 1, padding: 8 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend()
          }}
          disabled={typing}
        />
        <button onClick={onSend} disabled={!canSend} style={{ padding: '8px 12px' }}>
          Send
        </button>
      </div>
    </div>
  )
}


import { useState } from 'react'

export default function CacheDebug({ open, onClose }) {
  const [prefix, setPrefix] = useState('')
  const [result, setResult] = useState(null)

  async function lookup() {
    if (!prefix.trim()) return
    try {
      const res = await fetch(`/cache/debug?prefix=${encodeURIComponent(prefix.trim())}`)
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ error: 'Request failed' })
    }
  }

  return (
    <div
      style={{
        ...s.drawer,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
      }}
      aria-hidden={!open}
    >
      <div style={s.header}>
        <span style={s.title}>CACHE DEBUG</span>
        <button style={s.closeBtn} onClick={onClose} aria-label="Close debug panel">✕</button>
      </div>
      <div style={s.body}>
        <div style={s.row}>
          <input
            type="text"
            placeholder="Enter prefix…"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            style={s.input}
          />
          <button style={s.inspectBtn} onClick={lookup}>Inspect</button>
        </div>
        {result && (
          <pre style={s.output}>{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}

const s = {
  drawer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '280px',
    background: '#0A0A0A',
    borderTop: '1px solid #2A2A2A',
    zIndex: 1000,
    transition: 'transform 200ms ease',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderBottom: '1px solid #2A2A2A',
    flexShrink: 0,
  },
  title: {
    fontFamily: 'ui-monospace, Consolas, monospace',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6C63FF',
    letterSpacing: '0.1em',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#555555',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '2px 6px',
    lineHeight: 1,
  },
  body: {
    flex: 1,
    padding: '14px 20px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: '#111111',
    border: '1px solid #2A2A2A',
    borderRadius: '6px',
    padding: '7px 12px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontFamily: 'ui-monospace, Consolas, monospace',
    outline: 'none',
  },
  inspectBtn: {
    background: '#6C63FF',
    border: 'none',
    borderRadius: '6px',
    padding: '7px 16px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'ui-monospace, Consolas, monospace',
    whiteSpace: 'nowrap',
  },
  output: {
    fontFamily: 'ui-monospace, Consolas, monospace',
    fontSize: '12px',
    color: '#22C55E',
    lineHeight: '1.6',
    overflowX: 'auto',
    whiteSpace: 'pre',
  },
}

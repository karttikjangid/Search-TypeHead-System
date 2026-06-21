import { useState } from 'react'

const styles = {
  card: {
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
    borderRadius: '10px',
    padding: '20px',
  },
  heading: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
  },
  row: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    background: '#0F0F0F',
    border: '1px solid #2A2A2A',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  button: {
    background: '#6C63FF',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  },
  result: {
    marginTop: '12px',
    background: '#0F0F0F',
    border: '1px solid #2A2A2A',
    borderRadius: '6px',
    padding: '12px',
    fontFamily: 'ui-monospace, Consolas, monospace',
    fontSize: '12px',
    color: '#888888',
    whiteSpace: 'pre',
    overflowX: 'auto',
    lineHeight: '1.6',
  },
  hitBadge: {
    display: 'inline-block',
    padding: '1px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
}

export default function CacheDebug() {
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

  function formatResult(data) {
    if (!data) return ''
    const lines = [
      `prefix   : ${data.prefix}`,
      `node     : ${data.node}`,
      `hit      : ${data.hit ? '✓ HIT' : '✗ MISS'}`,
      `cached   : ${data.cached_suggestions?.length ?? 0} suggestions`,
    ]
    if (data.cached_suggestions?.length) {
      data.cached_suggestions.slice(0, 5).forEach((s, i) => {
        lines.push(`  [${i + 1}] ${s.query} (${s.count})`)
      })
    }
    return lines.join('\n')
  }

  return (
    <div style={styles.card}>
      <div style={styles.heading}>Cache Debug</div>
      <div style={styles.row}>
        <input
          type="text"
          placeholder="Enter prefix…"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && lookup()}
          style={styles.input}
        />
        <button style={styles.button} onClick={lookup}>
          Inspect
        </button>
      </div>
      {result && (
        <div style={styles.result}>{formatResult(result)}</div>
      )}
    </div>
  )
}

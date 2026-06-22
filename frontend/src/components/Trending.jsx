import { useState, useEffect } from 'react'

const s = {
  card: {
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
    borderRadius: '10px',
    padding: '20px',
  },
  heading: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '16px',
  },
  empty: { color: '#888888', fontSize: '13px', padding: '8px 0' },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column' },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 0',
    borderBottom: '1px solid #222222',
  },
  rank: {
    color: '#444444',
    fontSize: '12px',
    width: '18px',
    textAlign: 'right',
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
  },
  query: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: '13px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  score: { color: '#888888', fontSize: '11px', flexShrink: 0, fontVariantNumeric: 'tabular-nums' },
}

export default function Trending({ refreshKey = 0 }) {
  const [items, setItems] = useState([])

  function load() {
    fetch('/trending')
      .then((r) => r.json())
      .then((d) => setItems(d.trending || []))
      .catch(() => {})
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (refreshKey > 0) load()
  }, [refreshKey])

  return (
    <div style={s.card}>
      <div style={s.heading}>Trending</div>
      {items.length === 0 ? (
        <div style={s.empty}>No trending searches yet</div>
      ) : (
        <ul style={s.list}>
          {items.slice(0, 10).map((item, i) => (
            <li
              key={item.query}
              style={{
                ...s.item,
                ...(i === items.length - 1 ? { borderBottom: 'none' } : {}),
              }}
            >
              <span style={s.rank}>{i + 1}</span>
              <span style={s.query}>{item.query}</span>
              <span style={s.score}>{item.score.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

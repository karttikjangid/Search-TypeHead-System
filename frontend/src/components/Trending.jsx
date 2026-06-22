import { useState, useEffect } from 'react'

export default function Trending({ refreshKey = 0 }) {
  const [items, setItems] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(-1)

  function load() {
    setRefreshing(true)
    fetch('/trending')
      .then((r) => r.json())
      .then((d) => setItems(d.trending || []))
      .catch(() => {})
      .finally(() => setRefreshing(false))
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (refreshKey > 0) load()
  }, [refreshKey])

  const displayItems = items.slice(0, 10)

  return (
    <div style={s.card}>
      <div style={s.header}>
        <span style={s.heading}>TRENDING</span>
        <span
          style={{
            ...s.dot,
            background: refreshing ? '#22C55E' : '#333333',
            animation: refreshing ? 'pulse-dot 1s ease-in-out infinite' : 'none',
          }}
        />
      </div>
      {displayItems.length === 0 ? (
        <p style={s.empty}>No trending searches yet</p>
      ) : (
        <ul style={s.list}>
          {displayItems.map((item, i) => (
            <li
              key={item.query}
              style={{
                ...s.item,
                background: hoveredIndex === i ? '#222222' : 'transparent',
                borderBottom: i === displayItems.length - 1 ? 'none' : '1px solid #1F1F1F',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(-1)}
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

const s = {
  card: {
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
    borderRadius: '12px',
    padding: '20px',
    position: 'sticky',
    top: '48px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  heading: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
    transition: 'background 0.3s',
  },
  empty: {
    color: '#555555',
    fontSize: '13px',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '16px 0',
  },
  list: { listStyle: 'none' },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 6px',
    transition: 'background 0.1s',
    borderRadius: '4px',
  },
  rank: {
    color: '#555555',
    fontSize: '12px',
    width: '20px',
    textAlign: 'right',
    flexShrink: 0,
    fontFamily: 'ui-monospace, Consolas, monospace',
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
  score: {
    color: '#6C63FF',
    fontSize: '12px',
    flexShrink: 0,
    fontFamily: 'ui-monospace, Consolas, monospace',
    fontVariantNumeric: 'tabular-nums',
  },
}

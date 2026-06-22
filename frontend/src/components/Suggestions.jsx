export default function Suggestions({ suggestions, highlightedIndex, onSelect }) {
  if (!suggestions.length) return null

  return (
    <div style={s.dropdown}>
      {suggestions.slice(0, 10).map((item, i) => {
        const highlighted = i === highlightedIndex
        return (
          <div
            key={item.query}
            style={{
              ...s.item,
              background: highlighted ? '#2A2A2A' : 'transparent',
              borderLeft: highlighted ? '2px solid #6C63FF' : '2px solid transparent',
            }}
            onMouseDown={(e) => { e.preventDefault(); onSelect(item.query) }}
          >
            <span style={s.query}>{item.query}</span>
            <span style={s.count}>{item.count.toLocaleString()}</span>
          </div>
        )
      })}
    </div>
  )
}

const s = {
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
    borderRadius: '8px',
    overflow: 'hidden',
    zIndex: 100,
    animation: 'suggestions-in 150ms ease forwards',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 14px 0 12px',
    height: '44px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background 0.1s',
  },
  query: { color: '#FFFFFF', fontSize: '14px' },
  count: { color: '#555555', fontSize: '12px', fontVariantNumeric: 'tabular-nums' },
}

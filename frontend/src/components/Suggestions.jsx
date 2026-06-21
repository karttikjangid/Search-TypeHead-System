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
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  itemHighlighted: { background: '#2A2A2A' },
  query: { color: '#FFFFFF', fontSize: '14px' },
  count: { color: '#888888', fontSize: '12px', fontVariantNumeric: 'tabular-nums' },
}

export default function Suggestions({ suggestions, highlightedIndex, onSelect }) {
  if (!suggestions.length) return null

  return (
    <div style={s.dropdown}>
      {suggestions.map((item, i) => (
        <div
          key={item.query}
          style={{ ...s.item, ...(i === highlightedIndex ? s.itemHighlighted : {}) }}
          onMouseDown={(e) => { e.preventDefault(); onSelect(item.query) }}
        >
          <span style={s.query}>{item.query}</span>
          <span style={s.count}>{item.count.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

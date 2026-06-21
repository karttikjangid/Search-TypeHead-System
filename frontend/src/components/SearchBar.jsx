import { useState, useRef, useEffect } from 'react'

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '8px' },
  row: {
    display: 'flex',
    alignItems: 'center',
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
    borderRadius: '8px',
    padding: '0 14px',
    gap: '10px',
    transition: 'border-color 0.15s',
  },
  rowFocused: { borderColor: '#6C63FF' },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#FFFFFF',
    fontSize: '15px',
    padding: '13px 0',
    fontFamily: 'inherit',
    caretColor: '#6C63FF',
  },
  spinner: {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    border: '2px solid #2A2A2A',
    borderTopColor: '#6C63FF',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  },
  error: { fontSize: '12px', color: '#FF6B6B', paddingLeft: '2px' },
}

export default function SearchBar({
  suggestions,
  highlightedIndex,
  onHighlightChange,
  onFetch,
  onSubmit,
  onClose,
  isLoading,
  error,
}) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onFetch(query), 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      onHighlightChange(Math.min(highlightedIndex + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      onHighlightChange(Math.max(highlightedIndex - 1, -1))
    } else if (e.key === 'Enter') {
      const q = highlightedIndex >= 0 ? suggestions[highlightedIndex]?.query : query
      if (q) { setQuery(q); onSubmit(q) }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div style={s.wrapper}>
      <div style={{ ...s.row, ...(focused ? s.rowFocused : {}) }}>
        <input
          type="text"
          placeholder="Search anything…"
          value={query}
          style={s.input}
          onChange={(e) => { setQuery(e.target.value); onHighlightChange(-1) }}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          spellCheck={false}
        />
        {isLoading && <span style={s.spinner} />}
      </div>
      {error && <span style={s.error}>{error}</span>}
    </div>
  )
}

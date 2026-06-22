import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

const SearchBar = forwardRef(function SearchBar({
  suggestions,
  highlightedIndex,
  onHighlightChange,
  onFetch,
  onSubmit,
  onClose,
  onErrorDismiss,
  isLoading,
  error,
}, ref) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef(null)
  const lastSubmittedRef = useRef(null)

  useImperativeHandle(ref, () => ({
    setValue(val) {
      lastSubmittedRef.current = val
      setQuery(val)
    },
  }))

  useEffect(() => {
    if (query === lastSubmittedRef.current) {
      lastSubmittedRef.current = null
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onFetch(query), 300)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  function handleChange(e) {
    setQuery(e.target.value)
    onHighlightChange(-1)
    if (error) onErrorDismiss()
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      onHighlightChange(Math.min(highlightedIndex + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      onHighlightChange(Math.max(highlightedIndex - 1, -1))
    } else if (e.key === 'Enter') {
      const q = highlightedIndex >= 0 ? suggestions[highlightedIndex]?.query : query
      if (q) onSubmit(q)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  function handleClear() {
    setQuery('')
    onFetch('')
    onHighlightChange(-1)
    onClose()
    if (error) onErrorDismiss()
  }

  return (
    <div style={s.wrapper}>
      <div style={{ ...s.row, ...(focused ? s.rowFocused : {}) }}>
        <span style={s.icon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" stroke="#555555" strokeWidth="1.5" />
            <path d="M10.5 10.5L13.5 13.5" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          className="search-input"
          type="text"
          placeholder="Search anything…"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          spellCheck={false}
        />
        {isLoading && <span style={s.spinner} />}
        {!isLoading && query.length > 0 && (
          <button
            style={s.clearBtn}
            onMouseDown={(e) => { e.preventDefault(); handleClear() }}
            tabIndex={-1}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 2L12 12M12 2L2 12" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {error && <span style={s.error}>{error}</span>}
    </div>
  )
})

export default SearchBar

const s = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '8px' },
  row: {
    display: 'flex',
    alignItems: 'center',
    background: '#1A1A1A',
    border: '1.5px solid #2A2A2A',
    borderRadius: '12px',
    padding: '0 14px',
    gap: '10px',
    height: '56px',
    transition: 'border-color 0.15s',
  },
  rowFocused: { borderColor: '#6C63FF' },
  icon: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid #333333',
    borderTopColor: '#6C63FF',
    animation: 'spin 0.6s linear infinite',
    flexShrink: 0,
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  error: { fontSize: '12px', color: '#EF4444' },
}

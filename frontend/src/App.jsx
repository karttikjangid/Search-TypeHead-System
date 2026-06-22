import { useState, useRef } from 'react'
import SearchBar from './components/SearchBar'
import Suggestions from './components/Suggestions'
import Trending from './components/Trending'
import CacheDebug from './components/CacheDebug'

const s = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '0 32px',
    maxWidth: '1120px',
    margin: '0 auto',
    width: '100%',
  },
  header: {
    padding: '28px 0 24px',
    borderBottom: '1px solid #2A2A2A',
    marginBottom: '32px',
  },
  title: { fontSize: '18px', fontWeight: '600', color: '#FFFFFF', letterSpacing: '-0.3px' },
  accent: { color: '#6C63FF' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '32px',
    flex: 1,
  },
  left: { display: 'flex', flexDirection: 'column', gap: '24px' },
  right: { display: 'flex', flexDirection: 'column', gap: '24px' },
  searchArea: { position: 'relative' },
}

export default function App() {
  const [suggestions, setSuggestions] = useState([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [trendingKey, setTrendingKey] = useState(0)
  const searchBarRef = useRef(null)

  async function fetchSuggestions(prefix) {
    if (!prefix) {
      setSuggestions([])
      setError(null)
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/suggest?q=${encodeURIComponent(prefix)}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSuggestions(data.suggestions || [])
      setError(null)
    } catch {
      setError('Failed to fetch suggestions')
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSelect(query) {
    if (!query.trim()) return
    searchBarRef.current?.setValue(query)
    setSuggestions([])
    setHighlightedIndex(-1)
    try {
      await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      })
    } catch {
      // fire-and-forget
    }
    setTrendingKey((k) => k + 1)
  }

  return (
    <div style={s.app}>
      <header style={s.header}>
        <span style={s.title}>
          <span style={s.accent}>TypeHead</span> Search
        </span>
      </header>

      <div style={s.grid}>
        <div style={s.left}>
          <div style={s.searchArea}>
            <SearchBar
              ref={searchBarRef}
              suggestions={suggestions}
              highlightedIndex={highlightedIndex}
              onHighlightChange={setHighlightedIndex}
              onFetch={fetchSuggestions}
              onSubmit={handleSelect}
              onClose={() => { setSuggestions([]); setHighlightedIndex(-1) }}
              isLoading={isLoading}
              error={error}
            />
            <Suggestions
              suggestions={suggestions}
              highlightedIndex={highlightedIndex}
              onSelect={handleSelect}
            />
          </div>
          <CacheDebug />
        </div>

        <div style={s.right}>
          <Trending refreshKey={trendingKey} />
        </div>
      </div>
    </div>
  )
}

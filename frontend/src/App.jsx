import { useState, useRef, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import Suggestions from './components/Suggestions'
import Trending from './components/Trending'
import CacheDebug from './components/CacheDebug'

export default function App() {
  const [suggestions, setSuggestions] = useState([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [trendingKey, setTrendingKey] = useState(0)
  const [debugOpen, setDebugOpen] = useState(false)
  const searchBarRef = useRef(null)
  const errorTimerRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setDebugOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (error) {
      clearTimeout(errorTimerRef.current)
      errorTimerRef.current = setTimeout(() => setError(null), 3000)
    }
    return () => clearTimeout(errorTimerRef.current)
  }, [error])

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
      setError('Could not fetch suggestions')
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
    <>
      <div className="page-layout">
        <div className="main-grid">
          <div className="left-col">
            <div>
              <h1 style={s.title}>
                <span style={s.accent}>TypeHead</span>
                <span style={s.titleWhite}> Search</span>
              </h1>
              <p style={s.subtitle}>Fast prefix search across 40k queries</p>
            </div>
            <div style={s.searchArea}>
              <SearchBar
                ref={searchBarRef}
                suggestions={suggestions}
                highlightedIndex={highlightedIndex}
                onHighlightChange={setHighlightedIndex}
                onFetch={fetchSuggestions}
                onSubmit={handleSelect}
                onClose={() => { setSuggestions([]); setHighlightedIndex(-1) }}
                onErrorDismiss={() => setError(null)}
                isLoading={isLoading}
                error={error}
              />
              <Suggestions
                suggestions={suggestions}
                highlightedIndex={highlightedIndex}
                onSelect={handleSelect}
              />
            </div>
          </div>
          <div className="right-col">
            <Trending refreshKey={trendingKey} />
          </div>
        </div>
      </div>
      <CacheDebug open={debugOpen} onClose={() => setDebugOpen(false)} />
    </>
  )
}

const s = {
  title: {
    fontSize: '32px',
    fontWeight: '600',
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
    marginBottom: '8px',
  },
  accent: { color: '#6C63FF' },
  titleWhite: { color: '#FFFFFF' },
  subtitle: { color: '#888888', fontSize: '14px', fontWeight: '400' },
  searchArea: { position: 'relative' },
}

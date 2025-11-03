import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Fuse from 'fuse.js'
import { guides } from '../content'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [canGoBack, setCanGoBack] = React.useState<boolean>(false)
  const [q, setQ] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<{ id: string, title: string }[]>([])
  const [activeIndex, setActiveIndex] = React.useState<number>(-1)
  const fuse = React.useMemo(() => new Fuse(guides, {
    includeScore: true,
    threshold: 0.4,
    keys: ['title', 'description', 'tags']
  }), [])
  const debouncedSearch = React.useMemo(() => {
    let timer: any
    return (text: string) => {
      setLoading(true)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        if (text.trim().length === 0) {
          setSuggestions([])
          setLoading(false)
          return
        }
        const res = fuse.search(text).slice(0, 8).map(r => ({ id: r.item.id, title: r.item.title }))
        setSuggestions(res)
        setLoading(false)
      }, 200)
    }
  }, [fuse])
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQ(value)
    setOpen(true)
    setActiveIndex(-1)
    debouncedSearch(value)
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        navigate(`/guide/${suggestions[activeIndex].id}`)
        setOpen(false)
      } else {
        onSubmit(e as any)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }
  const onBlur = () => {
    setTimeout(() => setOpen(false), 150) // allow click
  }
  React.useEffect(() => {
    // Heuristic: allow back when history length suggests prior entries
    // Works across major browsers; preserves state via native back.
    setCanGoBack(window.history.length > 1)
  }, [location])
  const onBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (canGoBack) {
      navigate(-1)
    } else {
      // Fallback to home if no prior entry
      navigate('/')
    }
  }
  return (
    <header className="navbar" role="banner">
      <div className="nav-inner">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          disabled={!canGoBack && location.pathname === '/'}
          aria-label="Go back to previous page"
          title="Back"
        >
          <span aria-hidden>←</span>
          <span className="back-btn-text" aria-hidden> Back</span>
        </button>
        <Link to="/" className="brand" aria-label="System Design Learning Home">
          <span className="brand-logo" aria-hidden>SD101</span>
          <span className="brand-name">Learn System Design</span>
        </Link>
        <form onSubmit={onSubmit} role="search" aria-label="Search guides" className="search">
          <input
            id="searchbox"
            type="search"
            placeholder="Search topics (e.g., APIs, Kafka)"
            aria-label="Search topics"
            aria-controls="search-suggestions"
            aria-expanded={open}
            role="combobox"
            value={q}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            autoComplete="off"
          />
          <button type="submit" aria-label="Search">Search</button>
          {open && (
            <ul id="search-suggestions" role="listbox" className="suggestions" aria-label="Search suggestions">
              {loading && (<li role="alert" className="suggestion">Searching…</li>)}
              {!loading && suggestions.length === 0 && q.trim().length > 0 && (
                <li role="alert" className="suggestion">No suggestions</li>
              )}
              {!loading && suggestions.map((s, i) => (
                <li
                  key={s.id}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={`suggestion ${i === activeIndex ? 'active' : ''}`}
                  onMouseDown={() => { navigate(`/guide/${s.id}`); setOpen(false) }}
                >
                  {s.title}
                </li>
              ))}
            </ul>
          )}
        </form>
        <nav className="links" aria-label="Primary">
          <Link to="/bookmarks">Bookmarks</Link>
        </nav>
      </div>
    </header>
  )
}
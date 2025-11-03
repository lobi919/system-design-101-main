import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Fuse from 'fuse.js'
import { guides, categories } from '../content'
import { logSearch } from '../utils/searchAnalytics'

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

export default function Search() {
  const q = useQuery().get('q') || ''
  const [filterCategory, setFilterCategory] = React.useState<string>('')
  const [filterTag, setFilterTag] = React.useState<string>('')
  const [sortBy, setSortBy] = React.useState<'relevance'|'recent'|'title'>('relevance')
  const [error, setError] = React.useState<string>('')
  const fuse = React.useMemo(() => new Fuse(guides, {
    includeScore: true,
    threshold: 0.4,
    distance: 100,
    ignoreLocation: true,
    findAllMatches: true,
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.1 },
    ],
  }), [])
  // Looser matching instance for "Did you mean" suggestions
  const looseFuse = React.useMemo(() => new Fuse(guides, {
    includeScore: true,
    threshold: 0.6,
    distance: 100,
    ignoreLocation: true,
    findAllMatches: true,
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.1 },
    ],
  }), [])

  const { results, altSuggestions } = React.useMemo(() => {
    const start = performance.now()
    setError('')
    try {
      let res = q ? fuse.search(q) : []
      // Filter by selected category
      if (filterCategory) {
        res = res.filter(r => r.item.categories?.includes(filterCategory))
      }
      // Filter by tag inclusion
      if (filterTag) {
        const t = filterTag.toLowerCase()
        res = res.filter(r => r.item.tags?.some(tag => tag.toLowerCase() === t))
      }
      // Map items
      let items = res.map(r => ({ item: r.item, score: r.score ?? 1 }))
      // Sorting options
      if (sortBy === 'recent') {
        items.sort((a, b) => new Date(b.item.createdAt || 0).getTime() - new Date(a.item.createdAt || 0).getTime())
      } else if (sortBy === 'title') {
        items.sort((a, b) => a.item.title.localeCompare(b.item.title))
      } else {
        items.sort((a, b) => a.score - b.score)
      }
      const end = performance.now()
      logSearch({ query: q, resultCount: items.length, durationMs: Math.round(end - start), filters: { category: filterCategory || null, tag: filterTag || null }, sortBy })
      // Alternative suggestions when no results
      let alts: { id: string, title: string }[] = []
      if (q && items.length === 0) {
        const loose = fuse.search(q, { limit: 5, threshold: 0.6 }).map(r => ({ id: r.item.id, title: r.item.title }))
        alts = loose
      }
      return { results: items.map(i => i.item), altSuggestions: alts }
    } catch (e) {
      setError('Search failed. Please try again.')
      console.error('Search error', e)
      return { results: [], altSuggestions: [] }
    }
  }, [q, filterCategory, filterTag, sortBy, fuse])

  const suggestedCategories = categories.filter(c => c.title.toLowerCase().includes(q.toLowerCase())).slice(0, 6)

  return (
    <main className="container" role="main">
      <h1>Search</h1>
      <p className="lead">Find topics fast. Try keywords like "Redis", "API", or "Kafka".</p>
      <form className="filters" aria-label="Search filters" onSubmit={(e) => e.preventDefault()}>
        <label>
          Category
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} aria-label="Filter by category">
            <option value="">All</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
        <label>
          Tag
          <input value={filterTag} onChange={(e) => setFilterTag(e.target.value)} placeholder="e.g., cache, api, db" aria-label="Filter by tag" />
        </label>
        <label>
          Sort
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'relevance' | 'recent' | 'title')} aria-label="Sort results">
            <option value="relevance">Relevance</option>
            <option value="recent">Most recent</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </label>
      </form>
      {error && <div role="alert" className="error">{error}</div>}
      {q && suggestedCategories.length > 0 && (
        <div className="chips" aria-label="Suggested categories">
          {suggestedCategories.map(c => (
            <Link key={c.id} to={`/category/${c.id}`} className="chip" aria-label={`Go to category ${c.title}`}>{c.title}</Link>
          ))}
        </div>
      )}
      <section className="list" aria-label="Search results">
        {results.map(g => {
          const lower = q.toLowerCase()
          const title = g.title
          const idx = lower ? title.toLowerCase().indexOf(lower) : -1
          const highlighted = idx >= 0 ? (
            <span>
              {title.slice(0, idx)}
              <mark>{title.slice(idx, idx + q.length)}</mark>
              {title.slice(idx + q.length)}
            </span>
          ) : (
            <span>{title}</span>
          )
          return (
            <Link key={g.id} to={`/guide/${g.id}`} className="list-item" aria-label={`Open guide ${g.title}`}>
              <div className="li-title">{highlighted}</div>
            <div className="li-meta">{g.tags?.slice(0, 3).join(', ')}</div>
            </Link>
          )
        })}
        {q && results.length === 0 && (
          <div>
            <p>No results. Try broader terms or check spelling.</p>
            {(() => {
              // Compute alternative suggestions using a looser threshold
              const alts = q ? looseFuse.search(q, { limit: 5 }).map(r => ({ id: r.item.id, title: r.item.title })) : []
              return alts.length > 0 && (
              <div>
                <div style={{ marginBottom: 6 }}>Did you mean:</div>
                <div className="chips" aria-label="Alternative suggestions">
                  {alts.map(s => (
                    <Link key={s.id} to={`/guide/${s.id}`} className="chip" aria-label={`Open guide ${s.title}`}>{s.title}</Link>
                  ))}
                </div>
              </div>
              )
            })()}
          </div>
        )}
      </section>
    </main>
  )
}
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Fuse from 'fuse.js'
import { guides, categories } from '../content'

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

export default function Search() {
  const q = useQuery().get('q') || ''
  const fuse = React.useMemo(() => new Fuse(guides, {
    includeScore: true,
    threshold: 0.4,
    keys: ['title', 'description', 'tags']
  }), [])
  const results = q ? fuse.search(q).slice(0, 15).map(r => r.item) : []

  const suggestedCategories = categories.filter(c => c.title.toLowerCase().includes(q.toLowerCase())).slice(0, 6)

  return (
    <main className="container" role="main">
      <h1>Search</h1>
      <p className="lead">Find topics fast. Try keywords like "Redis", "API", or "Kafka".</p>
      {q && suggestedCategories.length > 0 && (
        <div className="chips" aria-label="Suggested categories">
          {suggestedCategories.map(c => (
            <Link key={c.id} to={`/category/${c.id}`} className="chip" aria-label={`Go to category ${c.title}`}>{c.title}</Link>
          ))}
        </div>
      )}
      <section className="list" aria-label="Search results">
        {results.map(g => (
          <Link key={g.id} to={`/guide/${g.id}`} className="list-item" aria-label={`Open guide ${g.title}`}>
            <div className="li-title">{g.title}</div>
            <div className="li-meta">{g.tags?.slice(0, 3).join(', ')}</div>
          </Link>
        ))}
        {q && results.length === 0 && <div>No results. Try broader terms.</div>}
      </section>
    </main>
  )
}
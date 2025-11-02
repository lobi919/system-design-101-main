import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { guidesByCategory, categories } from '../content'

export default function Category() {
  const { id } = useParams()
  const cat = categories.find(c => c.id === id)
  const guides = id ? guidesByCategory(id) : []

  return (
    <main className="container" role="main">
      <h1>{cat?.title || 'Category'}</h1>
      <p className="lead">Choose a guide. Most topics take 10–20 minutes.</p>
      <section className="list" aria-label="Guides">
        {guides.map(g => (
          <Link key={g.id} to={`/guide/${g.id}`} className="list-item" aria-label={`Open guide ${g.title}`}>
            <div className="li-title">{g.title}</div>
            <div className="li-meta">{new Date(g.createdAt || '').toLocaleDateString()}
              {g.tags?.length ? <span className="tags"> • {g.tags.slice(0,3).join(', ')}</span> : null}
            </div>
          </Link>
        ))}
        {guides.length === 0 && <div>No guides found in this category.</div>}
      </section>
    </main>
  )
}
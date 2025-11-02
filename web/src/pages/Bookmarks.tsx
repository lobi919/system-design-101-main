import React from 'react'
import { Link } from 'react-router-dom'
import { guides } from '../content'

function loadBookmarks(): string[] {
  try {
    const raw = localStorage.getItem('bookmarks')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function Bookmarks() {
  const [ids, setIds] = React.useState<string[]>(loadBookmarks())

  const remove = (id: string) => {
    const next = ids.filter(x => x !== id)
    setIds(next)
    localStorage.setItem('bookmarks', JSON.stringify(next))
  }

  const list = guides.filter(g => ids.includes(g.id))
  return (
    <main className="container" role="main">
      <h1>Bookmarks</h1>
      <p className="lead">Your saved guides for quick access.</p>
      <section className="list" aria-label="Bookmarked guides">
        {list.map(g => (
          <div key={g.id} className="list-item">
            <Link to={`/guide/${g.id}`} className="li-title">{g.title}</Link>
            <button onClick={() => remove(g.id)} aria-label={`Remove bookmark for ${g.title}`}>Remove</button>
          </div>
        ))}
        {list.length === 0 && <div>No bookmarks yet.</div>}
      </section>
    </main>
  )
}
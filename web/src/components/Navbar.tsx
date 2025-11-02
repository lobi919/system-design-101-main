import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AccessibilityControls from './AccessibilityControls'

export default function Navbar() {
  const navigate = useNavigate()
  const [q, setQ] = React.useState('')
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }
  return (
    <header className="navbar" role="banner">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="System Design Learning Home">
          <span className="brand-logo" aria-hidden>SD101</span>
          <span className="brand-name">Learn System Design</span>
        </Link>
        <form onSubmit={onSubmit} role="search" aria-label="Search guides" className="search">
          <input
            type="search"
            placeholder="Search topics (e.g., APIs, Kafka)"
            aria-label="Search topics"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" aria-label="Search">Search</button>
        </form>
        <nav className="links" aria-label="Primary">
          <Link to="/bookmarks">Bookmarks</Link>
        </nav>
        <AccessibilityControls />
      </div>
    </header>
  )
}
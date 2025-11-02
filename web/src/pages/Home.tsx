import React from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../content'

export default function Home() {
  return (
    <main className="container" role="main">
      <h1>Explore System Design</h1>
      <p className="lead">Pick a topic. Learn step by step. Earn points as you go!</p>
      <section className="grid" aria-label="Categories">
        {categories.map(cat => (
          <Link key={cat.id} to={`/category/${cat.id}`} className="card" aria-label={`Open ${cat.title} category`}>
            <div className="card-icon" aria-hidden>{cat.icon ? '🧭' : '📚'}</div>
            <div className="card-title">{cat.title}</div>
            <div className="card-desc">{cat.description || 'Learn the basics with friendly visuals and examples.'}</div>
          </Link>
        ))}
      </section>
    </main>
  )
}
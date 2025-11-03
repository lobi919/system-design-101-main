import React from 'react'
import { Link } from 'react-router-dom'
import { categories, guidesByCategory } from '../content'
import { useProgress } from '../context/ProgressContext'

export default function Home() {
  const { progress } = useProgress()
  return (
    <main className="container" role="main">
      <h1>Explore System Design</h1>
      <p className="lead">Pick a topic. Learn step by step. Earn points as you go!</p>
      <section className="grid" aria-label="Categories">
        {categories.map(cat => {
          const guides = guidesByCategory(cat.id)
          const totalSteps = guides.reduce((sum, g) => sum + (g.headings.length || 0), 0) || 1
          const doneSteps = guides.reduce((sum, g) => sum + ((progress[g.id]?.completedStepIds.length) || 0), 0)
          const pct = Math.round((doneSteps / totalSteps) * 100)
          return (
            <Link key={cat.id} to={`/category/${cat.id}`} className="card" aria-label={`Open ${cat.title} category`}>
              <div className="card-icon" aria-hidden>{cat.icon ? '🧭' : '📚'}</div>
              <div className="card-title">{cat.title}</div>
              <div className="card-desc">{cat.description || 'Learn the basics with friendly visuals and examples.'}</div>
              <div className="card-progress" aria-label={`Progress ${pct}%`}>
                <div className="bar" style={{ width: `${pct}%` }} />
                <span className="card-progress-text">{pct}%</span>
              </div>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
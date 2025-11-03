import React from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { guides } from '../content'
import { useProgress } from '../context/ProgressContext'
import HeadingIcon from '../components/HeadingIcon'
import SmartPicture from '../components/SmartPicture'
import { getCalloutsForGuide, getCalloutsForHeading } from '../callouts'
import CalloutBox from '../components/Callout'

export default function Guide() {
  const { id } = useParams()
  const guide = guides.find(g => g.id === id)
  const { progress, toggleStep } = useProgress()
  const gp = (id && progress[id]) || { completedStepIds: [], xp: 0 }

  if (!guide) return <main className="container"><h1>Guide not found</h1></main>

  const total = guide.headings.length || 1
  const done = gp.completedStepIds.length
  const pct = Math.round((done / total) * 100)

  const [bookmarked, setBookmarked] = React.useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('bookmarks')
      const ids: string[] = raw ? JSON.parse(raw) : []
      return !!(id && ids.includes(id))
    } catch { return false }
  })

  const announce = (msg: string) => {
    const el = document.querySelector('.sr')
    if (el) el.textContent = msg
  }

  const toggleBookmark = () => {
    if (!id) return
    let ids: string[] = []
    try { ids = JSON.parse(localStorage.getItem('bookmarks') || '[]') } catch {}
    const exists = ids.includes(id)
    const next = exists ? ids.filter(x => x !== id) : [...ids, id]
    localStorage.setItem('bookmarks', JSON.stringify(next))
    setBookmarked(!exists)
    announce(exists ? 'Bookmark removed' : 'Guide bookmarked')
  }

  const badge = gp.xp >= 10 ? 'Pro' : gp.xp >= 5 ? 'Learner' : 'Beginner'
  const guideCallouts = getCalloutsForGuide(guide.id)

  return (
    <main className="container guide" role="main">
      <div className="guide-header">
        <h1>{guide.title}</h1>
        <div className="progress" aria-label={`Progress ${pct}%`}>
          <div className="bar" style={{ width: `${pct}%` }} />
          <span className="progress-text" aria-live="polite">{pct}% complete • XP: {gp.xp} • Badge: {badge}</span>
        </div>
        <button onClick={toggleBookmark} aria-pressed={bookmarked} aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}>
          {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
        </button>
      </div>
      <div className="concept-chips" aria-label="Concept map">
        {guide.headings.slice(0, 8).map(h => (
          <span key={h.id} className="concept-chip">{h.text}</span>
        ))}
      </div>
      <div className="guide-layout">
        <aside className="steps" aria-label="Tutorial steps">
          <h2>Steps</h2>
          <ul>
            {guide.headings.map(h => (
              <li key={h.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={gp.completedStepIds.includes(h.id)}
                    onChange={() => { if (id) { toggleStep(id, h.id); announce('Progress updated'); } }}
                    aria-label={`Mark step ${h.text} as ${gp.completedStepIds.includes(h.id) ? 'done' : 'not done'}`}
                  />
                  <span>{h.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </aside>
        <article className="content" id="main" aria-label="Guide content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ node, children, ...props }: any) => (
                <>
                  <h2 {...props}><HeadingIcon text={String(children)} /> {children}</h2>
                  {getCalloutsForHeading(guide.id, (node?.data?.id || node?.properties?.id) ?? '')
                    .map((c: any, idx: number) => <CalloutBox key={idx} item={c} />)}
                </>
              ),
              h3: ({ node, children, ...props }: any) => (
                <>
                  <h3 {...props}><HeadingIcon text={String(children)} /> {children}</h3>
                  {getCalloutsForHeading(guide.id, (node?.data?.id || node?.properties?.id) ?? '')
                    .map((c: any, idx: number) => <CalloutBox key={idx} item={c} />)}
                </>
              ),
              img: ({ src, alt }: any) => (
                <SmartPicture src={String(src)} alt={String(alt || '')} />
              ),
            }}
          >
            {guide.body}
          </ReactMarkdown>
          {/* Top-level callouts not tied to a specific heading */}
          {guideCallouts.filter(c => !c.headingId).map((c, i) => (
            <CalloutBox key={`guide-callout-${i}`} item={c} />
          ))}
        </article>
      </div>
    </main>
  )
}
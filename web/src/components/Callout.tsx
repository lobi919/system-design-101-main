import React from 'react'
import type { Callout } from '../callouts'

export default function CalloutBox({ item }: { item: Callout }) {
  const tone = item.severity || 'info'
  return (
    <aside className={`callout callout-${tone}`} role="note" aria-label="Did you know?">
      <strong className="callout-title">{item.title || 'Did you know?'}</strong>
      <p className="callout-body">{item.body}</p>
    </aside>
  )
}
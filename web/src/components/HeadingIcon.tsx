import React from 'react'

const icons: Record<string, React.ReactNode> = {
  overview: <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="10" fill="#646cff"/></svg>,
  architecture: <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><rect x="4" y="4" width="16" height="16" fill="#ff8c00"/></svg>,
  database: <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><ellipse cx="12" cy="6" rx="8" ry="3" fill="#0aa"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" fill="#0aa" opacity="0.6"/></svg>,
  caching: <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M3 12h18" stroke="#0f0" strokeWidth="2"/><path d="M12 3v18" stroke="#0f0" strokeWidth="2"/></svg>,
  api: <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M6 6h12v12H6z" fill="#a0a"/></svg>,
}

function pickIcon(text: string) {
  const key = text.toLowerCase()
  if (key.includes('arch')) return icons.architecture
  if (key.includes('db') || key.includes('database')) return icons.database
  if (key.includes('cache')) return icons.caching
  if (key.includes('api') || key.includes('http')) return icons.api
  if (key.includes('overview') || key.includes('intro')) return icons.overview
  return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="3" fill="#999"/></svg>
}

export default function HeadingIcon({ text }: { text: string }) {
  return <span className="heading-icon" aria-hidden>{pickIcon(text)}</span>
}
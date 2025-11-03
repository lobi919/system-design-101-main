type SearchFilters = { category: string | null, tag: string | null }

type SearchLogEntry = {
  query: string
  resultCount: number
  durationMs: number
  filters: SearchFilters
  sortBy: 'relevance' | 'recent' | 'title'
  timestamp: number
}

const STORAGE_KEY = 'search:events'

export function logSearch(entry: Omit<SearchLogEntry, 'timestamp'>) {
  try {
    const events: SearchLogEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const enriched = { ...entry, timestamp: Date.now() }
    events.push(enriched)
    // cap to last 500 events
    const trimmed = events.slice(-500)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (e) {
    // non-fatal; ignore analytics errors
    console.warn('Failed to log search analytics', e)
  }
}

export function getSearchSummary() {
  try {
    const events: SearchLogEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const total = events.length
    const avgDuration = total ? Math.round(events.reduce((acc, e) => acc + e.durationMs, 0) / total) : 0
    const avgResults = total ? Math.round(events.reduce((acc, e) => acc + e.resultCount, 0) / total) / total : 0
    const topQueries = Object.entries(events.reduce<Record<string, number>>((acc, e) => {
      const key = e.query.trim().toLowerCase()
      if (!key) return acc
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([q, count]) => ({ q, count }))
    return { total, avgDuration, avgResults, topQueries }
  } catch (e) {
    return { total: 0, avgDuration: 0, avgResults: 0, topQueries: [] as Array<{ q: string, count: number }> }
  }
}
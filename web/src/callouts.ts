// Loads editor-maintained callouts for guides
export type Callout = {
  guideId: string
  headingId?: string
  title: string
  body: string
  severity?: 'info' | 'tip' | 'warning'
}

const files = import.meta.glob('../data/callouts/*.json', { eager: true })

const items: Callout[] = []
for (const [, mod] of Object.entries(files)) {
  const data = (mod as any).default || mod
  if (Array.isArray(data)) items.push(...data)
}

export function getCalloutsForGuide(guideId: string) {
  return items.filter(c => c.guideId === guideId)
}

export function getCalloutsForHeading(guideId: string, headingId: string) {
  return items.filter(c => c.guideId === guideId && c.headingId === headingId)
}
import { describe, it, expect } from 'vitest'
import { guides, categories } from '../../src/content'

describe('content parsing', () => {
  it('parses categories with titles and ids', () => {
    expect(categories.length).toBeGreaterThan(0)
    const c = categories[0]
    expect(c.id).toBeTruthy()
    expect(c.title).toBeTruthy()
  })

  it('parses guides with headings extracted from markdown', () => {
    expect(guides.length).toBeGreaterThan(0)
    const g = guides[0]
    expect(g.id).toBeTruthy()
    expect(g.title).toBeTruthy()
    expect(Array.isArray(g.headings)).toBe(true)
    // headings contain text and id
    if (g.headings.length > 0) {
      expect(g.headings[0].text).toBeTruthy()
      expect(g.headings[0].id).toBeTruthy()
    }
  })
})
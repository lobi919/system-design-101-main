import matter from 'gray-matter'

export type Category = {
  id: string
  title: string
  description?: string
  icon?: string
  sort: number
}

export type Guide = {
  id: string
  title: string
  description?: string
  image?: string
  createdAt?: string
  draft?: boolean
  categories: string[]
  tags?: string[]
  body: string
  headings: { id: string; text: string; level: number }[]
}

const guideFiles = import.meta.glob('../data/guides/*.md', { as: 'raw', eager: true })
const categoryFiles = import.meta.glob('../data/categories/*.md', { as: 'raw', eager: true })

function parseHeadings(body: string) {
  const lines = body.split('\n')
  const hs: { id: string; text: string; level: number }[] = []
  for (const line of lines) {
    const m = /^(#{1,6})\s+(.*)$/.exec(line)
    if (m) {
      const level = m[1].length
      const text = m[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      hs.push({ id, text, level })
    }
  }
  return hs
}

function fileIdFromPath(p: string) {
  const parts = p.split('/')
  const last = parts[parts.length - 1]
  return last.replace('.md', '')
}

export const categories: Category[] = Object.entries(categoryFiles)
  .map(([p, raw]) => {
    const id = fileIdFromPath(p)
    const parsed = matter(raw as string)
    const d = parsed.data as any
    return {
      id,
      title: d.title,
      description: d.description,
      icon: d.icon,
      sort: Number(d.sort) || 0,
    } as Category
  })
  .sort((a, b) => a.sort - b.sort)

export const guides: Guide[] = Object.entries(guideFiles)
  .map(([p, raw]) => {
    const id = fileIdFromPath(p)
    const parsed = matter(raw as string)
    const d = parsed.data as any
    const body = parsed.content
    return {
      id,
      title: d.title,
      description: d.description,
      image: d.image,
      createdAt: d.createdAt,
      draft: d.draft,
      categories: d.categories || [],
      tags: d.tags || [],
      body,
      headings: parseHeadings(body),
    } as Guide
  })
  .sort((a, b) => (new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()))

export function guidesByCategory(categoryId: string) {
  return guides.filter(g => g.categories?.includes(categoryId))
}
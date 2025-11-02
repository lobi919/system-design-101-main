import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type GuideProgress = {
  completedStepIds: string[]
  xp: number
}

type ProgressState = {
  progress: Record<string, GuideProgress>
  toggleStep: (guideId: string, stepId: string) => void
  clearGuide: (guideId: string) => void
}

const ProgressContext = createContext<ProgressState | null>(null)

function loadProgress(): Record<string, GuideProgress> {
  try {
    const raw = localStorage.getItem('progress')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Record<string, GuideProgress>>(loadProgress)

  useEffect(() => {
    localStorage.setItem('progress', JSON.stringify(progress))
  }, [progress])

  const toggleStep = (guideId: string, stepId: string) => {
    setProgress(prev => {
      const g = prev[guideId] || { completedStepIds: [], xp: 0 }
      const done = g.completedStepIds.includes(stepId)
      const completedStepIds = done ? g.completedStepIds.filter(id => id !== stepId) : [...g.completedStepIds, stepId]
      const xpDelta = done ? -10 : 10 // simple gamification: 10 XP per step
      return {
        ...prev,
        [guideId]: { completedStepIds, xp: Math.max(0, (g.xp || 0) + xpDelta) }
      }
    })
  }

  const clearGuide = (guideId: string) => {
    setProgress(prev => {
      const { [guideId]: _, ...rest } = prev
      return rest
    })
  }

  const value = useMemo<ProgressState>(() => ({ progress, toggleStep, clearGuide }), [progress])
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
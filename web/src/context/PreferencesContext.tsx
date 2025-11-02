import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Preferences = {
  textScale: number
  highContrast: boolean
  toggleContrast: () => void
  setTextScale: (scale: number) => void
}

const PreferencesContext = createContext<Preferences | null>(null)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [textScale, setTextScale] = useState<number>(() => Number(localStorage.getItem('pref:textScale')) || 1)
  const [highContrast, setHighContrast] = useState<boolean>(() => localStorage.getItem('pref:contrast') === '1')

  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', String(textScale))
    localStorage.setItem('pref:textScale', String(textScale))
  }, [textScale])

  useEffect(() => {
    document.documentElement.classList.toggle('hc', highContrast)
    localStorage.setItem('pref:contrast', highContrast ? '1' : '0')
  }, [highContrast])

  const value = useMemo<Preferences>(() => ({
    textScale,
    highContrast,
    toggleContrast: () => setHighContrast(v => !v),
    setTextScale,
  }), [textScale, highContrast])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider')
  return ctx
}
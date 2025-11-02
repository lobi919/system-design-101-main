import React from 'react'
import { usePreferences } from '../context/PreferencesContext'

export default function AccessibilityControls() {
  const { textScale, setTextScale, highContrast, toggleContrast } = usePreferences()
  return (
    <div className="access-controls" aria-label="Accessibility controls">
      <label>
        Text size
        <input
          aria-label="Adjust text size"
          type="range"
          min={1}
          max={1.6}
          step={0.1}
          value={textScale}
          onChange={(e) => setTextScale(Number(e.target.value))}
        />
      </label>
      <button
        aria-pressed={highContrast}
        aria-label="Toggle high contrast mode"
        className="hc-toggle"
        onClick={toggleContrast}
      >
        {highContrast ? 'High Contrast: On' : 'High Contrast: Off'}
      </button>
    </div>
  )
}
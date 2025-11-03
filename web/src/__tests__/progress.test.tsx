import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import { ProgressProvider, useProgress } from '../../src/context/ProgressContext'

function TestComponent() {
  const { progress, toggleStep, clearGuide } = useProgress()
  const guideId = 'test-guide'
  const stepId = 's1'
  return (
    <div>
      <button onClick={() => toggleStep(guideId, stepId)}>toggle</button>
      <button onClick={() => clearGuide(guideId)}>clear</button>
      <div data-testid="xp">{progress[guideId]?.xp || 0}</div>
      <div data-testid="done">{progress[guideId]?.completedStepIds.includes(stepId) ? 'yes' : 'no'}</div>
    </div>
  )
}

describe('ProgressContext', () => {
  afterEach(() => { cleanup(); localStorage.clear() })
  it('awards 10 XP when toggling a step to done', async () => {
    render(<ProgressProvider><TestComponent /></ProgressProvider>)
    const xp = () => Number(screen.getByTestId('xp').textContent)
    const done = () => screen.getByTestId('done').textContent
    expect(xp()).toBe(0)
    expect(done()).toBe('no')
    screen.getByText('toggle').click()
    await waitFor(() => expect(xp()).toBe(10))
    expect(done()).toBe('yes')
  })

  it('clears progress when clearGuide is called', async () => {
    render(<ProgressProvider><TestComponent /></ProgressProvider>)
    screen.getByText('toggle').click()
    await waitFor(() => expect(screen.getByTestId('xp').textContent).toBe('10'))
    screen.getByText('clear').click()
    await waitFor(() => expect(screen.getByTestId('xp').textContent).toBe('0'))
    expect(screen.getByTestId('done').textContent).toBe('no')
  })
})
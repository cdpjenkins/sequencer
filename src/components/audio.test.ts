import { act, renderHook } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { useAudioEngine } from './useAudioEngine'

const makeGrid = (steps: number, notes: number): boolean[][] =>
  Array.from({ length: steps }, () => Array.from({ length: notes }, () => false))

const makeMockAudio = () => {
  const oscillators: Array<{ frequency: { value: number }; start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> }> = []

  const AudioContextMock = vi.fn(function () {
    return {
      createOscillator: vi.fn(() => {
        const osc = { frequency: { value: 0 }, type: 'sine', connect: vi.fn(), start: vi.fn(), stop: vi.fn() }
        oscillators.push(osc)
        return osc
      }),
      createGain: vi.fn(() => ({
        gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
      })),
      destination: {},
      currentTime: 0,
      close: vi.fn(),
    }
  })

  vi.stubGlobal('AudioContext', AudioContextMock)
  return { oscillators }
}

afterEach(() => vi.unstubAllGlobals())

it('does not play when isPlaying is false', () => {
  const { oscillators } = makeMockAudio()
  const activeGrid = makeGrid(4, 36)
  activeGrid[0][21] = true

  renderHook(() => useAudioEngine(activeGrid, 0, false))

  expect(oscillators).toHaveLength(0)
})

it('does not play when the current column has no active cells', () => {
  const { oscillators } = makeMockAudio()
  const activeGrid = makeGrid(4, 36) // all false

  renderHook(() => useAudioEngine(activeGrid, 0, true))

  expect(oscillators).toHaveLength(0)
})

it('plays one oscillator per active cell in the current column', () => {
  const { oscillators } = makeMockAudio()
  const activeGrid = makeGrid(4, 36)
  activeGrid[0][21] = true // A4
  activeGrid[0][9] = true  // A3

  renderHook(() => useAudioEngine(activeGrid, 0, true))

  expect(oscillators).toHaveLength(2)
})

it('sets the oscillator frequency for A4 (noteIndex 21) to 440 Hz', () => {
  const { oscillators } = makeMockAudio()
  const activeGrid = makeGrid(4, 36)
  activeGrid[0][21] = true // A4 = MIDI 69 = 440 Hz

  renderHook(() => useAudioEngine(activeGrid, 0, true))

  expect(oscillators[0].frequency.value).toBeCloseTo(440)
})

it('sets the oscillator frequency for A3 (noteIndex 9) to 220 Hz', () => {
  const { oscillators } = makeMockAudio()
  const activeGrid = makeGrid(4, 36)
  activeGrid[0][9] = true // A3 = MIDI 57 = 220 Hz

  renderHook(() => useAudioEngine(activeGrid, 0, true))

  expect(oscillators[0].frequency.value).toBeCloseTo(220)
})

it('plays notes for the correct column when playhead advances', () => {
  const { oscillators } = makeMockAudio()
  const activeGrid = makeGrid(4, 36)
  activeGrid[0][21] = false
  activeGrid[1][21] = true // A4 active only at step 1

  const { rerender } = renderHook(
    ({ playhead }: { playhead: number }) => useAudioEngine(activeGrid, playhead, true),
    { initialProps: { playhead: 0 } },
  )

  expect(oscillators).toHaveLength(0)

  act(() => { rerender({ playhead: 1 }) })

  expect(oscillators).toHaveLength(1)
  expect(oscillators[0].frequency.value).toBeCloseTo(440)
})

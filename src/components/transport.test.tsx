import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import { useTransport } from './useTransport'

afterEach(() => vi.useRealTimers())

const PlayStop = ({ steps = 4 }) => {
  const { isPlaying, play, stop } = useTransport(steps)
  return <button onClick={isPlaying ? stop : play}>{isPlaying ? 'Stop' : 'Play'}</button>
}

it('shows a Play button initially', () => {
  render(<PlayStop />)
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
})

it('changes to Stop when Play is clicked', () => {
  render(<PlayStop />)
  fireEvent.click(screen.getByRole('button', { name: 'Play' }))
  expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
})

it('changes back to Play when Stop is clicked', () => {
  render(<PlayStop />)
  fireEvent.click(screen.getByRole('button', { name: 'Play' }))
  fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
})

it('advances the playhead by one step per 125ms interval', () => {
  vi.useFakeTimers()
  const { result } = renderHook(() => useTransport(16))

  act(() => result.current.play())
  expect(result.current.playhead).toBe(0)

  act(() => { vi.advanceTimersByTime(125) })
  expect(result.current.playhead).toBe(1)

  act(() => { vi.advanceTimersByTime(125) })
  expect(result.current.playhead).toBe(2)
})

it('wraps playhead back to 0 after the last step', () => {
  vi.useFakeTimers()
  const { result } = renderHook(() => useTransport(4))

  act(() => result.current.play())
  act(() => { vi.advanceTimersByTime(125 * 4) })
  expect(result.current.playhead).toBe(0)
})

it('stop resets the playhead to 0', () => {
  vi.useFakeTimers()
  const { result } = renderHook(() => useTransport(16))

  act(() => result.current.play())
  act(() => { vi.advanceTimersByTime(375) })
  expect(result.current.playhead).toBe(3)

  act(() => result.current.stop())
  expect(result.current.isPlaying).toBe(false)
  expect(result.current.playhead).toBe(0)
})

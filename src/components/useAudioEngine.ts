import { useEffect, useRef } from 'react'

const C3_MIDI = 48
const NOTE_DURATION = 0.1

const noteFrequency = (noteIndex: number): number =>
  440 * Math.pow(2, (C3_MIDI + noteIndex - 69) / 12)

export const useAudioEngine = (
  activeGrid: boolean[][],
  playhead: number,
  isPlaying: boolean,
) => {
  const ctxRef = useRef<AudioContext | null>(null)
  const activeGridRef = useRef(activeGrid)
  activeGridRef.current = activeGrid

  useEffect(() => {
    if (!isPlaying) return

    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    const ctx = ctxRef.current
    const column = activeGridRef.current[playhead] ?? []

    column.forEach((active, noteIndex) => {
      if (!active) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = noteFrequency(noteIndex)
      osc.type = 'square'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + NOTE_DURATION)
      osc.start()
      osc.stop(ctx.currentTime + NOTE_DURATION)
    })
  }, [playhead, isPlaying])

  useEffect(() => {
    if (!isPlaying) {
      ctxRef.current?.close()
      ctxRef.current = null
    }
  }, [isPlaying])
}

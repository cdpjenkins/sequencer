import { useEffect, useState } from 'react'

const STEP_MS = 125

export const useTransport = (steps: number) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playhead, setPlayhead] = useState(0)

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      setPlayhead(prev => (prev + 1) % steps)
    }, STEP_MS)
    return () => clearInterval(id)
  }, [isPlaying, steps])

  const play = () => setIsPlaying(true)

  const stop = () => {
    setIsPlaying(false)
    setPlayhead(0)
  }

  return { isPlaying, playhead, play, stop }
}

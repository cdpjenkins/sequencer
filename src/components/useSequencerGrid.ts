import { useState } from 'react'

const emptyGrid = (steps: number, notes: number): boolean[][] =>
  Array.from({ length: steps }, () => Array.from({ length: notes }, () => false))

export const useSequencerGrid = (steps: number, notes: number) => {
  const [activeGrid, setActiveGrid] = useState<boolean[][]>(() => emptyGrid(steps, notes))

  const toggleCell = (step: number, note: number) => {
    setActiveGrid(prev =>
      prev.map((col, s) =>
        s === step ? col.map((val, n) => (n === note ? !val : val)) : col
      )
    )
  }

  return { activeGrid, toggleCell }
}

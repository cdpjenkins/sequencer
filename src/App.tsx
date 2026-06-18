import { useRef } from 'react'
import { Grid } from './components/Grid'
import { useAudioEngine } from './components/useAudioEngine'
import { useSequencerGrid } from './components/useSequencerGrid'
import { useTransport } from './components/useTransport'

const STEPS = 64
const NOTES = 36

function App() {
  const { activeGrid, toggleCell, loadGrid } = useSequencerGrid(STEPS, NOTES)
  const { isPlaying, playhead, play, stop } = useTransport(STEPS)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useAudioEngine(activeGrid, playhead, isPlaying)

  const exportGrid = () => {
    const blob = new Blob([JSON.stringify(activeGrid)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sequencer.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importGrid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        loadGrid(JSON.parse(reader.result as string))
      } catch {}
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <>
      <div className="toolbar">
        <button className="play-btn" onClick={isPlaying ? stop : play}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <button className="toolbar-btn" onClick={exportGrid}>Export</button>
        <button className="toolbar-btn" onClick={() => fileInputRef.current?.click()}>Import</button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={importGrid} style={{ display: 'none' }} />
      </div>
      <div className="sequencer-wrapper">
        <Grid steps={STEPS} notes={NOTES} activeGrid={activeGrid} onToggle={toggleCell} playhead={playhead} />
      </div>
    </>
  )
}

export default App

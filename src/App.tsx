import { Grid } from './components/Grid'
import { useAudioEngine } from './components/useAudioEngine'
import { useSequencerGrid } from './components/useSequencerGrid'
import { useTransport } from './components/useTransport'

const STEPS = 64
const NOTES = 36

function App() {
  const { activeGrid, toggleCell } = useSequencerGrid(STEPS, NOTES)
  const { isPlaying, playhead, play, stop } = useTransport(STEPS)
  useAudioEngine(activeGrid, playhead, isPlaying)

  return (
    <>
      <div className="toolbar">
        <button className="play-btn" onClick={isPlaying ? stop : play}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>
      <div className="sequencer-wrapper">
        <Grid steps={STEPS} notes={NOTES} activeGrid={activeGrid} onToggle={toggleCell} playhead={playhead} />
      </div>
    </>
  )
}

export default App

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
      <button onClick={isPlaying ? stop : play}>{isPlaying ? 'Stop' : 'Play'}</button>
      <Grid steps={STEPS} notes={NOTES} activeGrid={activeGrid} onToggle={toggleCell} playhead={playhead} />
    </>
  )
}

export default App

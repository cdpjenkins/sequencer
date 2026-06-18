import { Grid } from './components/Grid'
import { useSequencerGrid } from './components/useSequencerGrid'

const STEPS = 64
const NOTES = 36

function App() {
  const { activeGrid, toggleCell } = useSequencerGrid(STEPS, NOTES)
  return <Grid steps={STEPS} notes={NOTES} activeGrid={activeGrid} onToggle={toggleCell} />
}

export default App

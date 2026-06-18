import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Grid } from './Grid'
import { useSequencerGrid } from './useSequencerGrid'

const emptyGrid = (steps: number, notes: number): boolean[][] =>
  Array.from({ length: steps }, () => Array.from({ length: notes }, () => false))

it('renders a cell for every step and note combination', () => {
  render(<Grid steps={16} notes={36} activeGrid={emptyGrid(16, 36)} onToggle={() => {}} />)
  expect(screen.getAllByRole('button')).toHaveLength(16 * 36)
})

it('renders note labels for the lowest and highest notes', () => {
  render(<Grid steps={16} notes={36} activeGrid={emptyGrid(16, 36)} onToggle={() => {}} />)
  expect(screen.getByText('C3')).toBeInTheDocument()
  expect(screen.getByText('B5')).toBeInTheDocument()
})

it('renders note labels including sharps', () => {
  render(<Grid steps={16} notes={36} activeGrid={emptyGrid(16, 36)} onToggle={() => {}} />)
  expect(screen.getByText('C#3')).toBeInTheDocument()
  expect(screen.getByText('F#4')).toBeInTheDocument()
})

const SequencerGrid = ({ steps = 16, notes = 36 }) => {
  const { activeGrid, toggleCell } = useSequencerGrid(steps, notes)
  return <Grid steps={steps} notes={notes} activeGrid={activeGrid} onToggle={toggleCell} />
}

it('activates a cell when clicked', async () => {
  const user = userEvent.setup()
  render(<SequencerGrid />)
  const [firstCell] = screen.getAllByRole('button')
  expect(firstCell).not.toHaveClass('active')
  await user.click(firstCell)
  expect(firstCell).toHaveClass('active')
})

it('deactivates an active cell when clicked again', async () => {
  const user = userEvent.setup()
  render(<SequencerGrid />)
  const [firstCell] = screen.getAllByRole('button')
  await user.click(firstCell)
  expect(firstCell).toHaveClass('active')
  await user.click(firstCell)
  expect(firstCell).not.toHaveClass('active')
})

it('toggling one cell does not affect other cells', async () => {
  const user = userEvent.setup()
  render(<SequencerGrid />)
  const [firstCell, secondCell] = screen.getAllByRole('button')
  await user.click(firstCell)
  expect(firstCell).toHaveClass('active')
  expect(secondCell).not.toHaveClass('active')
})

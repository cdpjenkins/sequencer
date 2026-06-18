import { render, screen } from '@testing-library/react'
import { Grid } from './Grid'

it('renders a cell for every step and note combination', () => {
  render(<Grid steps={16} notes={36} />)
  expect(screen.getAllByRole('button')).toHaveLength(16 * 36)
})

it('renders note labels for the lowest and highest notes', () => {
  render(<Grid steps={16} notes={36} />)
  expect(screen.getByText('C3')).toBeInTheDocument()
  expect(screen.getByText('B5')).toBeInTheDocument()
})

it('renders note labels including sharps', () => {
  render(<Grid steps={16} notes={36} />)
  expect(screen.getByText('C#3')).toBeInTheDocument()
  expect(screen.getByText('F#4')).toBeInTheDocument()
})

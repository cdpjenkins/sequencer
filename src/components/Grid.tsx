const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const C3_MIDI = 48

const noteLabel = (noteIndex: number): string => {
  const midi = C3_MIDI + noteIndex
  const octave = Math.floor(midi / 12) - 1
  return `${NOTE_NAMES[midi % 12]}${octave}`
}

type Props = {
  steps: number
  notes: number
}

export const Grid = ({ steps, notes }: Props) => {
  const noteIndices = Array.from({ length: notes }, (_, i) => notes - 1 - i)
  const stepIndices = Array.from({ length: steps }, (_, i) => i)

  return (
    <div>
      {noteIndices.map(noteIndex => (
        <div key={noteIndex} style={{ display: 'flex' }}>
          <span style={{ width: '3rem', flexShrink: 0, textAlign: 'right', paddingRight: '0.4rem' }}>{noteLabel(noteIndex)}</span>
          {stepIndices.map(stepIndex => (
            <button key={stepIndex} />
          ))}
        </div>
      ))}
    </div>
  )
}

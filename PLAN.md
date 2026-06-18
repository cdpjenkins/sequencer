# Plan: Step Sequencer

## Goal

Build a browser-based step sequencer with a clickable grid, note playback via Web Audio API, and play/stop transport controls.

## Acceptance Criteria

- [ ] A grid is displayed with 16 steps on the X axis and 36 notes (C3–B5, chromatic) on the Y axis
- [ ] Clicking a cell toggles it on (highlighted) or off
- [ ] A Play button starts playback; the playhead advances through columns at 120 BPM
- [ ] Active cells in the current column play an oscillator tone at the correct frequency
- [ ] A Stop button halts playback and resets the playhead
- [ ] The current playhead column is visually highlighted

## Stack

- React 19 + TypeScript (existing)
- Vite (existing)
- Vitest + jsdom + React Testing Library (to add)
- Web Audio API (browser-native, no library)

## Steps

### Step 1: Testing infrastructure

**Test**: None yet — just verify the test runner executes without error.
**Implementation**: Add `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`; configure `vite.config.ts` with a `test` block; add a trivial smoke test.
**Done when**: `npm test` runs and the smoke test passes.

### Step 2: Render static grid

**Test**: `Grid` renders 16 × 36 cells; note labels (C3, C#3 … B5) appear in the DOM.
**Implementation**: `Grid` component accepts `steps` and `notes` props; renders a table/div grid; derives note names from MIDI numbers.
**Done when**: Test asserts correct cell count and note labels.

### Step 3: Toggle cells

**Test**: Clicking an inactive cell activates it; clicking an active cell deactivates it.
**Implementation**: `useSequencerGrid` hook owns a `steps × notes` boolean grid in `useState`; exposes a `toggleCell(step, note)` function; `Grid` renders active cells with an `active` class.
**Done when**: Test clicks cells and asserts active state changes correctly.

### Step 4: Play/Stop button with playhead
can 
**Test**: Button renders as "Play"; clicking it changes label to "Stop" and starts advancing the playhead column; clicking "Stop" resets the playhead to 0.
**Implementation**: `Transport` component with `isPlaying` and `playhead` state; `useEffect` drives a `setInterval` at 120 BPM (one step = 125 ms at 8th-note resolution) when playing.
**Done when**: Test asserts button label toggle and playhead state changes.

### Step 5: Audio playback

**Test**: When the playhead advances to a column with active cells, an oscillator is created and started for each active note at the correct frequency (f = 440 × 2^((midi − 69) / 12)).
**Implementation**: `useAudioEngine` hook wraps `AudioContext`; on each playhead tick, schedules short `OscillatorNode` bursts for active cells in the current column; mocked in tests via `vi.stubGlobal`.
**Done when**: Frequency calculations verified in tests; manual smoke test confirms audible notes.

### Step 6: Polish

**Test**: No new behavioural tests — verify existing tests still pass.
**Implementation**: Highlight the active playhead column with a CSS class; style the grid (border, spacing, cell size); ensure Stop resets playhead visually.
**Done when**: App runs end-to-end in the browser; grid is visually usable; play/stop works correctly.

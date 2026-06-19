# Sequencer

A browser-based step sequencer. Click cells to compose a pattern, then hit Play to hear it.

## What it is

- 64-step × 36-note chromatic grid (C3–B5)
- Each cell plays a short oscillator tone (square wave) via the Web Audio API
- 120 BPM fixed tempo; the playhead sweeps left to right and loops
- Patterns can be saved and loaded as JSON files

## Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Using the sequencer

| Action | How |
|--------|-----|
| Toggle a note on/off | Click any grid cell |
| Start playback | Click **Play** |
| Stop playback | Click **Stop** (resets the playhead) |
| Save the current pattern | Click **Export** — downloads `sequencer.json` |
| Load a saved pattern | Click **Import** — pick a `.json` file |

The Y axis runs from B5 (top) to C3 (bottom). The X axis is time — each column is one step (125 ms at 120 BPM).

## Building for production

```bash
npm run build
```

Outputs to `dist/`. The folder uses relative asset paths and can be dropped into any subdirectory of a static site.

## Running tests

```bash
npm test
```

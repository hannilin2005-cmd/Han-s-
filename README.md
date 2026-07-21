# MEND

A gentle daily calendar for skin picking (dermatillomania) recovery, built for
people managing acne who want a "quit now"-style tracker without the shame
spiral.

## How it works

- Tap a day once to **scratch it off** (like crossing off a wall calendar) —
  that means your skin stayed clear.
- Tap it again to mark it as a **patch** — you picked. That's tracked too,
  because a setback doesn't erase the days before it.
- Tap a third time to clear the mark.
- Future days are locked; you can only mark today and the past.

The card re-skins itself with a new color palette every month, and the whole
shape — spiral binding, wavy page edge, torn-paper texture — is drawn with
plain CSS/SVG, no images.

Stats shown: current streak, best streak ever, and clear/picked counts for
the month you're viewing. Streak logic never punishes an unmarked *today* —
it only breaks on an actual picked day or a genuine gap in the past.

Data is stored locally in the browser (`localStorage`). Use **export data** /
**import data** at the bottom to back up or move your history between
devices.

## Running it

No build step. Just serve the folder statically, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Structure

- `index.html` — markup
- `css/style.css` — palette variables, wavy card shape, marks, layout
- `js/app.js` — palette table, wavy-edge path generator, spiral binding,
  calendar rendering, streak/stat math, localStorage persistence

## Customizing

Monthly colors live in the `PALETTES` array at the top of `js/app.js` (index
0 = January). The wavy-edge amplitude/frequency and spiral coil count are
also tunable there (`buildWavyPoints` call in `applyWavyClip`, and `buildSpiral`).

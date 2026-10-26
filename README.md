> **Also in this repo:** [`calendar/`](calendar/) is *Han's Calendar*, a poster-style
> event calendar with custom boards and per-event reminders. See its README.

# MEND

A gentle daily calendar for skin picking (dermatillomania) recovery, built for
people managing acne who want a "quit now"-style tracker without the shame
spiral.

## How it works

- Tap a day once to mark it **clear** — your skin stayed untouched. It fills
  in as a solid accent-colored circle.
- Tap it again to mark it **picked**. That's tracked too, in a different
  color, because a setback doesn't erase the days before it.
- Tap a third time to clear the mark back to blank.
- Future days sit as hollow outline circles and can't be marked; today gets a
  ring around it.

Sidebar shows the legend (what each circle color means) and progress: current
streak, best streak ever, and clear/picked counts for the month you're
viewing. Streak logic never punishes an unmarked *today* — it only breaks on
an actual picked day or a genuine gap in the past.

Colors shift every month — the grid stays black-and-white, only the two
accent colors (clear/picked) rotate through a 12-month palette — so the board
looks a little different each time you flip the calendar.

Data is stored locally in the browser (`localStorage`). Use **export** /
**import** in the sidebar to back up or move your history between devices.

## Running it

No build step. Just serve the folder statically, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Structure

- `index.html` — markup: sidebar (brand, legend, progress chips) + calendar grid
- `css/style.css` — layout, circle-grid styling, month accent variables
- `js/app.js` — palette table, calendar rendering, streak/stat math,
  localStorage persistence

## Customizing

Monthly accent colors live in the `PALETTES` array at the top of `js/app.js`
(index 0 = January, each entry is `{ clear, picked }`).

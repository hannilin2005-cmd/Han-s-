# BLOOM

An automated CRM that scans the web and trending social content to surface
ideal customer profiles (ICPs) and hot prospects for **B2C beauty and
wellness brands**.

## How it works

- Pick an audience segment in the sidebar — eight ICPs built for beauty and
  wellness, from the Gen Z skin-cycling enthusiast living on #SkinTok to the
  luxury anti-aging loyalist reading dermatologist explainers. Each one ships
  with a pre-built ICP: age range, spend tier, the platforms they live on,
  what triggers a purchase, and the content hooks that convert them.
- The **Signal Feed** shows individual buying-intent signals from real
  people — a viral "get ready with me" video tagging a product, a Reddit
  thread asking for recommendations, a 5-star review, a spike in search
  interest — each tagged with its source (TikTok, Instagram, YouTube,
  Reddit, Pinterest, review sites, Google Trends, creator DMs) and an intent
  score. Filter by source with the chips above the feed.
- **Hot Prospects** aggregates signals per person into a ranked list, so you
  can see who's showing the most buying intent right now for the selected
  segment — the people worth DMing, gifting product to, or retargeting with
  ads.
- Hit **Scan now** to pull in fresh signals, or flip on **Live scanning** to
  have new signals arrive automatically every few seconds.
- **Save to CRM** on any signal or prospect pulls it into the **Saved** tab,
  which persists across segments and page reloads via `localStorage`.

All data — handles, signals, trending tags — is generated locally from
templates. Nothing here calls out to real APIs. It's built so the shape
(sources, scoring, aggregation, CRM save) maps directly onto a real
pipeline: swap the signal generator for actual social/search API calls
(TikTok, Instagram, YouTube, Reddit, Pinterest, review platforms, Google
Trends) and the rest of the app — feed, scoring, hot-prospect ranking,
saved list — keeps working unchanged.

## Running it

No build step. Just serve the folder statically, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Structure

- `index.html` — markup: sidebar (brand, segment picker, stats) + main area
  (tabs, ICP card, trending strip, signal feed / hot prospects / saved)
- `css/style.css` — light editorial beauty theme, cards, chips, tabs
- `js/app.js` — mock ICP/segment data, signal generation & scoring,
  hot-prospect aggregation, tab/filter rendering, `localStorage` persistence

## Customizing

Segments, ICP criteria, trending tags, and signal templates all live in the
`SEGMENTS` array at the top of `js/app.js` — add a segment by adding an
entry with `icp`, `trending`, and `signalTemplates`.

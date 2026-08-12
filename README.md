# RADAR

An automated CRM signal dashboard that surfaces industry-specific ideal
customer profiles (ICPs) and hot leads by "scanning" the web and trending
social content.

## How it works

- Pick an industry in the sidebar (SaaS, e-commerce, healthcare, FinTech,
  manufacturing, cybersecurity, professional services, real estate). Each
  one ships with a pre-built ICP: firmographics, tech stack, decision-maker
  titles, and the pain points to lead with.
- The **Signal Feed** shows individual buying-intent signals — a company
  hiring for a relevant role, a funding announcement, a complaint thread
  about a competitor, a spike in search interest — each tagged with its
  source (LinkedIn, X/Twitter, Reddit, news, job postings, review sites,
  Google Trends) and an intent score. Filter by source with the chips above
  the feed.
- **Hot Leads** aggregates signals per company into a ranked list, so you
  can see who's showing the most buying intent right now for the selected
  industry.
- Hit **Scan now** to pull in fresh signals, or flip on **Live scanning**
  to have new signals arrive automatically every few seconds.
- **Save to CRM** on any signal or lead pulls it into the **Saved** tab,
  which persists across industries and page reloads via `localStorage`.

All data — companies, signals, trending tags — is generated locally from
templates. Nothing here calls out to real APIs. It's built so the shape
(sources, scoring, aggregation, CRM save) maps directly onto a real
pipeline: swap the signal generator for actual search/social API calls
(SerpAPI, X/Reddit/LinkedIn APIs, job board scrapers, review sites) and the
rest of the app — feed, scoring, hot-lead ranking, saved list — keeps
working unchanged.

## Running it

No build step. Just serve the folder statically, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Structure

- `index.html` — markup: sidebar (brand, industry picker, stats) + main
  area (tabs, ICP card, trending strip, signal feed / hot leads / saved)
- `css/style.css` — dark control-room theme, cards, chips, tabs
- `js/app.js` — mock ICP/industry data, signal generation & scoring,
  hot-lead aggregation, tab/filter rendering, `localStorage` persistence

## Customizing

Industries, ICP criteria, trending tags, and signal templates all live in
the `INDUSTRIES` array at the top of `js/app.js` — add an industry by
adding an entry with `icp`, `trending`, and `signalTemplates`.

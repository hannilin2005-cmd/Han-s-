# Han's Calendar

A bubbly, poster-style calendar based on the *Antalis Calendar – Jan* print:
yellow striped paper, giant pink pill letters with a grainy plum shadow,
cream day tiles with speckled pink edges, teal numbers and sparkles in the
empty days.

## Features

- **Month poster.** Tap a day to see its events or add one. Swipe or use the
  arrow keys to change month.
- **Boards (your own categories).** Like Pinterest boards or Google Maps
  lists: name them anything and give each one an emoji and a colour. Each
  board opens as a pin wall of its events. You can show or hide boards on
  the calendar with the chips under the poster.
- **Events** have a title, date, start/end or all-day, repeat (daily, weekly,
  monthly, yearly), location, notes and a board.
- **Reminders per event.** Add as many as you like. For each one, pick:
  - **when**: at the time, 5/10/15/30 min, 1–2 h, 1–2 days, 1 week before,
    or a custom time
  - **how**: notification + sound, silent notification, alarm (rings
    full-screen until you dismiss or snooze it), or a pop-up in the app only
  - **sound**: chime, bell, pop, retro beep or none (▶ previews it)
- **Upcoming** list of the next 60 days.
- **Add to phone calendar**: exports `.ics` files with every reminder
  included, so your phone's own calendar can alert you too.
- Backup export/import (JSON). Works offline and can be installed to the
  Home Screen.

## Can it really send notifications?

Yes, as real system notifications (lock screen / notification centre), with
some limits that come from how browsers work:

| Situation | What happens |
|---|---|
| Calendar open in a tab or as an installed app (even in the background) | Every reminder fires on time, in the style you picked |
| Calendar fully closed | Nothing can fire, because there's no server to wake it. When you open it again, reminders from the last 12 h show up as *missed* |
| iPhone / iPad | Notifications only work after **Share → Add to Home Screen** (iOS 16.4+), opened from the Home Screen icon |
| You need reminders even when it's closed | Use **Add to phone calendar** (per event) or **Export all** in 🔔 settings. Your phone's calendar then handles the reminders |

To get notifications that arrive with the app closed, the next step is a
small push server (Web Push), which this static app doesn't have.

## Running it

Notifications and the service worker need `https://` or `localhost`.

```
cd calendar
python3 -m http.server 8000
```

then open `http://localhost:8000`. To use it on your phone, host the folder
on any static HTTPS host (for example GitHub Pages), open it, add it to the
Home Screen, then tap 🔔 → **Turn on notifications**.

## Structure

- `index.html`: views (calendar, boards, board, upcoming) and dialogs
- `css/style.css`: the poster look; colour tokens at the top
- `js/app.js`: pill-letter font, recurrence, boards, event editor, reminder
  scheduler, sounds (WebAudio), notifications, `.ics` export
- `sw.js`: offline cache, shows notifications, focuses the app on tap
- `manifest.webmanifest`, `icon*.png`, `icon.svg`: installable app metadata

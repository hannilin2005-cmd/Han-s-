(() => {
  "use strict";

  const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const WEEK_LETTERS = ["M","T","W","T","F","S","S"];

  const STORAGE_KEY = "hancal-data-v1";
  const FIRED_KEY = "hancal-fired-v1";
  const LASTCHECK_KEY = "hancal-lastcheck-v1";

  const ALL_DAY_HOUR = 9;                 // all-day events "start" at 9am for reminder purposes
  const MISSED_LOOKBACK_MS = 12 * 3600e3; // how far back to catch reminders missed while closed
  const CHECK_EVERY_MS = 10e3;

  const COLORS = ["#f28aa6","#18a99c","#f5c400","#9b7fd1","#f08a4b","#5bb8e8","#6cc070","#e4505f","#c9a27e","#5d4c74"];
  const EMOJI_PICKS = ["💼","🥂","🌸","🛒","🎂","✈️","🏋️","📚","🎨","🍜","💊","🎵","🐶","❤️","⭐","📍","🎬","🧘","🏠","🎓"];

  const REMINDER_PRESETS = [
    [0, "At time of event"],
    [5, "5 min before"],
    [10, "10 min before"],
    [15, "15 min before"],
    [30, "30 min before"],
    [60, "1 hour before"],
    [120, "2 hours before"],
    [1440, "1 day before"],
    [2880, "2 days before"],
    [10080, "1 week before"],
  ];
  const STYLES = {
    notify: "🔔 Notification + sound",
    silent: "🔕 Silent notification",
    alarm: "⏰ Alarm (rings until dismissed)",
    inapp: "💬 Pop-up in the app only",
  };
  const SOUNDS = { chime: "Chime", bell: "Bell", pop: "Pop", beep: "Retro beep", none: "No sound" };
  const REPEATS = { none: "Doesn't repeat", daily: "Every day", weekly: "Every week", monthly: "Every month", yearly: "Every year" };

  /* ---------------------------------------------------------------
   * Pill font — letters drawn on a 3x5 grid as chains of capsules,
   * pinched at every joint, with a grainy offset shadow.
   * ------------------------------------------------------------- */
  const GLYPHS = {
    A: [[[0,4],[0,0],[2,0],[2,4]], [[0,2],[2,2]]],
    B: [[[0,4],[0,0],[1,0],[2,1],[1,2],[2,3],[1,4],[0,4]], [[0,2],[1,2]]],
    C: [[[2,0],[0,0],[0,4],[2,4]]],
    D: [[[0,0],[0,4],[1,4],[2,3],[2,1],[1,0],[0,0]]],
    E: [[[2,0],[0,0],[0,4],[2,4]], [[0,2],[1,2]]],
    F: [[[2,0],[0,0],[0,4]], [[0,2],[1,2]]],
    G: [[[2,0],[0,0],[0,4],[2,4],[2,2],[1,2]]],
    I: [[[1,0],[1,4]], [[0,0],[2,0]], [[0,4],[2,4]]],
    J: [[[0,0],[2,0],[2,4],[0,4],[0,3]]],
    L: [[[0,0],[0,4],[2,4]]],
    M: [[[0,4],[0,0],[1,1],[2,0],[2,4]], [[1,1],[1,2]]],
    N: [[[0,4],[0,0]], [[0,1],[2,3]], [[2,0],[2,4]]],
    O: [[[0,0],[2,0],[2,4],[0,4],[0,0]]],
    P: [[[0,4],[0,0],[2,0],[2,2],[0,2]]],
    R: [[[0,4],[0,0],[2,0],[2,2],[0,2]], [[1,2],[2,3],[2,4]]],
    S: [[[2,0],[0,0],[0,2],[2,2],[2,4],[0,4]]],
    T: [[[0,0],[2,0]], [[1,0],[1,4]]],
    U: [[[0,0],[0,4],[2,4],[2,0]]],
    V: [[[0,0],[0,3],[1,4],[2,3],[2,0]]],
    X: [[[0,0],[0,1],[2,3],[2,4]], [[2,0],[2,1],[0,3],[0,4]]],
    Y: [[[0,0],[0,1],[1,2],[2,1],[2,0]], [[1,2],[1,4]]],
  };

  function pillWordSVG(word, label) {
    // UX stretches the grid sideways so letters come out chunky, like the print
    const U = 40, UX = 1.3 * U, SW = 0.86 * U, INSET = 0.24 * U, ADV = 2 * UX + 1.3 * U;
    const SX = -0.2 * U, SY = 0.26 * U;
    const letters = [...word].filter((ch) => GLYPHS[ch]);
    const units = [];
    letters.forEach((ch, i) => {
      const seen = new Set();
      GLYPHS[ch].forEach((poly) => {
        for (let j = 0; j < poly.length - 1; j++) {
          const [x1, y1] = poly[j], [x2, y2] = poly[j + 1];
          const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
          for (let k = 0; k < n; k++) {
            const a = [x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n];
            const b = [x1 + (x2 - x1) * (k + 1) / n, y1 + (y2 - y1) * (k + 1) / n];
            const key = [a.join(","), b.join(",")].sort().join("|");
            if (seen.has(key)) continue;
            seen.add(key);
            units.push([i * ADV + a[0] * UX, a[1] * U, i * ADV + b[0] * UX, b[1] * U]);
          }
        }
      });
    });
    const lines = units.map(([x1, y1, x2, y2]) => {
      const len = Math.hypot(x2 - x1, y2 - y1);
      const ux = (x2 - x1) / len * INSET, uy = (y2 - y1) / len * INSET;
      return `<line x1="${(x1 + ux).toFixed(1)}" y1="${(y1 + uy).toFixed(1)}" x2="${(x2 - ux).toFixed(1)}" y2="${(y2 - uy).toFixed(1)}"/>`;
    }).join("");
    const pad = SW / 2 + 2;
    const minX = -pad + SX, minY = -pad;
    const w = (letters.length - 1) * ADV + 2 * UX + 2 * pad - SX;
    const h = 4 * U + 2 * pad + SY;
    return `<svg viewBox="${minX} ${minY} ${w} ${h}" role="img" aria-label="${esc(label || word)}">` +
      `<g class="pill-shadow" stroke-width="${SW}" stroke-linecap="round" transform="translate(${SX} ${SY})" filter="url(#grain)">${lines}</g>` +
      `<g class="pill-main" stroke-width="${SW}" stroke-linecap="round">${lines}</g></svg>`;
  }

  const SPARKLE_PATH = "M20 2C21.5 14 26 18.5 38 20C26 21.5 21.5 26 20 38C18.5 26 14 21.5 2 20C14 18.5 18.5 14 20 2Z";
  const SPARKLE = `<svg class="sparkle" viewBox="0 0 40 40" aria-hidden="true">` +
    `<path class="sparkle-back" d="${SPARKLE_PATH}" filter="url(#grain)"/>` +
    `<path class="sparkle-front" d="${SPARKLE_PATH}" transform="translate(20 20) scale(.58) translate(-20 -20)"/></svg>`;

  /* ---------------------------------------------------------------
   * Small helpers
   * ------------------------------------------------------------- */
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function pad2(n) { return String(n).padStart(2, "0"); }
  function dateKey(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
  function parseKey(k) { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function dayDiff(a, b) { return Math.round((b - a) / 864e5); }
  function todayKey() { return dateKey(new Date()); }

  function fmtTime(hm) {
    if (!hm) return "";
    const [h, m] = hm.split(":").map(Number);
    return `${(h % 12) || 12}:${pad2(m)} ${h < 12 ? "AM" : "PM"}`;
  }
  function shortDate(k) {
    const d = parseKey(k);
    return `${DAY_NAMES[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
  }
  function eventTimeLabel(ev) {
    if (ev.allDay) return "All day";
    return ev.end ? `${fmtTime(ev.start)} – ${fmtTime(ev.end)}` : fmtTime(ev.start);
  }
  function offsetLabel(min) {
    const preset = REMINDER_PRESETS.find(([m]) => m === min);
    if (preset) return preset[1];
    if (min % 1440 === 0) return `${min / 1440} days before`;
    if (min % 60 === 0) return `${min / 60} hours before`;
    return `${min} min before`;
  }
  function relLabel(ms) {
    const min = Math.round(ms / 60000);
    const abs = Math.abs(min);
    let s;
    if (abs < 1) return "now";
    if (abs < 60) s = `${abs} min`;
    else if (abs < 1440) s = `${Math.floor(abs / 60)} h${abs % 60 ? ` ${abs % 60} min` : ""}`;
    else s = `${Math.round(abs / 1440)} day${Math.round(abs / 1440) === 1 ? "" : "s"}`;
    return min > 0 ? `in ${s}` : `${s} ago`;
  }

  /* ---------------------------------------------------------------
   * Data layer — localStorage
   * ------------------------------------------------------------- */
  function defaultState() {
    return {
      categories: [
        { id: uid(), name: "Work", emoji: "💼", color: "#18a99c" },
        { id: uid(), name: "Friends", emoji: "🥂", color: "#f28aa6" },
        { id: uid(), name: "Self-care", emoji: "🌸", color: "#9b7fd1" },
      ],
      events: [],
      snoozes: [],
      settings: { hidden: [] },
    };
  }
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (s && Array.isArray(s.events) && Array.isArray(s.categories)) {
        return { snoozes: [], ...s, settings: { hidden: [], ...s.settings } };
      }
    } catch { /* fall through to a fresh calendar */ }
    return defaultState();
  }
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function loadFired() {
    try { return JSON.parse(localStorage.getItem(FIRED_KEY)) || {}; } catch { return {}; }
  }
  function saveFired(fired) {
    const cutoff = Date.now() - 30 * 864e5;
    for (const k of Object.keys(fired)) if (fired[k] < cutoff) delete fired[k];
    localStorage.setItem(FIRED_KEY, JSON.stringify(fired));
  }

  let state = loadState();

  function catOf(ev) {
    return state.categories.find((c) => c.id === ev.categoryId) || null;
  }
  function catColor(ev) { return catOf(ev)?.color || "#cfc6b4"; }
  function catEmoji(ev) { return catOf(ev)?.emoji || "📌"; }

  /* ---------------------------------------------------------------
   * Recurrence
   * ------------------------------------------------------------- */
  function occurrencesBetween(ev, fromKey, toKey) {
    const start = parseKey(ev.date);
    const repeat = ev.repeat || "none";
    if (repeat === "none") return ev.date >= fromKey && ev.date <= toKey ? [ev.date] : [];
    if (ev.date > toKey) return [];
    const from = parseKey(fromKey), to = parseKey(toKey);
    const out = [];
    if (repeat === "daily" || repeat === "weekly") {
      const step = repeat === "daily" ? 1 : 7;
      let d = start;
      if (from > start) d = addDays(start, Math.ceil(dayDiff(start, from) / step) * step);
      for (; d <= to; d = addDays(d, step)) out.push(dateKey(d));
    } else if (repeat === "monthly") {
      const day = start.getDate();
      let y = Math.max(from.getFullYear(), start.getFullYear());
      let m = from > start ? from.getMonth() : start.getMonth();
      if (from <= start) y = start.getFullYear();
      for (; new Date(y, m, 1) <= to; m++) {
        const dim = new Date(y, m + 1, 0).getDate();
        if (day > dim) continue;
        const d = new Date(y, m, day);
        if (d >= start && d >= from && d <= to) out.push(dateKey(d));
      }
    } else if (repeat === "yearly") {
      for (let y = Math.max(from.getFullYear(), start.getFullYear()); y <= to.getFullYear(); y++) {
        const d = new Date(y, start.getMonth(), start.getDate());
        if (d.getMonth() !== start.getMonth()) continue; // Feb 29 in a non-leap year
        if (d >= start && d >= from && d <= to) out.push(dateKey(d));
      }
    }
    return out;
  }

  function occStart(ev, occKey) {
    const d = parseKey(occKey);
    const [h, m] = ev.allDay ? [ALL_DAY_HOUR, 0] : (ev.start || "09:00").split(":").map(Number);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
  }

  function sortOcc(a, b) {
    if (a.key !== b.key) return a.key < b.key ? -1 : 1;
    if (a.ev.allDay !== b.ev.allDay) return a.ev.allDay ? -1 : 1;
    return (a.ev.start || "").localeCompare(b.ev.start || "");
  }

  function occurrenceList(fromKey, toKey, { respectHidden = false, events = state.events } = {}) {
    const hidden = new Set(state.settings.hidden);
    const out = [];
    for (const ev of events) {
      if (respectHidden && hidden.has(ev.categoryId || "")) continue;
      for (const key of occurrencesBetween(ev, fromKey, toKey)) out.push({ ev, key });
    }
    return out.sort(sortOcc);
  }

  function nextOccurrence(ev, fromKey) {
    for (const span of [31, 400, 1500]) {
      const hit = occurrencesBetween(ev, fromKey, dateKey(addDays(parseKey(fromKey), span)))[0];
      if (hit) return hit;
    }
    return null;
  }

  /* ---------------------------------------------------------------
   * Elements & view state
   * ------------------------------------------------------------- */
  const $ = (id) => document.getElementById(id);
  const els = {
    monthNav: $("monthNav"), prevBtn: $("prevBtn"), nextBtn: $("nextBtn"), todayBtn: $("todayBtn"),
    addBtn: $("addBtn"), settingsBtn: $("settingsBtn"), bellDot: $("bellDot"),
    views: { month: $("monthView"), boards: $("boardsView"), board: $("boardView"), upcoming: $("upcomingView") },
    monthWord: $("monthWord"), yearLabel: $("yearLabel"), weekdays: $("weekdays"), grid: $("grid"), filterRow: $("filterRow"),
    boardsWord: $("boardsWord"), boardsGrid: $("boardsGrid"),
    boardBack: $("boardBack"), boardEmoji: $("boardEmoji"), boardName: $("boardName"), boardEdit: $("boardEdit"), boardAdd: $("boardAdd"), pins: $("pins"),
    upcomingWord: $("upcomingWord"), upcomingList: $("upcomingList"),
    dayDialog: $("dayDialog"), dayKicker: $("dayKicker"), dayTitle: $("dayTitle"), dayList: $("dayList"), dayAdd: $("dayAdd"),
    eventDialog: $("eventDialog"), eventForm: $("eventForm"), eventHeading: $("eventHeading"),
    evTitle: $("evTitle"), evDate: $("evDate"), evRepeat: $("evRepeat"), evAllDay: $("evAllDay"), timeRow: $("timeRow"),
    evStart: $("evStart"), evEnd: $("evEnd"), evCategory: $("evCategory"), evLocation: $("evLocation"), evNotes: $("evNotes"),
    reminderList: $("reminderList"), addReminder: $("addReminder"), evDelete: $("evDelete"), evIcs: $("evIcs"),
    categoryDialog: $("categoryDialog"), categoryForm: $("categoryForm"), categoryHeading: $("categoryHeading"),
    catName: $("catName"), catEmoji: $("catEmoji"), emojiPicks: $("emojiPicks"), swatches: $("swatches"), catDelete: $("catDelete"),
    settingsDialog: $("settingsDialog"), notifDot: $("notifDot"), notifStatus: $("notifStatus"), notifEnable: $("notifEnable"), notifTest: $("notifTest"),
    icsAll: $("icsAll"), exportBtn: $("exportBtn"), importInput: $("importInput"),
    alarm: $("alarm"), alarmWord: $("alarmWord"), alarmTitle: $("alarmTitle"), alarmWhen: $("alarmWhen"), alarmDismiss: $("alarmDismiss"),
    toasts: $("toasts"),
  };

  const now0 = new Date();
  let viewYear = now0.getFullYear();
  let viewMonth = now0.getMonth();
  let currentView = "month";
  let currentBoardId = null;

  function setView(view) {
    currentView = view;
    for (const [name, el] of Object.entries(els.views)) el.hidden = name !== view;
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.view === view || (view === "board" && t.dataset.view === "boards"));
    });
    els.monthNav.classList.toggle("invisible", view !== "month");
    render();
    window.scrollTo({ top: 0 });
  }

  function render() {
    if (currentView === "month") renderMonth();
    else if (currentView === "boards") renderBoards();
    else if (currentView === "board") renderBoard();
    else if (currentView === "upcoming") renderUpcoming();
  }

  /* ---------------------------------------------------------------
   * Month view
   * ------------------------------------------------------------- */
  function chipHTML(ev) {
    return `<span class="chip" style="--c:${catColor(ev)}"><span class="t">${esc(ev.title)}</span></span>`;
  }

  function renderMonth() {
    els.monthWord.innerHTML = pillWordSVG(MONTH_ABBR[viewMonth], `${MONTH_NAMES[viewMonth]} ${viewYear}`);
    els.yearLabel.textContent = viewYear;
    els.weekdays.innerHTML = WEEK_LETTERS.map((w) => `<span>${w}</span>`).join("");

    const first = new Date(viewYear, viewMonth, 1);
    const days = new Date(viewYear, viewMonth + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
    const total = Math.ceil((lead + days) / 7) * 7;
    const byDay = new Map();
    for (const o of occurrenceList(dateKey(first), dateKey(new Date(viewYear, viewMonth, days)), { respectHidden: true })) {
      if (!byDay.has(o.key)) byDay.set(o.key, []);
      byDay.get(o.key).push(o);
    }
    const today = todayKey();
    let html = "";
    for (let i = 0; i < total; i++) {
      const d = i - lead + 1;
      if (d < 1 || d > days) {
        html += `<div class="cell blank" aria-hidden="true">${SPARKLE}</div>`;
        continue;
      }
      const k = dateKey(new Date(viewYear, viewMonth, d));
      const list = byDay.get(k) || [];
      const chips = list.slice(0, 3).map((o) => chipHTML(o.ev)).join("") +
        (list.length > 3 ? `<span class="more">+${list.length - 3}</span>` : "");
      const label = `${DAY_NAMES[parseKey(k).getDay()]} ${d} ${MONTH_NAMES[viewMonth]}, ${list.length} event${list.length === 1 ? "" : "s"}`;
      html += `<button class="cell${k === today ? " today" : ""}${list.length ? " has-events" : ""}" data-date="${k}" aria-label="${label}">` +
        `<span class="num">${d}</span>${list.length ? `<span class="chips">${chips}</span>` : ""}</button>`;
    }
    els.grid.innerHTML = html;
    renderFilters();
  }

  function renderFilters() {
    const hidden = new Set(state.settings.hidden);
    const cats = [...state.categories];
    if (state.events.some((e) => !catOf(e))) cats.push({ id: "", name: "Unsorted", emoji: "📌", color: "#cfc6b4" });
    els.filterRow.innerHTML = `<span class="filter-label">SHOW</span>` + cats.map((c) =>
      `<button class="filter-chip${hidden.has(c.id) ? " off" : ""}" data-filter="${c.id}" style="--c:${c.color}" aria-pressed="${!hidden.has(c.id)}">` +
      `<span class="fc-emoji">${esc(c.emoji)}</span>${esc(c.name)}</button>`).join("") +
      `<button class="filter-chip add" id="filterAddBoard">+ BOARD</button>`;
  }

  /* ---------------------------------------------------------------
   * Boards view (Pinterest-style)
   * ------------------------------------------------------------- */
  function boardsList() {
    const list = [...state.categories];
    if (state.events.some((e) => !catOf(e))) list.push({ id: "", name: "Unsorted", emoji: "📌", color: "#cfc6b4", virtual: true });
    return list;
  }
  function eventsInBoard(id) {
    return state.events.filter((e) => (catOf(e)?.id || "") === id);
  }

  function renderBoards() {
    els.boardsWord.innerHTML = pillWordSVG("BOARDS", "Boards");
    const today = todayKey();
    els.boardsGrid.innerHTML = boardsList().map((c) => {
      const evs = eventsInBoard(c.id);
      const next = evs.map((ev) => ({ ev, key: nextOccurrence(ev, today) })).filter((o) => o.key).sort(sortOcc).slice(0, 3);
      const minis = next.map((o, i) =>
        `<span class="mini-pin" style="--r:${[-3, 2, -1][i]}deg">${esc(o.ev.title)}<small>${shortDate(o.key)}</small></span>`).join("");
      return `<button class="board-card" data-board="${c.id}" style="--c:${c.color}">` +
        `<span class="board-cover"><span class="board-emoji">${esc(c.emoji)}</span><span class="mini-pins">${minis}</span></span>` +
        `<span class="board-meta"><strong>${esc(c.name)}</strong><span>${evs.length} event${evs.length === 1 ? "" : "s"}</span></span></button>`;
    }).join("") +
      `<button class="board-card add" id="newBoardCard"><span class="board-cover"><span class="plus">+</span></span>` +
      `<span class="board-meta"><strong>New board</strong><span>name it anything</span></span></button>`;
  }

  function pinHTML(ev, key) {
    const d = parseKey(key || ev.date);
    const past = !key;
    const rems = ev.reminders?.length || 0;
    return `<button class="pin${past ? " past" : ""}" data-event="${ev.id}" style="--c:${catColor(ev)}">` +
      `<span class="pin-top"><span class="pin-day">${DAY_NAMES[d.getDay()].slice(0, 3).toUpperCase()}</span>` +
      `<span class="pin-date">${pad2(d.getDate())}</span><span class="pin-mon">${MONTH_ABBR[d.getMonth()]} ${d.getFullYear()}</span></span>` +
      `<span class="pin-body"><span class="pin-title">${esc(ev.title)}</span>` +
      `<span class="pin-line">${esc(eventTimeLabel(ev))}${ev.repeat && ev.repeat !== "none" ? ` · ${REPEATS[ev.repeat].toLowerCase()}` : ""}</span>` +
      (ev.location ? `<span class="pin-line">📍 ${esc(ev.location)}</span>` : "") +
      (ev.notes ? `<span class="pin-notes">${esc(ev.notes)}</span>` : "") +
      (rems ? `<span class="pin-line pin-rem">🔔 ${ev.reminders.map((r) => esc(offsetLabel(r.offset))).join(", ")}</span>` : "") +
      (past ? `<span class="pin-line muted">past</span>` : "") +
      `</span></button>`;
  }

  function renderBoard() {
    const board = boardsList().find((c) => c.id === currentBoardId);
    if (!board) { setView("boards"); return; }
    els.boardEmoji.textContent = board.emoji;
    els.boardName.textContent = board.name;
    els.boardEdit.hidden = !!board.virtual;
    els.views.board.style.setProperty("--c", board.color);
    const today = todayKey();
    const evs = eventsInBoard(board.id).map((ev) => ({ ev, key: nextOccurrence(ev, today) }));
    const upcoming = evs.filter((o) => o.key).sort(sortOcc);
    const past = evs.filter((o) => !o.key).sort((a, b) => (a.ev.date < b.ev.date ? 1 : -1));
    els.pins.innerHTML = [...upcoming, ...past].map((o) => pinHTML(o.ev, o.key)).join("") ||
      `<p class="empty">Nothing pinned here yet. Tap <strong>+ PIN EVENT</strong> to add one.</p>`;
  }

  /* ---------------------------------------------------------------
   * Upcoming view
   * ------------------------------------------------------------- */
  function renderUpcoming() {
    els.upcomingWord.innerHTML = pillWordSVG("NEXT", "Upcoming");
    const from = todayKey();
    const list = occurrenceList(from, dateKey(addDays(new Date(), 60)), { respectHidden: true });
    if (!list.length) {
      els.upcomingList.innerHTML = `<p class="empty">Nothing in the next 60 days. Tap <strong>+ EVENT</strong> to add something.</p>`;
      return;
    }
    let html = "", lastKey = null;
    for (const { ev, key } of list) {
      if (key !== lastKey) {
        if (lastKey) html += `</div>`;
        html += `<div class="up-group"><h3 class="up-date">${key === from ? "TODAY · " : ""}${shortDate(key).toUpperCase()}</h3>`;
        lastKey = key;
      }
      const cat = catOf(ev);
      html += `<button class="up-row" data-event="${ev.id}" style="--c:${catColor(ev)}">` +
        `<span class="up-time">${ev.allDay ? "ALL DAY" : fmtTime(ev.start)}</span>` +
        `<span class="up-main"><strong>${esc(ev.title)}</strong><small>${esc(catEmoji(ev))} ${esc(cat?.name || "Unsorted")}${ev.location ? ` · 📍 ${esc(ev.location)}` : ""}</small></span>` +
        (ev.reminders?.length ? `<span class="up-bell" title="${ev.reminders.length} reminder(s)">🔔${ev.reminders.length > 1 ? ev.reminders.length : ""}</span>` : "") +
        `</button>`;
    }
    els.upcomingList.innerHTML = html + `</div>`;
  }

  /* ---------------------------------------------------------------
   * Dialog plumbing
   * ------------------------------------------------------------- */
  document.querySelectorAll("dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
    });
  });

  /* Day sheet */
  let dayKey = null;
  function openDay(k) {
    dayKey = k;
    const d = parseKey(k);
    els.dayKicker.textContent = DAY_NAMES[d.getDay()].toUpperCase();
    els.dayTitle.textContent = `${d.getDate()} ${MONTH_NAMES[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
    const list = occurrenceList(k, k);
    els.dayList.innerHTML = list.length ? list.map(({ ev }) =>
      `<button class="up-row" data-event="${ev.id}" style="--c:${catColor(ev)}">` +
      `<span class="up-time">${ev.allDay ? "ALL DAY" : fmtTime(ev.start)}</span>` +
      `<span class="up-main"><strong>${esc(ev.title)}</strong><small>${esc(catEmoji(ev))} ${esc(catOf(ev)?.name || "Unsorted")}</small></span>` +
      (ev.reminders?.length ? `<span class="up-bell">🔔</span>` : "") + `</button>`).join("")
      : `<p class="empty">Free day ✨</p>`;
    if (!els.dayDialog.open) els.dayDialog.showModal();
  }

  /* ---------------------------------------------------------------
   * Event editor
   * ------------------------------------------------------------- */
  let editingId = null;

  els.evRepeat.innerHTML = Object.entries(REPEATS).map(([v, l]) => `<option value="${v}">${l}</option>`).join("");

  function fillCategorySelect(selected) {
    els.evCategory.innerHTML = `<option value="">📌 No board</option>` +
      state.categories.map((c) => `<option value="${c.id}">${esc(c.emoji)} ${esc(c.name)}</option>`).join("") +
      `<option value="__new">＋ New board…</option>`;
    els.evCategory.value = state.categories.some((c) => c.id === selected) ? selected : "";
    els.evCategory.dataset.prev = els.evCategory.value;
  }

  function reminderRowHTML(r) {
    const isPreset = REMINDER_PRESETS.some(([m]) => m === r.offset);
    const unit = r.offset % 1440 === 0 && r.offset ? 1440 : r.offset % 60 === 0 && r.offset ? 60 : 1;
    return `<div class="rem-row">` +
      `<select class="rem-when" aria-label="When">${REMINDER_PRESETS.map(([m, l]) => `<option value="${m}"${isPreset && m === r.offset ? " selected" : ""}>${l}</option>`).join("")}` +
      `<option value="custom"${isPreset ? "" : " selected"}>Custom…</option></select>` +
      `<span class="rem-custom"${isPreset ? " hidden" : ""}><input class="rem-num" type="number" min="1" max="999" value="${isPreset ? 20 : r.offset / unit}" aria-label="Amount">` +
      `<select class="rem-unit" aria-label="Unit">${[[1, "min"], [60, "hours"], [1440, "days"]].map(([v, l]) => `<option value="${v}"${v === unit ? " selected" : ""}>${l}</option>`).join("")}</select><span>before</span></span>` +
      `<select class="rem-style" aria-label="Notification style">${Object.entries(STYLES).map(([v, l]) => `<option value="${v}"${v === r.style ? " selected" : ""}>${l}</option>`).join("")}</select>` +
      `<select class="rem-sound" aria-label="Sound"${r.style === "silent" ? " hidden" : ""}>${Object.entries(SOUNDS).map(([v, l]) => `<option value="${v}"${v === r.sound ? " selected" : ""}>🎵 ${l}</option>`).join("")}</select>` +
      `<button type="button" class="rem-play" title="Preview sound" aria-label="Preview sound">▶</button>` +
      `<button type="button" class="rem-del" title="Remove reminder" aria-label="Remove reminder">✕</button></div>`;
  }
  function addReminderRow(r) {
    els.reminderList.insertAdjacentHTML("beforeend", reminderRowHTML(r));
  }
  function collectReminders() {
    return [...els.reminderList.querySelectorAll(".rem-row")].map((row) => {
      const when = row.querySelector(".rem-when").value;
      const offset = when === "custom"
        ? Math.max(1, Math.round(Number(row.querySelector(".rem-num").value) || 1)) * Number(row.querySelector(".rem-unit").value)
        : Number(when);
      // fresh ids on every save so an edited reminder fires again at its new time
      return { id: uid(), offset, style: row.querySelector(".rem-style").value, sound: row.querySelector(".rem-sound").value };
    });
  }

  els.reminderList.addEventListener("change", (e) => {
    const row = e.target.closest(".rem-row");
    if (!row) return;
    if (e.target.classList.contains("rem-when")) row.querySelector(".rem-custom").hidden = e.target.value !== "custom";
    if (e.target.classList.contains("rem-style")) row.querySelector(".rem-sound").hidden = e.target.value === "silent";
  });
  els.reminderList.addEventListener("click", (e) => {
    const row = e.target.closest(".rem-row");
    if (!row) return;
    if (e.target.closest(".rem-del")) row.remove();
    if (e.target.closest(".rem-play")) playSound(row.querySelector(".rem-sound").value);
  });
  els.addReminder.addEventListener("click", () => addReminderRow({ offset: 15, style: "notify", sound: "chime" }));

  function syncAllDay() {
    els.timeRow.hidden = els.evAllDay.checked;
  }
  els.evAllDay.addEventListener("change", syncAllDay);

  function openEditor(id, presetDate, presetCategory) {
    const ev = state.events.find((e) => e.id === id);
    editingId = ev ? ev.id : null;
    els.eventHeading.textContent = ev ? "EDIT EVENT" : "NEW EVENT";
    els.evTitle.value = ev?.title || "";
    els.evDate.value = ev?.date || presetDate || todayKey();
    els.evRepeat.value = ev?.repeat || "none";
    els.evAllDay.checked = !!ev?.allDay;
    els.evStart.value = ev?.start || "09:00";
    els.evEnd.value = ev?.end ?? "10:00";
    els.evLocation.value = ev?.location || "";
    els.evNotes.value = ev?.notes || "";
    fillCategorySelect(ev ? ev.categoryId : presetCategory);
    els.reminderList.innerHTML = "";
    (ev ? ev.reminders : [{ offset: 15, style: "notify", sound: "chime" }]).forEach(addReminderRow);
    els.evDelete.hidden = !ev;
    syncAllDay();
    if (els.dayDialog.open) els.dayDialog.close();
    els.eventDialog.showModal();
    if (!ev) els.evTitle.focus();
  }

  function formEvent() {
    return {
      id: editingId || uid(),
      title: els.evTitle.value.trim(),
      date: els.evDate.value,
      repeat: els.evRepeat.value,
      allDay: els.evAllDay.checked,
      start: els.evStart.value || "09:00",
      end: els.evEnd.value || "",
      categoryId: els.evCategory.value && els.evCategory.value !== "__new" ? els.evCategory.value : null,
      location: els.evLocation.value.trim(),
      notes: els.evNotes.value.trim(),
      reminders: collectReminders(),
    };
  }

  els.evCategory.addEventListener("change", () => {
    if (els.evCategory.value !== "__new") { els.evCategory.dataset.prev = els.evCategory.value; return; }
    els.evCategory.value = els.evCategory.dataset.prev || "";
    openCategoryEditor(null, (cat) => fillCategorySelect(cat.id));
  });

  els.eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const ev = formEvent();
    if (!ev.title) { els.evTitle.focus(); els.evTitle.classList.add("invalid"); return; }
    if (!ev.date) { els.evDate.focus(); return; }
    els.evTitle.classList.remove("invalid");
    const i = state.events.findIndex((x) => x.id === ev.id);
    if (i >= 0) state.events[i] = ev; else state.events.push(ev);
    save();
    els.eventDialog.close();
    const d = parseKey(ev.date);
    if (currentView === "month" && i < 0) { viewYear = d.getFullYear(); viewMonth = d.getMonth(); }
    render();
    toast({ emoji: catEmoji(ev), title: i >= 0 ? "Event updated" : "Event added", body: `${ev.title} · ${shortDate(ev.date)}`, color: catColor(ev) });
    if (ev.reminders.some((r) => r.style !== "inapp") && notifPermission() === "default") nudgeNotifications();
  });

  els.evDelete.addEventListener("click", () => {
    const ev = state.events.find((e) => e.id === editingId);
    if (!ev) return;
    const repeatNote = ev.repeat && ev.repeat !== "none" ? " This deletes every repeat." : "";
    if (!confirm(`Delete "${ev.title}"?${repeatNote}`)) return;
    state.events = state.events.filter((e) => e.id !== editingId);
    state.snoozes = state.snoozes.filter((s) => s.eventId !== editingId);
    save();
    els.eventDialog.close();
    render();
  });

  els.evIcs.addEventListener("click", () => {
    const ev = formEvent();
    if (!ev.title || !ev.date) { els.evTitle.focus(); return; }
    downloadICS([ev], `${ev.title.replace(/[^\w\- ]+/g, "").trim() || "event"}.ics`);
  });

  /* ---------------------------------------------------------------
   * Board (category) editor
   * ------------------------------------------------------------- */
  let editingCat = null;
  let catSavedCb = null;
  let pickedColor = COLORS[0];

  els.emojiPicks.innerHTML = EMOJI_PICKS.map((e) => `<button type="button" class="emoji-pick">${e}</button>`).join("");
  els.emojiPicks.addEventListener("click", (e) => {
    const b = e.target.closest(".emoji-pick");
    if (b) els.catEmoji.value = b.textContent;
  });
  function renderSwatches() {
    els.swatches.innerHTML = COLORS.map((c) =>
      `<button type="button" class="swatch${c === pickedColor ? " on" : ""}" data-color="${c}" style="--c:${c}" aria-label="Colour ${c}" aria-pressed="${c === pickedColor}"></button>`).join("");
  }
  els.swatches.addEventListener("click", (e) => {
    const b = e.target.closest(".swatch");
    if (!b) return;
    pickedColor = b.dataset.color;
    renderSwatches();
  });

  function openCategoryEditor(id, onSaved) {
    editingCat = state.categories.find((c) => c.id === id) || null;
    catSavedCb = onSaved || null;
    els.categoryHeading.textContent = editingCat ? "EDIT BOARD" : "NEW BOARD";
    els.catName.value = editingCat?.name || "";
    els.catEmoji.value = editingCat?.emoji || EMOJI_PICKS[Math.floor(Math.random() * EMOJI_PICKS.length)];
    pickedColor = editingCat?.color || COLORS[state.categories.length % COLORS.length];
    renderSwatches();
    els.catDelete.hidden = !editingCat;
    els.categoryDialog.showModal();
    els.catName.focus();
  }

  els.categoryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = els.catName.value.trim();
    if (!name) { els.catName.focus(); els.catName.classList.add("invalid"); return; }
    els.catName.classList.remove("invalid");
    const emoji = els.catEmoji.value.trim() || "📌";
    let cat = editingCat;
    if (cat) Object.assign(cat, { name, emoji, color: pickedColor });
    else { cat = { id: uid(), name, emoji, color: pickedColor }; state.categories.push(cat); }
    save();
    els.categoryDialog.close();
    if (catSavedCb) catSavedCb(cat);
    render();
  });

  els.catDelete.addEventListener("click", () => {
    if (!editingCat) return;
    const n = eventsInBoard(editingCat.id).length;
    if (!confirm(`Delete the board "${editingCat.name}"?${n ? ` Its ${n} event${n === 1 ? "" : "s"} will move to Unsorted.` : ""}`)) return;
    const id = editingCat.id;
    state.categories = state.categories.filter((c) => c.id !== id);
    state.events.forEach((ev) => { if (ev.categoryId === id) ev.categoryId = null; });
    state.settings.hidden = state.settings.hidden.filter((h) => h !== id);
    save();
    els.categoryDialog.close();
    if (currentView === "board") setView("boards"); else render();
  });

  /* ---------------------------------------------------------------
   * Sounds — synthesized with WebAudio, no files needed
   * ------------------------------------------------------------- */
  let audioCtx = null;
  function audio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }
  // browsers only allow audio after the page has been touched once
  document.addEventListener("pointerdown", () => audio(), { once: true });

  function tone(c, { freq, type = "sine", start = 0, dur = 0.4, gain = 0.25, endFreq }) {
    const o = c.createOscillator(), g = c.createGain();
    const t = c.currentTime + start;
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  const SOUND_FX = {
    chime: (c) => [1046.5, 1318.5, 1568].forEach((f, i) => tone(c, { freq: f, start: i * 0.14, dur: 0.9, gain: 0.18 })),
    bell: (c) => { tone(c, { freq: 660, type: "triangle", dur: 1.6, gain: 0.3 }); tone(c, { freq: 1320, dur: 1.2, gain: 0.12 }); tone(c, { freq: 1980, dur: 0.8, gain: 0.06 }); },
    pop: (c) => { tone(c, { freq: 900, endFreq: 180, dur: 0.18, gain: 0.35 }); tone(c, { freq: 1200, endFreq: 300, start: 0.2, dur: 0.15, gain: 0.25 }); },
    beep: (c) => [0, 0.22, 0.44].forEach((s) => tone(c, { freq: 988, type: "square", start: s, dur: 0.14, gain: 0.1 })),
  };
  function playSound(name) {
    if (!name || name === "none" || !SOUND_FX[name]) return;
    const c = audio();
    if (c) SOUND_FX[name](c);
  }

  /* ---------------------------------------------------------------
   * Notifications
   * ------------------------------------------------------------- */
  function notifPermission() {
    return "Notification" in window ? Notification.permission : "unsupported";
  }

  async function systemNotify(title, opts) {
    if (notifPermission() !== "granted") return false;
    try {
      const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : null;
      if (reg) await reg.showNotification(title, { icon: "icon-192.png", badge: "icon-192.png", ...opts });
      else new Notification(title, { icon: "icon-192.png", ...opts });
      return true;
    } catch {
      return false;
    }
  }

  function toast({ emoji = "🔔", title, body = "", color = "#f28aa6", sticky = false, missed = false }) {
    const el = document.createElement("div");
    el.className = `toast${missed ? " missed" : ""}`;
    el.style.setProperty("--c", color);
    el.innerHTML = `<span class="toast-emoji">${esc(emoji)}</span><span class="toast-text"><strong>${esc(title)}</strong>${body ? `<small>${esc(body)}</small>` : ""}</span>` +
      `<button class="toast-x" aria-label="Dismiss">&times;</button>`;
    el.querySelector(".toast-x").addEventListener("click", () => el.remove());
    els.toasts.appendChild(el);
    if (!sticky) setTimeout(() => el.remove(), 8000);
  }

  let titleFlash = null;
  function flashTitle(text) {
    if (!document.hidden || titleFlash) return;
    const original = document.title;
    let on = false;
    titleFlash = setInterval(() => { document.title = (on = !on) ? `🔔 ${text}` : original; }, 1000);
    const stop = () => { clearInterval(titleFlash); titleFlash = null; document.title = original; document.removeEventListener("visibilitychange", stop); };
    document.addEventListener("visibilitychange", stop);
  }

  function fire(ev, occ, rem, { missed = false, snoozed = false } = {}) {
    const start = occStart(ev, occ);
    const title = `${catEmoji(ev)} ${ev.title}`;
    const when = ev.allDay ? `All day · ${shortDate(occ)}` : `${fmtTime(ev.start)} · ${shortDate(occ)}`;
    const rel = relLabel(start - Date.now());
    const starts = rel === "now" ? "Starting now" : rel.startsWith("in") ? `Starts ${rel}` : `Started ${rel}`;
    const body = `${missed ? "Missed while closed · " : ""}${starts} · ${when}${ev.location ? ` · 📍 ${ev.location}` : ""}${snoozed ? " (snoozed)" : ""}`;
    const tag = `${ev.id}|${occ}`;
    const color = catColor(ev);

    if (rem.style === "alarm" && !missed) {
      systemNotify(title, { body, tag, requireInteraction: true, renotify: true });
      openAlarm(ev, occ, rem, body);
      return;
    }
    if (rem.style === "inapp") {
      toast({ emoji: catEmoji(ev), title: ev.title, body, color, sticky: true, missed });
      if (!missed) playSound(rem.sound);
      flashTitle(ev.title);
      return;
    }
    const silent = rem.style === "silent" || missed;
    systemNotify(title, { body, tag, silent, renotify: true }).then((shown) => {
      if (!shown || !document.hidden) toast({ emoji: catEmoji(ev), title: ev.title, body, color, sticky: missed, missed });
    });
    if (!silent) playSound(rem.sound);
  }

  function checkReminders() {
    const now = Date.now();
    let last = Number(localStorage.getItem(LASTCHECK_KEY)) || now;
    last = Math.max(last, now - MISSED_LOOKBACK_MS);
    const fired = loadFired();
    const maxOffset = Math.max(0, ...state.events.flatMap((e) => (e.reminders || []).map((r) => r.offset)));
    const fromKey = dateKey(new Date(last - 864e5));
    const toKey = dateKey(new Date(now + (maxOffset + 1440) * 60e3));

    for (const ev of state.events) {
      if (!ev.reminders?.length) continue;
      for (const occ of occurrencesBetween(ev, fromKey, toKey)) {
        const start = occStart(ev, occ).getTime();
        for (const rem of ev.reminders) {
          const at = start - rem.offset * 60e3;
          const key = `${ev.id}|${occ}|${rem.id}`;
          if (at > last && at <= now && !fired[key]) {
            fired[key] = now;
            fire(ev, occ, rem, { missed: now - at > 3 * 60e3 });
          }
        }
      }
    }

    const due = state.snoozes.filter((s) => s.at <= now);
    if (due.length) {
      state.snoozes = state.snoozes.filter((s) => s.at > now);
      save();
      for (const s of due) {
        const ev = state.events.find((e) => e.id === s.eventId);
        if (ev) fire(ev, s.occ, { style: s.style, sound: s.sound }, { snoozed: true, missed: now - s.at > 15 * 60e3 });
      }
    }

    saveFired(fired);
    localStorage.setItem(LASTCHECK_KEY, String(now));
  }

  /* Ringing alarm overlay */
  const alarmQueue = [];
  let alarmLoop = null;
  function openAlarm(ev, occ, rem, body) {
    alarmQueue.push({ ev, occ, rem, body });
    if (alarmQueue.length === 1) showAlarm();
  }
  function showAlarm() {
    const a = alarmQueue[0];
    if (!a) { els.alarm.hidden = true; return; }
    els.alarmWord.innerHTML = pillWordSVG("RING", "Reminder");
    els.alarmTitle.textContent = `${catEmoji(a.ev)} ${a.ev.title}`;
    els.alarmWhen.textContent = a.body;
    els.alarm.style.setProperty("--c", catColor(a.ev));
    els.alarm.hidden = false;
    const snd = a.rem.sound && a.rem.sound !== "none" ? a.rem.sound : "beep";
    playSound(snd);
    clearInterval(alarmLoop);
    alarmLoop = setInterval(() => playSound(snd), 2200);
    flashTitle(a.ev.title);
    els.alarmDismiss.focus();
  }
  function closeAlarm(snoozeMin) {
    const a = alarmQueue.shift();
    clearInterval(alarmLoop);
    alarmLoop = null;
    if (a && snoozeMin) {
      state.snoozes.push({ id: uid(), eventId: a.ev.id, occ: a.occ, at: Date.now() + snoozeMin * 60e3, style: "alarm", sound: a.rem.sound });
      save();
      toast({ emoji: "😴", title: `Snoozed ${snoozeMin} min`, body: a.ev.title, color: catColor(a.ev) });
    }
    showAlarm();
  }
  els.alarmDismiss.addEventListener("click", () => closeAlarm(0));
  els.alarm.addEventListener("click", (e) => {
    const b = e.target.closest("[data-snooze]");
    if (b) closeAlarm(Number(b.dataset.snooze));
  });

  /* Settings dialog */
  function renderNotifStatus() {
    const p = notifPermission();
    const standaloneIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !navigator.standalone;
    const map = {
      granted: ["on", "Notifications are ON for this browser."],
      denied: ["off", "Notifications are BLOCKED. Allow them in your browser's site settings, then reload."],
      default: ["ask", "Notifications are off. Turn them on so reminders can pop up outside this tab."],
      unsupported: ["off", standaloneIOS
        ? "On iPhone, add this page to your Home Screen first (Share → Add to Home Screen), then open it from there."
        : "This browser can't show system notifications. Reminders will still pop up and ring inside the app."],
    };
    const [cls, text] = map[p];
    els.notifDot.className = `status-dot ${cls}`;
    els.notifStatus.textContent = text;
    els.notifEnable.hidden = p !== "default";
    els.bellDot.hidden = p !== "default" || !state.events.some((e) => e.reminders?.length);
  }

  async function enableNotifications() {
    if (notifPermission() !== "default") return renderNotifStatus();
    audio();
    try { await Notification.requestPermission(); } catch { /* old Safari uses a callback; status re-renders below */ }
    renderNotifStatus();
    if (notifPermission() === "granted") systemNotify("🔔 Notifications are on", { body: "Your reminders will show up here.", tag: "welcome" });
  }

  let nudged = false;
  function nudgeNotifications() {
    renderNotifStatus();
    if (nudged) return;
    nudged = true;
    toast({ emoji: "🔔", title: "Turn on notifications?", body: "Tap the bell at the top so reminders can reach you outside this tab.", sticky: true });
  }

  els.settingsBtn.addEventListener("click", () => { renderNotifStatus(); els.settingsDialog.showModal(); });
  els.notifEnable.addEventListener("click", enableNotifications);
  els.notifTest.addEventListener("click", () => {
    audio();
    els.notifTest.textContent = "SENDING IN 5…";
    setTimeout(() => {
      els.notifTest.textContent = "SEND A TEST IN 5 SEC";
      const ev = { id: "test", title: "Test reminder", date: todayKey(), allDay: false, start: `${pad2(new Date().getHours())}:${pad2(new Date().getMinutes())}`, categoryId: null };
      fire(ev, ev.date, { style: "notify", sound: "chime" });
    }, 5000);
  });

  /* ---------------------------------------------------------------
   * .ics export — lets the phone's own calendar take over reminders
   * ------------------------------------------------------------- */
  function icsEscape(s) {
    return String(s || "").replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  }
  function icsFold(line) {
    const out = [];
    while (line.length > 74) { out.push(line.slice(0, 74)); line = " " + line.slice(74); }
    out.push(line);
    return out.join("\r\n");
  }
  function icsDate(k) { return k.replace(/-/g, ""); }
  function icsDateTime(k, hm) { return `${icsDate(k)}T${hm.replace(":", "")}00`; }

  function buildICS(events) {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Han's Calendar//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    for (const ev of events) {
      lines.push("BEGIN:VEVENT", `UID:${ev.id}@hans-calendar`, `DTSTAMP:${stamp}`);
      if (ev.allDay) {
        lines.push(`DTSTART;VALUE=DATE:${icsDate(ev.date)}`, `DTEND;VALUE=DATE:${icsDate(dateKey(addDays(parseKey(ev.date), 1)))}`);
      } else {
        const start = ev.start || "09:00";
        let end = ev.end && ev.end > start ? ev.end : null;
        if (!end) { const [h, m] = start.split(":").map(Number); end = `${pad2(Math.min(23, h + 1))}:${pad2(h >= 23 ? 59 : m)}`; }
        lines.push(`DTSTART:${icsDateTime(ev.date, start)}`, `DTEND:${icsDateTime(ev.date, end)}`);
      }
      if (ev.repeat && ev.repeat !== "none") lines.push(`RRULE:FREQ=${ev.repeat.toUpperCase()}`);
      lines.push(`SUMMARY:${icsEscape(ev.title)}`);
      if (ev.location) lines.push(`LOCATION:${icsEscape(ev.location)}`);
      if (ev.notes) lines.push(`DESCRIPTION:${icsEscape(ev.notes)}`);
      const cat = catOf(ev);
      if (cat) lines.push(`CATEGORIES:${icsEscape(cat.name)}`);
      for (const r of ev.reminders || []) {
        // all-day alarms are relative to midnight, so shift by the 9am reminder base
        const rel = ev.allDay ? ALL_DAY_HOUR * 60 - r.offset : -r.offset;
        lines.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsEscape(ev.title)}`,
          `TRIGGER:${rel < 0 ? "-" : ""}PT${Math.abs(rel)}M`, "END:VALARM");
      }
      lines.push("END:VEVENT");
    }
    lines.push("END:VCALENDAR");
    return lines.map(icsFold).join("\r\n") + "\r\n";
  }

  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  function downloadICS(events, name) {
    download(new Blob([buildICS(events)], { type: "text/calendar;charset=utf-8" }), name);
  }

  els.icsAll.addEventListener("click", () => {
    if (!state.events.length) { toast({ emoji: "🗓️", title: "No events yet", body: "Add some events first." }); return; }
    downloadICS(state.events, "hans-calendar.ics");
  });

  /* Backup */
  els.exportBtn.addEventListener("click", () => {
    download(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }), `hans-calendar-backup-${todayKey()}.json`);
  });
  els.importInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data.events) || !Array.isArray(data.categories)) throw new Error("bad file");
      if (!confirm(`Replace your calendar with this backup (${data.events.length} events, ${data.categories.length} boards)?`)) return;
      state = { snoozes: [], ...data, settings: { hidden: [], ...data.settings } };
      save();
      render();
      toast({ emoji: "✅", title: "Backup imported" });
    } catch {
      alert("That file doesn't look like a calendar backup.");
    } finally {
      e.target.value = "";
    }
  });

  /* ---------------------------------------------------------------
   * Wiring
   * ------------------------------------------------------------- */
  function shiftMonth(delta) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderMonth();
  }
  els.prevBtn.addEventListener("click", () => shiftMonth(-1));
  els.nextBtn.addEventListener("click", () => shiftMonth(1));
  els.todayBtn.addEventListener("click", () => {
    const d = new Date();
    viewYear = d.getFullYear();
    viewMonth = d.getMonth();
    renderMonth();
  });
  els.addBtn.addEventListener("click", () => {
    const presetDate = currentView === "month" && (viewYear !== new Date().getFullYear() || viewMonth !== new Date().getMonth())
      ? dateKey(new Date(viewYear, viewMonth, 1)) : null;
    openEditor(null, presetDate, currentView === "board" ? currentBoardId : null);
  });
  document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => setView(t.dataset.view)));

  els.grid.addEventListener("click", (e) => {
    const cell = e.target.closest(".cell[data-date]");
    if (cell) openDay(cell.dataset.date);
  });
  let touchX = null;
  els.grid.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  els.grid.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 70) shiftMonth(dx < 0 ? 1 : -1);
  });

  els.filterRow.addEventListener("click", (e) => {
    if (e.target.closest("#filterAddBoard")) { openCategoryEditor(null); return; }
    const chip = e.target.closest("[data-filter]");
    if (!chip) return;
    const id = chip.dataset.filter;
    const hidden = new Set(state.settings.hidden);
    if (hidden.has(id)) hidden.delete(id); else hidden.add(id);
    state.settings.hidden = [...hidden];
    save();
    renderMonth();
  });

  els.boardsGrid.addEventListener("click", (e) => {
    if (e.target.closest("#newBoardCard")) { openCategoryEditor(null); return; }
    const card = e.target.closest("[data-board]");
    if (!card) return;
    currentBoardId = card.dataset.board;
    setView("board");
  });
  els.boardBack.addEventListener("click", () => setView("boards"));
  els.boardEdit.addEventListener("click", () => openCategoryEditor(currentBoardId));
  els.boardAdd.addEventListener("click", () => openEditor(null, null, currentBoardId));

  // any event row/pin anywhere opens the editor
  document.addEventListener("click", (e) => {
    const row = e.target.closest("[data-event]");
    if (row) openEditor(row.dataset.event);
  });
  els.dayAdd.addEventListener("click", () => openEditor(null, dayKey));

  document.addEventListener("keydown", (e) => {
    if (currentView !== "month" || document.querySelector("dialog[open]") || !els.alarm.hidden) return;
    if (e.target.closest("input, textarea, select")) return;
    if (e.key === "ArrowLeft") shiftMonth(-1);
    if (e.key === "ArrowRight") shiftMonth(1);
  });

  // keep "today" correct if the app stays open past midnight
  let renderedToday = todayKey();
  function tick() {
    checkReminders();
    if (todayKey() !== renderedToday) { renderedToday = todayKey(); render(); }
  }

  if ("serviceWorker" in navigator && window.isSecureContext) {
    navigator.serviceWorker.register("sw.js").catch(() => { /* notifications fall back to new Notification() */ });
  }

  if (!localStorage.getItem(STORAGE_KEY)) save(); // pin the starter boards' ids
  render();
  renderNotifStatus();
  tick();
  setInterval(tick, CHECK_EVERY_MS);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
})();

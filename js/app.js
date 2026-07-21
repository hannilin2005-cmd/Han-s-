(() => {
  "use strict";

  /* ---------------------------------------------------------------
   * Palettes — the whole card re-skins itself as the month changes.
   * ------------------------------------------------------------- */
  const PALETTES = [
    { card: "#bfe3ff", dot: "#9fd0f5", page: "#fbfeff", ink: "#123e7a", spiralL: "#6fa9ff", spiralD: "#0c2a5c", mark: "#b4531f", markSoft: "#f0c8a8" }, // Jan
    { card: "#ffb3c6", dot: "#f596b0", page: "#fff7f9", ink: "#7a1237", spiralL: "#ff8fae", spiralD: "#5c0c26", mark: "#8a3a12", markSoft: "#f2c9a8" }, // Feb
    { card: "#b9f2d9", dot: "#98e5bf", page: "#f6fffb", ink: "#0b6b4f", spiralL: "#6fe0ac", spiralD: "#08432f", mark: "#a4501f", markSoft: "#f0cba8" }, // Mar
    { card: "#e3c9ff", dot: "#d1a8f5", page: "#faf6ff", ink: "#4b1b8c", spiralL: "#b98cff", spiralD: "#2f0c5c", mark: "#8a3a12", markSoft: "#eec9a8" }, // Apr
    { card: "#ffe68a", dot: "#f5d15c", page: "#fffdf3", ink: "#8c6a1b", spiralL: "#ffcf4f", spiralD: "#5c4308", mark: "#a4501f", markSoft: "#f0cba8" }, // May
    { card: "#6fea6f", dot: "#58c95a", page: "#fbfff5", ink: "#2a3fbe", spiralL: "#6f8bff", spiralD: "#14206b", mark: "#b4531f", markSoft: "#f0c8a8" }, // Jun
    { card: "#ffb07c", dot: "#f5964f", page: "#fffaf3", ink: "#8c3a1b", spiralL: "#ff8f4f", spiralD: "#5c2308", mark: "#7a2a12", markSoft: "#f2cba0" }, // Jul
    { card: "#8ce8e0", dot: "#63d6cb", page: "#f3ffff", ink: "#123b5c", spiralL: "#5fc9ff", spiralD: "#0c2a44", mark: "#a4501f", markSoft: "#f0cba8" }, // Aug
    { card: "#f2c14e", dot: "#e0a92c", page: "#fffcf3", ink: "#5c3a12", spiralL: "#ffb84f", spiralD: "#402505", mark: "#7a2a12", markSoft: "#f2cba0" }, // Sep
    { card: "#f2935c", dot: "#e07539", page: "#fff8f3", ink: "#5c1b12", spiralL: "#ff8f5c", spiralD: "#3d0f08", mark: "#5c1b12", markSoft: "#f0c0a0" }, // Oct
    { card: "#d8b4e2", dot: "#c091d1", page: "#faf5fc", ink: "#4a1b4a", spiralL: "#b988c9", spiralD: "#2e0f30", mark: "#7a2a12", markSoft: "#eec9a8" }, // Nov
    { card: "#a8d8e8", dot: "#84c2d6", page: "#f5fbfd", ink: "#1b3b5c", spiralL: "#6fb8dd", spiralD: "#0f2537", mark: "#a4501f", markSoft: "#f0cba8" }, // Dec
  ];

  const MONTH_NAMES = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
  const WEEKDAYS = ["M","T","W","T","F","S","S"];
  const STORAGE_KEY = "mend-data-v1";

  const todayDate = new Date();
  const todayKey = dateKey(todayDate);

  let viewYear = todayDate.getFullYear();
  let viewMonth = todayDate.getMonth();

  const els = {
    card: document.getElementById("calendarCard"),
    spiral: document.getElementById("spiralSvg"),
    monthTitle: document.getElementById("monthTitle"),
    yearLabel: document.getElementById("yearLabel"),
    weekdayRow: document.getElementById("weekdayRow"),
    grid: document.getElementById("grid"),
    prevBtn: document.getElementById("prevMonth"),
    nextBtn: document.getElementById("nextMonth"),
    statStreak: document.getElementById("statStreak"),
    statBest: document.getElementById("statBest"),
    statMonthClear: document.getElementById("statMonthClear"),
    statMonthPicked: document.getElementById("statMonthPicked"),
    exportBtn: document.getElementById("exportBtn"),
    importInput: document.getElementById("importInput"),
  };

  /* ---------------------------------------------------------------
   * Data layer — localStorage, keyed by "YYYY-MM-DD" -> "clear"|"picked"
   * ------------------------------------------------------------- */
  function loadData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  function dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  let data = loadData();

  /* ---------------------------------------------------------------
   * Wavy-edge clip path — sampled around a rounded rect, perturbed
   * with a sine wave along the outward normal, smoothed with a
   * closed Catmull-Rom -> Bezier conversion.
   * ------------------------------------------------------------- */
  function buildWavyPoints(w, h, radius, amp, wavesPerSide) {
    const r = Math.min(radius, w / 2, h / 2);
    const pts = [];

    function addEdge(x1, y1, x2, y2, nx, ny) {
      const len = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(6, Math.round(len / 14));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        const wave = Math.sin(t * Math.PI * wavesPerSide) * amp;
        pts.push([x + nx * wave, y + ny * wave]);
      }
    }
    function addCorner(cx, cy, startDeg, endDeg) {
      const steps = 8;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const deg = startDeg + (endDeg - startDeg) * t;
        const rad = (deg * Math.PI) / 180;
        pts.push([cx + r * Math.cos(rad), cy + r * Math.sin(rad)]);
      }
    }

    addEdge(r, 0, w - r, 0, 0, -1);
    addCorner(w - r, r, -90, 0);
    addEdge(w, r, w, h - r, 1, 0);
    addCorner(w - r, h - r, 0, 90);
    addEdge(w - r, h, r, h, 0, 1);
    addCorner(r, h - r, 90, 180);
    addEdge(0, h - r, 0, r, -1, 0);
    addCorner(r, r, 180, 270);
    return pts;
  }

  function pointsToPath(pts) {
    const n = pts.length;
    let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
    }
    return d + "Z";
  }

  function applyWavyClip() {
    const w = els.card.offsetWidth;
    const h = els.card.offsetHeight;
    if (!w || !h) return;
    const pts = buildWavyPoints(w, h, 46, 7, 3);
    const d = pointsToPath(pts);
    els.card.style.clipPath = `path('${d}')`;
  }

  /* ---------------------------------------------------------------
   * Spiral binding
   * ------------------------------------------------------------- */
  function buildSpiral() {
    const n = 15;
    let html = "";
    for (let i = 0; i < n; i++) {
      const x = 3 + i * (94 / (n - 1));
      html += `<ellipse cx="${x}" cy="7.6" rx="1.4" ry="1.4" style="fill:#111;opacity:.5" />`;
      html += `<path d="M ${x - 3.1} 6.2 A 3.1 4.4 0 1 1 ${x + 3.1} 6.2" fill="none" style="stroke:var(--spiral-dark)" stroke-width="1.5" stroke-linecap="round" />`;
      html += `<path d="M ${x - 3.1} 3.2 A 3.1 4.4 0 1 0 ${x + 3.1} 3.2" fill="none" style="stroke:var(--spiral-light)" stroke-width="1.5" stroke-linecap="round" />`;
    }
    els.spiral.innerHTML = html;
  }

  /* ---------------------------------------------------------------
   * Marks
   * ------------------------------------------------------------- */
  function scratchSvg() {
    return `<svg class="mark-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path class="scratch" d="M20,26 Q52,70 82,64 Q48,46 78,20" />
    </svg>`;
  }
  function patchSvg() {
    return `<svg class="mark-svg" viewBox="0 0 100 100">
      <g class="patch" transform="translate(58,58)">
        <rect x="-20" y="-20" width="40" height="40" rx="10" transform="rotate(8)" />
        <path d="M-9,0 H9 M0,-9 V9" transform="rotate(8)" />
      </g>
    </svg>`;
  }

  /* ---------------------------------------------------------------
   * Rendering
   * ------------------------------------------------------------- */
  function applyPalette() {
    const p = PALETTES[viewMonth];
    const root = document.documentElement.style;
    root.setProperty("--card", p.card);
    root.setProperty("--card-dot", p.dot);
    root.setProperty("--page", p.page);
    root.setProperty("--ink", p.ink);
    root.setProperty("--spiral-light", p.spiralL);
    root.setProperty("--spiral-dark", p.spiralD);
    root.setProperty("--mark", p.mark);
    root.setProperty("--mark-soft", p.markSoft);
  }

  function renderWeekdays() {
    els.weekdayRow.innerHTML = WEEKDAYS.map(
      (w) => `<span class="weekday-pill">${w}</span>`
    ).join("");
  }

  function renderMonthTitle() {
    const name = MONTH_NAMES[viewMonth];
    els.monthTitle.textContent = name;
    els.monthTitle.classList.remove("medium", "long");
    if (name.length >= 7) els.monthTitle.classList.add("long");
    else if (name.length >= 5) els.monthTitle.classList.add("medium");
    els.yearLabel.textContent = String(viewYear);
  }

  function renderGrid() {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const offset = (firstOfMonth.getDay() + 6) % 7; // Monday-start
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const totalCells = offset + daysInMonth;
    const trailing = (7 - (totalCells % 7)) % 7;

    let html = "";
    for (let i = 0; i < offset; i++) {
      html += `<div class="day-cell empty"></div>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(viewYear, viewMonth, day);
      const key = dateKey(cellDate);
      const state = data[key];
      const isFuture = cellDate > todayDate && key !== todayKey;
      const isToday = key === todayKey;

      let cls = "day-cell";
      if (isFuture) cls += " future";
      if (isToday) cls += " today";

      let mark = "";
      if (state === "clear") mark = scratchSvg();
      else if (state === "picked") mark = patchSvg();

      html += `<div class="${cls}" data-key="${key}" data-future="${isFuture}">${day}${mark}</div>`;
    }
    for (let i = 0; i < trailing; i++) {
      html += `<div class="day-cell empty"></div>`;
    }
    els.grid.innerHTML = html;
  }

  function render() {
    applyPalette();
    renderMonthTitle();
    renderGrid();
    requestAnimationFrame(applyWavyClip);
    renderStats();
  }

  /* ---------------------------------------------------------------
   * Interaction — tap a day to cycle: blank -> clear -> picked -> blank
   * ------------------------------------------------------------- */
  els.grid.addEventListener("click", (e) => {
    const cell = e.target.closest(".day-cell");
    if (!cell || cell.classList.contains("empty")) return;
    if (cell.dataset.future === "true") return;

    const key = cell.dataset.key;
    const current = data[key];
    if (!current) data[key] = "clear";
    else if (current === "clear") data[key] = "picked";
    else delete data[key];

    saveData(data);
    render();
  });

  els.prevBtn.addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    render();
  });
  els.nextBtn.addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    render();
  });

  /* ---------------------------------------------------------------
   * Stats
   * ------------------------------------------------------------- */
  function computeCurrentStreak() {
    let streak = 0;
    const cursor = new Date(todayDate);
    let first = true;
    while (true) {
      const state = data[dateKey(cursor)];
      if (state === "clear") {
        streak++;
      } else if (state === "picked") {
        break;
      } else if (!first) {
        break;
      }
      first = false;
      cursor.setDate(cursor.getDate() - 1);
      if (todayDate.getFullYear() - cursor.getFullYear() > 5) break; // safety bound
    }
    return streak;
  }

  function computeBestStreak() {
    const keys = Object.keys(data);
    if (keys.length === 0) return 0;
    const dates = keys.map((k) => new Date(k)).sort((a, b) => a - b);
    let best = 0, run = 0;
    let prev = null;
    for (const d of dates) {
      const state = data[dateKey(d)];
      const consecutive = prev && (d - prev) / 86400000 === 1;
      if (state === "clear") {
        run = consecutive ? run + 1 : 1;
        best = Math.max(best, run);
      } else {
        run = 0;
      }
      prev = d;
    }
    return best;
  }

  function renderStats() {
    let monthClear = 0, monthPicked = 0;
    for (const [key, state] of Object.entries(data)) {
      const [y, m] = key.split("-").map(Number);
      if (y === viewYear && m - 1 === viewMonth) {
        if (state === "clear") monthClear++;
        else if (state === "picked") monthPicked++;
      }
    }
    els.statStreak.textContent = computeCurrentStreak();
    els.statBest.textContent = computeBestStreak();
    els.statMonthClear.textContent = monthClear;
    els.statMonthPicked.textContent = monthPicked;
  }

  /* ---------------------------------------------------------------
   * Export / import
   * ------------------------------------------------------------- */
  els.exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mend-backup-${dateKey(todayDate)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  els.importInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed && typeof parsed === "object") {
        data = { ...data, ...parsed };
        saveData(data);
        render();
      }
    } catch {
      alert("That file couldn't be read as MEND data.");
    }
    e.target.value = "";
  });

  /* ---------------------------------------------------------------
   * Init
   * ------------------------------------------------------------- */
  window.addEventListener("resize", () => requestAnimationFrame(applyWavyClip));
  renderWeekdays();
  buildSpiral();
  render();
})();

(() => {
  "use strict";

  const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const WEEKDAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const STORAGE_KEY = "mend-data-v1";

  const todayDate = new Date();
  const todayKey = dateKey(todayDate);

  let viewYear = todayDate.getFullYear();
  let viewMonth = todayDate.getMonth();

  const els = {
    monthAbbrev: document.getElementById("monthAbbrev"),
    monthNum: document.getElementById("monthNum"),
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
   * Rendering
   * ------------------------------------------------------------- */
  function renderWeekdays() {
    els.weekdayRow.innerHTML = WEEKDAYS.map((w) => `<span>${w}</span>`).join("");
  }

  function renderBrand() {
    els.monthAbbrev.textContent = MONTH_ABBR[viewMonth];
    els.monthNum.textContent = String(viewMonth + 1).padStart(2, "0");
    els.yearLabel.textContent = String(viewYear);
  }

  function renderGrid() {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const offset = firstOfMonth.getDay(); // Sunday-start
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
      if (state === "clear") cls += " state-clear";
      else if (state === "picked") cls += " state-picked";

      html += `<div class="${cls}" data-key="${key}" data-future="${isFuture}">
        <span class="day-circle"></span>
        <span class="day-num">${day}</span>
      </div>`;
    }
    for (let i = 0; i < trailing; i++) {
      html += `<div class="day-cell empty"></div>`;
    }
    els.grid.innerHTML = html;
  }

  function render() {
    renderBrand();
    renderGrid();
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
    const streak = computeCurrentStreak();
    els.statStreak.textContent = `${streak} DAY STREAK`;
    els.statBest.textContent = `BEST ${computeBestStreak()}`;
    els.statMonthClear.textContent = `${monthClear} CLEAR`;
    els.statMonthPicked.textContent = `${monthPicked} PICKED`;
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
  renderWeekdays();
  render();
})();

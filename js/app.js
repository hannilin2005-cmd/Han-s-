/* ---------------------------------------------------------------
 * BLOOM — mock ICP signal data for B2C beauty & wellness brands
 *
 * Everything below is generated locally to model what a real web /
 * social scanning pipeline would surface. Swap SOURCES + templates
 * for real API calls (TikTok/Instagram/YouTube/Reddit APIs, review
 * platforms, Google Trends) to turn this into a live system.
 * ------------------------------------------------------------- */

const SOURCES = [
  { id: "tiktok", name: "TikTok" },
  { id: "instagram", name: "Instagram" },
  { id: "youtube", name: "YouTube" },
  { id: "reddit", name: "Reddit" },
  { id: "pinterest", name: "Pinterest" },
  { id: "reviews", name: "Reviews & Retail" },
  { id: "trends", name: "Google Trends" },
  { id: "creator", name: "Creator DMs" },
];

const HANDLE_PREFIXES = [
  "glow", "dewy", "sage", "bare", "velvet", "sunlit", "soft", "bloom",
  "luxe", "clean", "calm", "radiant", "golden", "quiet", "wild", "rosy",
];

const HANDLE_CORES = [
  "girl", "beauty", "skin", "rituals", "selfcare", "glowup", "wellness",
  "routine", "mama", "gains", "radiance", "botanicals", "studio", "edit",
];

function generateHandle() {
  const p = HANDLE_PREFIXES[Math.floor(Math.random() * HANDLE_PREFIXES.length)];
  const c = HANDLE_CORES[Math.floor(Math.random() * HANDLE_CORES.length)];
  const num = Math.random() < 0.35 ? String(Math.floor(Math.random() * 89) + 10) : "";
  return `@${p}.${c}${num}`;
}

const SEGMENTS = [
  {
    id: "skincycling",
    name: "Gen Z Skin-Cycling Enthusiast",
    emoji: "✨",
    icp: {
      ageRange: "16–24",
      spendTier: "$15–$40 per item · high repeat rate",
      channels: ["TikTok", "Instagram Reels", "TikTok Shop"],
      triggers: ["Viral \"GRWM\" or skin-cycling videos", "Ingredient call-outs (retinol, niacinamide, azelaic acid)", "Dupe comparisons to prestige brands"],
      hooks: [
        "Before/after 2-week check-ins",
        "\"Is this worth the hype\" honest reviews",
        "Ingredient-breakdown carousels",
        "Affordable dupe call-outs",
      ],
    },
    trending: [
      { tag: "#SkinCycling", mentions: 41200, delta: 22 },
      { tag: "#SkinTok", mentions: 88900, delta: 9 },
      { tag: "#Slugging", mentions: 15600, delta: -4 },
      { tag: "dupe culture", mentions: 26300, delta: 31 },
    ],
    signalTemplates: [
      { source: "tiktok", score: [75, 98], text: '{handle} posted a "get ready with me" video featuring a skin-cycling routine — 38K views and the top comment asks "wait what serum is that??"' },
      { source: "tiktok", score: [80, 99], text: '{handle} added a viral retinol-alternative serum to their TikTok Shop cart mid-livestream and asked for a discount code.' },
      { source: "reddit", score: [58, 85], text: '{handle} started a thread in r/SkincareAddiction asking for a "skin cycling starter kit under $50" — 40+ replies.' },
      { source: "instagram", score: [52, 80], text: '{handle} saved a "SkinTok holy grails" Reel to a highlight titled "next order."' },
      { source: "reviews", score: [65, 90], text: '{handle} left a 5-star review titled "finally something that doesn\'t irritate my skin" on a niacinamide serum.' },
      { source: "trends", score: [48, 76], text: 'Search interest for "skin cycling routine dupe" spiked 38% in {handle}\'s metro area this week.' },
    ],
  },
  {
    id: "cleanbeauty",
    name: "Clean & Conscious Beauty Shopper",
    emoji: "\u{1F33F}",
    icp: {
      ageRange: "28–42",
      spendTier: "$30–$90 per item · values-first loyalty",
      channels: ["Instagram", "Pinterest", "Email / Substack"],
      triggers: ["Full ingredient-list transparency", "EWG / Clean at Sephora certifications", "Founder-story content"],
      hooks: [
        "\"What's NOT in this\" messaging",
        "Sustainability + refill program highlights",
        "Dermatologist or esthetician endorsements",
        "Founder-led origin-story video",
      ],
    },
    trending: [
      { tag: "#CleanBeauty", mentions: 33400, delta: 12 },
      { tag: "#NonToxic", mentions: 19800, delta: 17 },
      { tag: "fragrance-free", mentions: 9100, delta: 24 },
      { tag: "#EWGVerified", mentions: 6700, delta: 6 },
    ],
    signalTemplates: [
      { source: "instagram", score: [60, 88], text: '{handle} commented "finally a brand that lists EVERYTHING" on a clean-beauty founder\'s Reel.' },
      { source: "pinterest", score: [50, 78], text: '{handle} pinned a "clean beauty swaps" board 5 times this week, saving ingredient-label close-ups.' },
      { source: "reddit", score: [55, 82], text: '{handle}\'s comment recommending a fragrance-free moisturizer for sensitive skin hit 300+ upvotes on r/beauty.' },
      { source: "reviews", score: [62, 90], text: '{handle} left a review praising a brand\'s refill program: "I\'ll never buy the full bottle again."' },
      { source: "creator", score: [70, 95], text: '{handle} (9.2K followers) DMed asking about ingredient sourcing before agreeing to a paid partnership.' },
      { source: "trends", score: [45, 74], text: 'Search interest for "is [brand] actually clean" up 19% this week, tied to {handle}\'s shared explainer post.' },
    ],
  },
  {
    id: "menopause",
    name: "Menopause & Midlife Wellness Seeker",
    emoji: "\u{1F338}",
    icp: {
      ageRange: "45–60",
      spendTier: "$40–$120 per month across skin + supplements",
      channels: ["Facebook Groups", "YouTube", "Reddit"],
      triggers: ["Hormonal skin/hair change symptoms", "Peer recommendations in private groups", "Physician or dietitian-backed claims"],
      hooks: [
        "Symptom-specific education content",
        "Real-women-not-models testimonials",
        "Doctor Q&A / science-backed messaging",
        "\"Why is no one talking about this\" framing",
      ],
    },
    trending: [
      { tag: "#Perimenopause", mentions: 24700, delta: 29 },
      { tag: "#MenopauseTok", mentions: 18300, delta: 34 },
      { tag: "hormone health", mentions: 11200, delta: 15 },
      { tag: "#MidlifeWellness", mentions: 5400, delta: 10 },
    ],
    signalTemplates: [
      { source: "youtube", score: [55, 82], text: '{handle} commented on a perimenopause explainer video asking "what supplement did you use for the night sweats?"' },
      { source: "reddit", score: [58, 86], text: '{handle} posted in r/Menopause asking for a magnesium brand recommendation "that actually works."' },
      { source: "reviews", score: [65, 92], text: '{handle} left a review titled "wish I found this 5 years ago" on a hormone-support supplement.' },
      { source: "instagram", score: [50, 78], text: '{handle} shared a midlife-wellness carousel post to their Story, tagging two friends.' },
      { source: "trends", score: [48, 76], text: 'Search interest for "best supplements for perimenopause" spiking in {handle}\'s region this month.' },
      { source: "creator", score: [60, 88], text: '{handle} (private Facebook group admin, 14K members) asked about sampling product for a group discussion thread.' },
    ],
  },
  {
    id: "fitness",
    name: "Fitness-First Supplement & Recovery Buyer",
    emoji: "\u{1F3CB}️",
    icp: {
      ageRange: "22–38",
      spendTier: "$25–$70 per month · subscribe-and-save habit",
      channels: ["Instagram", "YouTube", "Strava / fitness apps"],
      triggers: ["Gym or race-day results content", "Macro/ingredient dosage transparency", "Athlete or coach endorsements"],
      hooks: [
        "Third-party tested / NSF-certified badges",
        "Before/during/after performance stories",
        "Stack-building and routine content",
        "Discount codes tied to gym communities",
      ],
    },
    trending: [
      { tag: "#GutHealth", mentions: 29500, delta: 20 },
      { tag: "#Creatine", mentions: 21100, delta: 27 },
      { tag: "#Electrolytes", mentions: 13800, delta: 33 },
      { tag: "protein trend", mentions: 17600, delta: 8 },
    ],
    signalTemplates: [
      { source: "instagram", score: [62, 90], text: '{handle} posted a post-race recovery Reel tagging their electrolyte mix, comments asking "where do you get this."' },
      { source: "youtube", score: [58, 86], text: '{handle} uploaded a "my current supplement stack" video ranking a creatine brand as "non-negotiable."' },
      { source: "reddit", score: [55, 82], text: '{handle} asked r/xxfitness for a "clean" pre-workout recommendation under $40.' },
      { source: "reviews", score: [60, 88], text: '{handle} left a 5-star review citing NSF certification as the deciding factor in their purchase.' },
      { source: "creator", score: [65, 92], text: '{handle} (running coach, 6.8K followers) asked about a gifting code to share with their training group.' },
      { source: "trends", score: [46, 74], text: 'Search interest for "electrolytes vs sports drink" trending alongside a viral hydration post from {handle}.' },
    ],
  },
  {
    id: "postpartum",
    name: "Postpartum & New-Mom Self-Care Shopper",
    emoji: "\u{1F937}",
    icp: {
      ageRange: "26–38",
      spendTier: "$20–$60 per item · time-starved but loyal once trusted",
      channels: ["TikTok", "Instagram Reels", "Mom Facebook groups"],
      triggers: ["Safe-for-breastfeeding / pediatrician-approved labeling", "5-minute-or-less routine content", "Peer recs in mom groups"],
      hooks: [
        "\"What's in my postpartum basket\" content",
        "Sensory-safe, fragrance-light framing",
        "Mom-founder or mom-tested messaging",
        "Bundle/gift-set offers for baby showers",
      ],
    },
    trending: [
      { tag: "#PostpartumSkin", mentions: 12300, delta: 18 },
      { tag: "#MomTok", mentions: 42600, delta: 14 },
      { tag: "self-care basket", mentions: 5900, delta: 26 },
      { tag: "#NewMomMustHaves", mentions: 8100, delta: 21 },
    ],
    signalTemplates: [
      { source: "tiktok", score: [65, 92], text: '{handle} posted a "what\'s in my postpartum basket" video, viewers asking where to buy the belly balm.' },
      { source: "instagram", score: [55, 82], text: '{handle} saved a "5-minute mom skincare routine" Reel and DMed the creator asking for a product list.' },
      { source: "reddit", score: [52, 80], text: '{handle} posted in a mom-groups subreddit asking for fragrance-free, pediatrician-approved recs.' },
      { source: "reviews", score: [60, 88], text: '{handle} left a review saying a gift-set "was the only thing that made me feel human again."' },
      { source: "creator", score: [62, 90], text: '{handle} (mom-blog with 4.1K followers) asked about affiliate codes for a baby-shower gift guide.' },
      { source: "trends", score: [45, 72], text: 'Search interest for "postpartum self-care gift set" up 22% ahead of baby-shower season.' },
    ],
  },
  {
    id: "mensgrooming",
    name: "Men's Grooming New Adopter",
    emoji: "\u{1FA92}",
    icp: {
      ageRange: "24–40",
      spendTier: "$20–$50 per item · price-sensitive but curious",
      channels: ["YouTube", "Reddit", "TikTok"],
      triggers: ["Simple 3-step routine content", "\"No BS\" no-frills packaging and copy", "Peer or partner recommendation"],
      hooks: [
        "\"Skincare doesn't have to be complicated\" messaging",
        "Multi-use product framing (fewer steps)",
        "Locker-room-tested / no-nonsense reviews",
        "Subtle, unfussy branding",
      ],
    },
    trending: [
      { tag: "#MensGrooming", mentions: 16200, delta: 11 },
      { tag: "#SkincareForMen", mentions: 9800, delta: 19 },
      { tag: "starter routine", mentions: 4300, delta: 15 },
      { tag: "#GroomTok", mentions: 7600, delta: 24 },
    ],
    signalTemplates: [
      { source: "youtube", score: [55, 84], text: '{handle} commented "finally, a routine that takes 5 minutes" on a men\'s skincare starter-kit review.' },
      { source: "reddit", score: [52, 80], text: '{handle} posted on r/MensSkincare asking for "the bare minimum routine that actually works."' },
      { source: "tiktok", score: [58, 86], text: '{handle} duetted a "3-step routine for guys" video, captioned "ok fine I\'ll try it."' },
      { source: "reviews", score: [55, 82], text: '{handle} left a review saying the multi-use face + body wash "is the only thing I\'ll actually stick with."' },
      { source: "trends", score: [42, 70], text: 'Search interest for "simple skincare routine for men" trending in {handle}\'s metro area.' },
      { source: "creator", score: [50, 78], text: '{handle} (fitness creator, 3.4K followers) asked about product samples for a "guys try skincare" video series.' },
    ],
  },
  {
    id: "luxuryantiaging",
    name: "Luxury Anti-Aging & Longevity Loyalist",
    emoji: "\u{1F48E}",
    icp: {
      ageRange: "35–55",
      spendTier: "$80–$300 per item · high LTV and referral value",
      channels: ["Instagram", "YouTube", "Press / editorial"],
      triggers: ["Clinical trial or dermatologist backing", "Longevity / biohacking trend adjacency", "Editorial \"best of\" placements"],
      hooks: [
        "Clinical-result data visualizations",
        "Derm-in-the-room video explainers",
        "Longevity and \"skin span\" framing",
        "White-glove concierge or VIP loyalty perks",
      ],
    },
    trending: [
      { tag: "#Longevity", mentions: 20400, delta: 28 },
      { tag: "#DermTok", mentions: 27700, delta: 13 },
      { tag: "retinoid alternatives", mentions: 8900, delta: 9 },
      { tag: "#ProAgingNotAntiAging", mentions: 4200, delta: 35 },
    ],
    signalTemplates: [
      { source: "instagram", score: [65, 94], text: '{handle} saved a dermatologist\'s "clinical results" carousel and commented asking about the price point.' },
      { source: "youtube", score: [60, 90], text: '{handle} commented on a longevity-skincare explainer: "in my cart, ordering tonight."' },
      { source: "reviews", score: [70, 96], text: '{handle} left a review calling a serum "worth every penny after 6 weeks — visible difference."' },
      { source: "creator", score: [68, 95], text: '{handle} (12.5K followers, skincare editorial) requested a press sample ahead of a "best of the year" roundup.' },
      { source: "trends", score: [50, 80], text: 'Search interest for "[brand] vs prescription retinoid" trending after {handle} shared a comparison post.' },
      { source: "pinterest", score: [48, 76], text: '{handle} pinned a "longevity skincare shelf" board, saving three premium serum product shots.' },
    ],
  },
  {
    id: "ecosustainable",
    name: "Eco & Sustainable Self-Care Shopper",
    emoji: "\u{1F343}",
    icp: {
      ageRange: "25–45",
      spendTier: "$25–$70 per item · brand-loyal once trust is earned",
      channels: ["Instagram", "Pinterest", "TikTok"],
      triggers: ["Refillable / zero-waste packaging content", "Brand ethics and supply-chain transparency", "B-Corp or 1%-for-the-planet callouts"],
      hooks: [
        "Refill-program unboxing content",
        "\"What happens to the packaging\" explainers",
        "Local / sustainable sourcing stories",
        "Community clean-up or give-back tie-ins",
      ],
    },
    trending: [
      { tag: "#RefillableBeauty", mentions: 10600, delta: 25 },
      { tag: "#ZeroWasteBeauty", mentions: 14300, delta: 16 },
      { tag: "sustainable packaging", mentions: 7200, delta: 12 },
      { tag: "#SlowBeauty", mentions: 5100, delta: 30 },
    ],
    signalTemplates: [
      { source: "tiktok", score: [58, 86], text: '{handle} posted a "refill unboxing" video, captioned "this is how all beauty packaging should work."' },
      { source: "instagram", score: [55, 82], text: '{handle} commented asking whether a brand\'s packaging is curbside recyclable before purchasing.' },
      { source: "pinterest", score: [48, 76], text: '{handle} pinned a "zero-waste bathroom" board, saving refill-station product shots from three DTC brands.' },
      { source: "reddit", score: [50, 78], text: '{handle} started a thread on r/ZeroWaste asking for "a deodorant brand that\'s actually B-Corp, not just greenwashing."' },
      { source: "reviews", score: [58, 86], text: '{handle} left a review praising a brand\'s take-back program: "finally someone solved the packaging problem."' },
      { source: "creator", score: [55, 84], text: '{handle} (sustainability creator, 7.9K followers) asked about supply-chain sourcing before featuring a brand.' },
    ],
  },
];

const SOURCE_NAME = Object.fromEntries(SOURCES.map((s) => [s.id, s.name]));

/* ---------------------------------------------------------------
 * state
 * ------------------------------------------------------------- */

const STORAGE_KEY = "bloom.savedProspects.v1";

const state = {
  segmentId: SEGMENTS[0].id,
  view: "signals",
  signals: [], // { id, segmentId, handle, source, text, score, ts }
  activeFilters: new Set(SOURCES.map((s) => s.id)),
  saved: loadSaved(),
  liveTimer: null,
};

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSaved() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.saved));
}

function currentSegment() {
  return SEGMENTS.find((s) => s.id === state.segmentId);
}

let signalSeq = 0;
function generateSignal(segmentId, { isNew = false } = {}) {
  const segment = SEGMENTS.find((s) => s.id === segmentId);
  const tpl = segment.signalTemplates[Math.floor(Math.random() * segment.signalTemplates.length)];
  const handle = generateHandle();
  const [lo, hi] = tpl.score;
  const score = Math.round(lo + Math.random() * (hi - lo));
  const ageMinutes = isNew ? 0 : Math.floor(Math.random() * 60 * 30); // up to ~30h back
  signalSeq += 1;
  return {
    id: `sig-${Date.now()}-${signalSeq}`,
    segmentId,
    handle,
    source: tpl.source,
    text: tpl.text.replace(/\{handle\}/g, handle),
    score,
    ts: Date.now() - ageMinutes * 60000,
    isNew,
  };
}

function seedSignals() {
  state.signals = [];
  SEGMENTS.forEach((segment) => {
    const count = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      state.signals.push(generateSignal(segment.id));
    }
  });
}

function timeAgo(ts) {
  const diffMin = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

function tierFor(score) {
  if (score >= 80) return "hot";
  if (score >= 60) return "warm";
  return "cool";
}

/* ---------------------------------------------------------------
 * rendering
 * ------------------------------------------------------------- */

const els = {};

function q(id) {
  return document.getElementById(id);
}

function renderSidebarSegments() {
  els.segmentList.innerHTML = SEGMENTS.map((segment) => `
    <li>
      <button class="segment-btn ${segment.id === state.segmentId ? "is-active" : ""}" data-segment="${segment.id}">
        <span class="segment-emoji">${segment.emoji}</span> ${segment.name}
      </button>
    </li>
  `).join("");
}

function renderStats() {
  const segmentSignals = state.signals.filter((s) => s.segmentId === state.segmentId);
  const hotCount = aggregateLeads(state.segmentId).filter((l) => l.tier === "hot").length;
  els.statSignals.textContent = `${segmentSignals.length} SIGNALS`;
  els.statHot.textContent = `${hotCount} HOT PROSPECTS`;
  els.statSaved.textContent = `${state.saved.length} SAVED`;
  els.savedCount.textContent = state.saved.length ? `(${state.saved.length})` : "";
}

function renderICPCard() {
  const segment = currentSegment();
  const icp = segment.icp;
  els.icpCard.innerHTML = `
    <div class="icp-head">
      <h2 class="icp-title">${segment.emoji} ${segment.name} — Ideal Customer Profile</h2>
      <span class="icp-meta">${icp.ageRange} &middot; ${icp.spendTier}</span>
    </div>
    <div class="icp-grid">
      <div>
        <p class="icp-col-label">Where they live online</p>
        <div class="tag-row">${icp.channels.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
      <div>
        <p class="icp-col-label">What gets them to buy</p>
        <div class="tag-row">${icp.triggers.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
      <div>
        <p class="icp-col-label">Content hooks that convert</p>
        <ul class="icp-list">${icp.hooks.map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

function renderTrending() {
  const segment = currentSegment();
  els.trendingStrip.innerHTML = segment.trending.map((t) => {
    const up = t.delta >= 0;
    return `
      <div class="trend-pill">
        <span class="trend-tag">${t.tag}</span>
        <span class="trend-stats">
          ${t.mentions.toLocaleString()} mentions
          <span class="trend-delta ${up ? "up" : "down"}">${up ? "↑" : "↓"}${Math.abs(t.delta)}%</span>
        </span>
      </div>
    `;
  }).join("");
}

function renderSourceFilters() {
  els.sourceFilters.innerHTML = SOURCES.map((s) => `
    <button class="source-chip ${state.activeFilters.has(s.id) ? "is-active" : ""}" data-source="${s.id}">${s.name}</button>
  `).join("");
}

function isSaved(handle, segmentId) {
  return state.saved.some((l) => l.handle === handle && l.segmentId === segmentId);
}

function renderSignalFeed() {
  const list = state.signals
    .filter((s) => s.segmentId === state.segmentId && state.activeFilters.has(s.source))
    .sort((a, b) => b.ts - a.ts || b.score - a.score);

  if (!list.length) {
    els.signalFeed.innerHTML = `<div class="empty-state">No signals match the current filters. Try enabling more sources.</div>`;
    return;
  }

  els.signalFeed.innerHTML = list.map((s) => {
    const tier = tierFor(s.score);
    const saved = isSaved(s.handle, s.segmentId);
    return `
      <div class="signal-card ${s.isNew ? "is-new" : ""}" data-id="${s.id}">
        <div class="score-badge tier-${tier}">${s.score}</div>
        <div class="signal-body">
          <div class="signal-top">
            <span class="signal-handle">${s.handle}</span>
            <span class="source-tag">${SOURCE_NAME[s.source]}</span>
            <span>${timeAgo(s.ts)}</span>
          </div>
          <p class="signal-text">${s.text}</p>
          <div class="signal-actions">
            <button class="save-btn ${saved ? "is-saved" : ""}" data-save="${s.handle}|${s.segmentId}">
              ${saved ? "✓ Saved to CRM" : "+ Save to CRM"}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  list.forEach((s) => { s.isNew = false; });
}

function aggregateLeads(segmentId) {
  const byHandle = new Map();
  state.signals
    .filter((s) => s.segmentId === segmentId)
    .forEach((s) => {
      const entry = byHandle.get(s.handle) || { handle: s.handle, segmentId, total: 0, count: 0, latest: 0 };
      entry.total += s.score;
      entry.count += 1;
      entry.latest = Math.max(entry.latest, s.ts);
      byHandle.set(s.handle, entry);
    });
  const leads = Array.from(byHandle.values()).map((l) => ({
    ...l,
    avg: Math.round(l.total / l.count),
    tier: tierFor(Math.round(l.total / l.count)),
  }));
  leads.sort((a, b) => b.total - a.total);
  return leads;
}

function renderLeadsView() {
  const segment = currentSegment();
  els.leadsSegmentName.textContent = segment.name;
  const leads = aggregateLeads(state.segmentId);

  if (!leads.length) {
    els.leadList.innerHTML = `<div class="empty-state">No prospects yet — run a scan to generate signals.</div>`;
    return;
  }

  const maxTotal = leads[0].total;
  els.leadList.innerHTML = leads.map((l, i) => {
    const saved = isSaved(l.handle, l.segmentId);
    const width = Math.max(6, Math.round((l.total / maxTotal) * 100));
    return `
      <div class="lead-row">
        <div class="lead-rank">#${i + 1}</div>
        <div class="lead-main">
          <div class="lead-head">
            <span class="lead-name">${l.handle}</span>
            <span class="lead-segment">${segment.emoji} ${segment.name}</span>
          </div>
          <div class="lead-bar-track"><div class="lead-bar-fill" style="width:${width}%"></div></div>
          <span class="lead-meta">${l.count} signal${l.count === 1 ? "" : "s"} &middot; avg intent score ${l.avg} &middot; last seen ${timeAgo(l.latest)}</span>
        </div>
        <button class="save-btn ${saved ? "is-saved" : ""}" data-save="${l.handle}|${l.segmentId}">
          ${saved ? "✓ Saved" : "+ Save to CRM"}
        </button>
      </div>
    `;
  }).join("");
}

function renderSavedView() {
  if (!state.saved.length) {
    els.savedList.innerHTML = `<div class="empty-state">Nothing saved yet. Save a signal or hot prospect to pull it into your CRM list.</div>`;
    return;
  }
  const sorted = [...state.saved].sort((a, b) => b.savedAt - a.savedAt);
  els.savedList.innerHTML = sorted.map((l) => {
    const segment = SEGMENTS.find((s) => s.id === l.segmentId);
    return `
      <div class="lead-row">
        <div class="lead-main">
          <div class="lead-head">
            <span class="lead-name">${l.handle}</span>
            <span class="lead-segment">${segment.emoji} ${segment.name}</span>
          </div>
          <span class="lead-meta">Saved ${timeAgo(l.savedAt)}</span>
        </div>
        <button class="save-btn is-saved" data-save="${l.handle}|${l.segmentId}">Remove</button>
      </div>
    `;
  }).join("");
}

function renderAll() {
  renderSidebarSegments();
  renderStats();
  renderICPCard();
  renderTrending();
  renderSourceFilters();
  renderSignalFeed();
  renderLeadsView();
  renderSavedView();
}

/* ---------------------------------------------------------------
 * actions
 * ------------------------------------------------------------- */

function toggleSave(handle, segmentId) {
  const idx = state.saved.findIndex((l) => l.handle === handle && l.segmentId === segmentId);
  if (idx >= 0) {
    state.saved.splice(idx, 1);
  } else {
    state.saved.push({ handle, segmentId, savedAt: Date.now() });
  }
  persistSaved();
  renderStats();
  renderSignalFeed();
  renderLeadsView();
  renderSavedView();
}

function scanNow() {
  els.scanBtn.classList.add("is-scanning");
  setTimeout(() => els.scanBtn.classList.remove("is-scanning"), 600);

  const segment = currentSegment();
  const newCount = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < newCount; i++) {
    state.signals.unshift(generateSignal(segment.id, { isNew: true }));
  }
  renderStats();
  renderSignalFeed();
  renderLeadsView();
}

function setView(view) {
  state.view = view;
  ["signals", "leads", "saved"].forEach((v) => {
    q(`view-${v}`).classList.toggle("is-hidden", v !== view);
  });
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.view === view);
  });
}

function selectSegment(id) {
  state.segmentId = id;
  renderAll();
}

/* ---------------------------------------------------------------
 * init
 * ------------------------------------------------------------- */

function cacheEls() {
  [
    "segmentList", "statSignals", "statHot", "statSaved", "savedCount",
    "icpCard", "trendingStrip", "sourceFilters", "signalFeed",
    "leadsSegmentName", "leadList", "savedList", "scanBtn", "liveToggle", "liveDot",
  ].forEach((id) => { els[id] = q(id); });
}

function bindEvents() {
  els.segmentList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-segment]");
    if (btn) selectSegment(btn.dataset.segment);
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view));
  });

  els.scanBtn.addEventListener("click", scanNow);

  els.sourceFilters.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-source]");
    if (!btn) return;
    const id = btn.dataset.source;
    if (state.activeFilters.has(id)) {
      state.activeFilters.delete(id);
    } else {
      state.activeFilters.add(id);
    }
    renderSourceFilters();
    renderSignalFeed();
  });

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-save]");
    if (!btn) return;
    const [handle, segmentId] = btn.dataset.save.split("|");
    toggleSave(handle, segmentId);
  });

  els.liveToggle.addEventListener("change", () => {
    if (els.liveToggle.checked) {
      els.liveDot.style.animationDuration = "1s";
      state.liveTimer = setInterval(scanNow, 6000);
    } else {
      els.liveDot.style.animationDuration = "2.2s";
      clearInterval(state.liveTimer);
      state.liveTimer = null;
    }
  });
}

function init() {
  cacheEls();
  seedSignals();
  bindEvents();
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);

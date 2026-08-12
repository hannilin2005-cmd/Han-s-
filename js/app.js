/* ---------------------------------------------------------------
 * RADAR — mock ICP signal data
 *
 * Everything below is generated locally to model what a real web /
 * social scanning pipeline would surface. Swap SOURCES + templates
 * for real API calls (search, X/Reddit/LinkedIn, job boards, review
 * sites) to turn this into a live system.
 * ------------------------------------------------------------- */

const SOURCES = [
  { id: "linkedin", name: "LinkedIn" },
  { id: "twitter", name: "X / Twitter" },
  { id: "reddit", name: "Reddit" },
  { id: "news", name: "News" },
  { id: "jobs", name: "Job Postings" },
  { id: "reviews", name: "Review Sites" },
  { id: "trends", name: "Google Trends" },
];

const NAME_PREFIXES = [
  "Nimbus", "Vertex", "Northwind", "Anchor", "Cobalt", "Lumen", "Fathom",
  "Pioneer", "Silverline", "Meridian", "Crestline", "Ironclad", "Bluepeak",
  "Solace", "Alpine", "Harbor", "Catalyst", "Beacon", "Redwood", "Amberly",
  "Granite", "Wayfinder", "Highline", "Cascade", "Ember",
];

const NAME_CORES = [
  "Labs", "Systems", "Health", "Works", "Group", "Analytics", "Networks",
  "Partners", "Holdings", "Dynamics", "Solutions", "Ventures", "Collective",
];

function generateCompanyName() {
  const p = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
  const c = NAME_CORES[Math.floor(Math.random() * NAME_CORES.length)];
  return `${p} ${c}`;
}

const INDUSTRIES = [
  {
    id: "saas",
    name: "SaaS & Software",
    emoji: "\u{1F4BB}",
    icp: {
      companySize: "51–500 employees",
      revenue: "$5M–$75M ARR",
      techStack: ["Salesforce", "HubSpot", "Snowflake", "AWS", "Slack"],
      titles: ["VP of Sales", "Head of RevOps", "CRO"],
      painPoints: [
        "Manual lead qualification eating rep time",
        "CRM data going stale between quarters",
        "No visibility into buying intent before outbound",
      ],
    },
    trending: [
      { tag: "#RevOps", mentions: 12400, delta: 34 },
      { tag: "#GTMstack", mentions: 8100, delta: 21 },
      { tag: "CRM migration", mentions: 5600, delta: -6 },
      { tag: "#B2BSaaS", mentions: 15200, delta: 12 },
    ],
    signalTemplates: [
      { source: "linkedin", score: [70, 95], text: '{company} posted 4 open Revenue Operations roles this week.' },
      { source: "twitter", score: [75, 98], text: '"Our CRM is a mess right now, evaluating alternatives" — engineer at {company} in a public thread.' },
      { source: "news", score: [65, 90], text: '{company} announced a $28M Series B to accelerate go-to-market.' },
      { source: "reviews", score: [55, 80], text: 'New review left on a legacy CRM competitor, tagged {company}, citing "clunky reporting."' },
      { source: "jobs", score: [70, 92], text: '{company} is hiring a Head of RevOps — post mentions "modernizing our GTM stack."' },
      { source: "trends", score: [60, 85], text: 'Search interest for "{company} alternatives to Salesforce" up 40% this week.' },
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce & Retail",
    emoji: "\u{1F6D2}",
    icp: {
      companySize: "20–200 employees",
      revenue: "$2M–$40M annual GMV",
      techStack: ["Shopify Plus", "Klaviyo", "NetSuite", "Meta Ads"],
      titles: ["Head of Growth", "VP Marketing", "Director of Ecommerce"],
      painPoints: [
        "Rising CAC with flat conversion",
        "Fragmented customer data across channels",
        "Inventory and demand forecasting guesswork",
      ],
    },
    trending: [
      { tag: "#DTC", mentions: 22100, delta: 18 },
      { tag: "CAC blowup", mentions: 6700, delta: 45 },
      { tag: "#ShopifyPlus", mentions: 9800, delta: 9 },
      { tag: "first-party data", mentions: 4300, delta: 27 },
    ],
    signalTemplates: [
      { source: "twitter", score: [60, 88], text: '{company} teased a new product line launching next month.' },
      { source: "news", score: [55, 82], text: '{company} named to a "brands to watch" DTC roundup this week.' },
      { source: "jobs", score: [65, 90], text: '{company} is hiring 2 performance marketing roles, job post flags "CAC is climbing."' },
      { source: "reddit", score: [58, 85], text: 'Thread on r/ecommerce discusses {company} switching ad agencies after a rough quarter.' },
      { source: "reviews", score: [50, 78], text: '{company} left a 2-star review for their current email platform, citing deliverability issues.' },
      { source: "trends", score: [55, 84], text: 'Search interest for "{company}" spiking alongside a seasonal campaign push.' },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare & MedTech",
    emoji: "\u{1F3E5}",
    icp: {
      companySize: "100–1,000 employees",
      revenue: "$10M–$150M",
      techStack: ["Epic", "Salesforce Health Cloud", "AWS HealthLake"],
      titles: ["VP of Operations", "Chief Medical Officer", "Dir. Patient Experience"],
      painPoints: [
        "Manual patient intake workflows",
        "Compliance overhead slowing rollout",
        "Disconnected patient engagement tools",
      ],
    },
    trending: [
      { tag: "patient engagement", mentions: 7400, delta: 15 },
      { tag: "#HealthIT", mentions: 5100, delta: 8 },
      { tag: "value-based care", mentions: 6200, delta: 22 },
      { tag: "interoperability", mentions: 3900, delta: -3 },
    ],
    signalTemplates: [
      { source: "news", score: [65, 92], text: '{company} closed a funding round to expand patient engagement tooling.' },
      { source: "jobs", score: [60, 88], text: '{company} posted a Director of Digital Health role, requirements mention EHR migration.' },
      { source: "linkedin", score: [58, 85], text: '{company} announced expansion into a new state this quarter.' },
      { source: "reddit", score: [50, 78], text: 'r/healthIT thread discusses {company} issuing an RFP for a new patient engagement platform.' },
      { source: "reviews", score: [55, 80], text: 'Staff review on a job site cites {company}’s intake process as "still mostly paper."' },
      { source: "trends", score: [52, 80], text: 'Search interest in "{company} patient portal" trending up locally.' },
    ],
  },
  {
    id: "fintech",
    name: "FinTech",
    emoji: "\u{1F4B3}",
    icp: {
      companySize: "50–400 employees",
      revenue: "$8M–$100M",
      techStack: ["Plaid", "Stripe", "Snowflake", "Segment"],
      titles: ["Head of Risk", "VP Compliance", "Director of Growth"],
      painPoints: [
        "Fraud detection false-positive rates",
        "Slow KYC / onboarding conversion",
        "Manual compliance reporting",
      ],
    },
    trending: [
      { tag: "#RegTech", mentions: 5800, delta: 19 },
      { tag: "KYC friction", mentions: 4100, delta: 31 },
      { tag: "embedded finance", mentions: 9200, delta: 14 },
      { tag: "fraud detection", mentions: 6600, delta: 6 },
    ],
    signalTemplates: [
      { source: "news", score: [65, 92], text: '{company} announced expansion into a new state license this quarter.' },
      { source: "jobs", score: [62, 90], text: '{company} is hiring a Head of Compliance — post cites "new regulatory requirements."' },
      { source: "twitter", score: [58, 86], text: '"{company}\'s onboarding drop-off is brutal" — user complaint thread gaining traction.' },
      { source: "linkedin", score: [55, 84], text: '{company} raised a growth round to expand into embedded finance.' },
      { source: "reviews", score: [50, 78], text: 'G2-style review flags {company}’s fraud tooling for high false-positive rates.' },
      { source: "trends", score: [52, 80], text: 'Search interest for "{company} vs" comparisons up sharply this week.' },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    emoji: "\u{1F3ED}",
    icp: {
      companySize: "200–2,000 employees",
      revenue: "$20M–$300M",
      techStack: ["SAP", "Oracle NetSuite", "PTC", "Siemens"],
      titles: ["VP of Operations", "Plant Director", "Head of Supply Chain"],
      painPoints: [
        "Supply chain visibility gaps",
        "Downtime from unplanned maintenance",
        "Legacy ERP slowing reporting",
      ],
    },
    trending: [
      { tag: "predictive maintenance", mentions: 3900, delta: 24 },
      { tag: "#SupplyChain", mentions: 11200, delta: 11 },
      { tag: "ERP migration", mentions: 2700, delta: 17 },
      { tag: "reshoring", mentions: 4500, delta: 29 },
    ],
    signalTemplates: [
      { source: "news", score: [65, 90], text: '{company} announced a facility expansion in the Midwest.' },
      { source: "jobs", score: [60, 88], text: '{company} is hiring for a "Digital Transformation Lead" — post references ERP modernization.' },
      { source: "reddit", score: [50, 78], text: 'r/manufacturing thread mentions {company} dealing with recurring supply chain disruptions.' },
      { source: "linkedin", score: [55, 84], text: '{company} shared a post about unplanned downtime costing "real money" last quarter.' },
      { source: "reviews", score: [48, 75], text: 'Employee review mentions {company}’s reporting is "still built on spreadsheets."' },
      { source: "trends", score: [50, 78], text: 'Search interest for "{company} supply chain" trending amid industry disruption news.' },
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    emoji: "\u{1F6E1}️",
    icp: {
      companySize: "100–1,000 employees",
      revenue: "$15M–$200M",
      techStack: ["CrowdStrike", "Okta", "Splunk", "AWS"],
      titles: ["CISO", "VP Security Engineering", "Head of IT"],
      painPoints: [
        "Alert fatigue from fragmented tooling",
        "Slow incident response times",
        "Compliance audit prep overhead",
      ],
    },
    trending: [
      { tag: "#SOC2", mentions: 6300, delta: 20 },
      { tag: "alert fatigue", mentions: 3400, delta: 33 },
      { tag: "zero trust", mentions: 8700, delta: 9 },
      { tag: "breach disclosure", mentions: 5100, delta: 41 },
    ],
    signalTemplates: [
      { source: "news", score: [70, 95], text: '{company} disclosed a security incident affecting a nearby vendor in their supply chain.' },
      { source: "jobs", score: [62, 90], text: '{company} is hiring 3 security engineers ahead of an upcoming SOC 2 audit.' },
      { source: "twitter", score: [58, 86], text: 'Security researcher flags exposed {company} endpoints in a public thread.' },
      { source: "linkedin", score: [55, 84], text: '{company}’s IT lead posted about consolidating "too many point solutions."' },
      { source: "reviews", score: [50, 78], text: 'Review on a security forum cites {company}’s SIEM as generating "way too much noise."' },
      { source: "trends", score: [52, 80], text: 'Search interest for "{company} data breach" spiking this week.' },
    ],
  },
  {
    id: "proserv",
    name: "Professional Services",
    emoji: "\u{1F4BC}",
    icp: {
      companySize: "30–300 employees",
      revenue: "$5M–$60M",
      techStack: ["Salesforce", "Asana", "QuickBooks", "DocuSign"],
      titles: ["Managing Partner", "COO", "Head of Business Development"],
      painPoints: [
        "Utilization tracking across projects",
        "Manual proposal and contract cycles",
        "Referral pipeline hard to forecast",
      ],
    },
    trending: [
      { tag: "utilization rates", mentions: 2100, delta: 14 },
      { tag: "#ProfessionalServices", mentions: 3300, delta: 8 },
      { tag: "M&A activity", mentions: 4800, delta: 22 },
      { tag: "proposal automation", mentions: 1900, delta: 26 },
    ],
    signalTemplates: [
      { source: "news", score: [60, 88], text: '{company} announced a merger to expand its practice areas.' },
      { source: "jobs", score: [58, 85], text: '{company} is hiring a Head of Business Development to scale referral pipeline.' },
      { source: "linkedin", score: [55, 82], text: '{company}’s managing partner published a post on "scaling ops without losing quality."' },
      { source: "reddit", score: [45, 72], text: 'r/consulting thread mentions {company} opening a new regional office.' },
      { source: "reviews", score: [45, 72], text: 'Employee review says {company} still tracks utilization "in spreadsheets."' },
      { source: "trends", score: [48, 76], text: 'Search interest for "{company}" up alongside new office announcement.' },
    ],
  },
  {
    id: "realestate",
    name: "Real Estate & PropTech",
    emoji: "\u{1F3E2}",
    icp: {
      companySize: "20–250 employees",
      revenue: "$3M–$50M",
      techStack: ["Salesforce", "Yardi", "DocuSign", "Zillow API"],
      titles: ["VP of Sales", "Head of Broker Ops", "Director of Marketing"],
      painPoints: [
        "Lead response time too slow",
        "Fragmented listing and CRM data",
        "Manual commission tracking",
      ],
    },
    trending: [
      { tag: "#PropTech", mentions: 4700, delta: 16 },
      { tag: "lead response time", mentions: 2600, delta: 28 },
      { tag: "new metro expansion", mentions: 3100, delta: 19 },
      { tag: "commission tracking", mentions: 1500, delta: 11 },
    ],
    signalTemplates: [
      { source: "news", score: [60, 88], text: '{company} announced expansion into a new metro market.' },
      { source: "jobs", score: [58, 85], text: '{company} is hiring listing agents at scale ahead of a market push.' },
      { source: "twitter", score: [52, 80], text: '"Leads sit for hours before anyone follows up" — complaint about {company} gaining replies.' },
      { source: "linkedin", score: [55, 82], text: '{company} launched a new brokerage division this quarter.' },
      { source: "reviews", score: [45, 72], text: 'Agent review mentions {company}’s commission tracking is "still done by hand."' },
      { source: "trends", score: [48, 76], text: 'Search interest for "{company} listings" trending in a local market report.' },
    ],
  },
];

const SOURCE_NAME = Object.fromEntries(SOURCES.map((s) => [s.id, s.name]));

/* ---------------------------------------------------------------
 * state
 * ------------------------------------------------------------- */

const STORAGE_KEY = "radar.savedLeads.v1";

const state = {
  industryId: INDUSTRIES[0].id,
  view: "signals",
  signals: [], // { id, industryId, company, source, text, score, ts }
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

function currentIndustry() {
  return INDUSTRIES.find((i) => i.id === state.industryId);
}

let signalSeq = 0;
function generateSignal(industryId, { isNew = false } = {}) {
  const industry = INDUSTRIES.find((i) => i.id === industryId);
  const tpl = industry.signalTemplates[Math.floor(Math.random() * industry.signalTemplates.length)];
  const company = generateCompanyName();
  const [lo, hi] = tpl.score;
  const score = Math.round(lo + Math.random() * (hi - lo));
  const ageMinutes = isNew ? 0 : Math.floor(Math.random() * 60 * 30); // up to ~30h back
  signalSeq += 1;
  return {
    id: `sig-${Date.now()}-${signalSeq}`,
    industryId,
    company,
    source: tpl.source,
    text: tpl.text.replace(/\{company\}/g, company),
    score,
    ts: Date.now() - ageMinutes * 60000,
    isNew,
  };
}

function seedSignals() {
  state.signals = [];
  INDUSTRIES.forEach((industry) => {
    const count = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      state.signals.push(generateSignal(industry.id));
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

function renderSidebarIndustries() {
  els.industryList.innerHTML = INDUSTRIES.map((industry) => `
    <li>
      <button class="industry-btn ${industry.id === state.industryId ? "is-active" : ""}" data-industry="${industry.id}">
        <span class="industry-emoji">${industry.emoji}</span> ${industry.name}
      </button>
    </li>
  `).join("");
}

function renderStats() {
  const industrySignals = state.signals.filter((s) => s.industryId === state.industryId);
  const hotCount = aggregateLeads(state.industryId).filter((l) => l.tier === "hot").length;
  els.statSignals.textContent = `${industrySignals.length} SIGNALS`;
  els.statHot.textContent = `${hotCount} HOT LEADS`;
  els.statSaved.textContent = `${state.saved.length} SAVED`;
  els.savedCount.textContent = state.saved.length ? `(${state.saved.length})` : "";
}

function renderICPCard() {
  const industry = currentIndustry();
  const icp = industry.icp;
  els.icpCard.innerHTML = `
    <div class="icp-head">
      <h2 class="icp-title">${industry.emoji} ${industry.name} — Ideal Customer Profile</h2>
      <span class="icp-meta">${icp.companySize} &middot; ${icp.revenue}</span>
    </div>
    <div class="icp-grid">
      <div>
        <p class="icp-col-label">Tech stack signals</p>
        <div class="tag-row">${icp.techStack.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
      <div>
        <p class="icp-col-label">Decision makers</p>
        <div class="tag-row">${icp.titles.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
      <div>
        <p class="icp-col-label">Pain points to lead with</p>
        <ul class="icp-list">${icp.painPoints.map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

function renderTrending() {
  const industry = currentIndustry();
  els.trendingStrip.innerHTML = industry.trending.map((t) => {
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

function isSaved(company, industryId) {
  return state.saved.some((l) => l.company === company && l.industryId === industryId);
}

function renderSignalFeed() {
  const list = state.signals
    .filter((s) => s.industryId === state.industryId && state.activeFilters.has(s.source))
    .sort((a, b) => b.ts - a.ts || b.score - a.score);

  if (!list.length) {
    els.signalFeed.innerHTML = `<div class="empty-state">No signals match the current filters. Try enabling more sources.</div>`;
    return;
  }

  els.signalFeed.innerHTML = list.map((s) => {
    const tier = tierFor(s.score);
    const saved = isSaved(s.company, s.industryId);
    return `
      <div class="signal-card ${s.isNew ? "is-new" : ""}" data-id="${s.id}">
        <div class="score-badge tier-${tier}">${s.score}</div>
        <div class="signal-body">
          <div class="signal-top">
            <span class="signal-company">${s.company}</span>
            <span class="source-tag">${SOURCE_NAME[s.source]}</span>
            <span>${timeAgo(s.ts)}</span>
          </div>
          <p class="signal-text">${s.text}</p>
          <div class="signal-actions">
            <button class="save-btn ${saved ? "is-saved" : ""}" data-save="${s.company}|${s.industryId}">
              ${saved ? "✓ Saved to CRM" : "+ Save to CRM"}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  list.forEach((s) => { s.isNew = false; });
}

function aggregateLeads(industryId) {
  const byCompany = new Map();
  state.signals
    .filter((s) => s.industryId === industryId)
    .forEach((s) => {
      const entry = byCompany.get(s.company) || { company: s.company, industryId, total: 0, count: 0, latest: 0 };
      entry.total += s.score;
      entry.count += 1;
      entry.latest = Math.max(entry.latest, s.ts);
      byCompany.set(s.company, entry);
    });
  const leads = Array.from(byCompany.values()).map((l) => ({
    ...l,
    avg: Math.round(l.total / l.count),
    tier: tierFor(Math.round(l.total / l.count)),
  }));
  leads.sort((a, b) => b.total - a.total);
  return leads;
}

function renderLeadsView() {
  const industry = currentIndustry();
  els.leadsIndustryName.textContent = industry.name;
  const leads = aggregateLeads(state.industryId);

  if (!leads.length) {
    els.leadList.innerHTML = `<div class="empty-state">No leads yet — run a scan to generate signals.</div>`;
    return;
  }

  const maxTotal = leads[0].total;
  els.leadList.innerHTML = leads.map((l, i) => {
    const saved = isSaved(l.company, l.industryId);
    const width = Math.max(6, Math.round((l.total / maxTotal) * 100));
    return `
      <div class="lead-row">
        <div class="lead-rank">#${i + 1}</div>
        <div class="lead-main">
          <div class="lead-head">
            <span class="lead-name">${l.company}</span>
            <span class="lead-industry">${industry.emoji} ${industry.name}</span>
          </div>
          <div class="lead-bar-track"><div class="lead-bar-fill" style="width:${width}%"></div></div>
          <span class="lead-meta">${l.count} signal${l.count === 1 ? "" : "s"} &middot; avg intent score ${l.avg} &middot; last seen ${timeAgo(l.latest)}</span>
        </div>
        <button class="save-btn ${saved ? "is-saved" : ""}" data-save="${l.company}|${l.industryId}">
          ${saved ? "✓ Saved" : "+ Save to CRM"}
        </button>
      </div>
    `;
  }).join("");
}

function renderSavedView() {
  if (!state.saved.length) {
    els.savedList.innerHTML = `<div class="empty-state">Nothing saved yet. Save a signal or hot lead to pull it into your CRM list.</div>`;
    return;
  }
  const sorted = [...state.saved].sort((a, b) => b.savedAt - a.savedAt);
  els.savedList.innerHTML = sorted.map((l) => {
    const industry = INDUSTRIES.find((i) => i.id === l.industryId);
    return `
      <div class="lead-row">
        <div class="lead-main">
          <div class="lead-head">
            <span class="lead-name">${l.company}</span>
            <span class="lead-industry">${industry.emoji} ${industry.name}</span>
          </div>
          <span class="lead-meta">Saved ${timeAgo(l.savedAt)}</span>
        </div>
        <button class="save-btn is-saved" data-save="${l.company}|${l.industryId}">Remove</button>
      </div>
    `;
  }).join("");
}

function renderAll() {
  renderSidebarIndustries();
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

function toggleSave(company, industryId) {
  const idx = state.saved.findIndex((l) => l.company === company && l.industryId === industryId);
  if (idx >= 0) {
    state.saved.splice(idx, 1);
  } else {
    state.saved.push({ company, industryId, savedAt: Date.now() });
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

  const industry = currentIndustry();
  const newCount = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < newCount; i++) {
    state.signals.unshift(generateSignal(industry.id, { isNew: true }));
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

function selectIndustry(id) {
  state.industryId = id;
  renderAll();
}

/* ---------------------------------------------------------------
 * init
 * ------------------------------------------------------------- */

function cacheEls() {
  [
    "industryList", "statSignals", "statHot", "statSaved", "savedCount",
    "icpCard", "trendingStrip", "sourceFilters", "signalFeed",
    "leadsIndustryName", "leadList", "savedList", "scanBtn", "liveToggle", "liveDot",
  ].forEach((id) => { els[id] = q(id); });
}

function bindEvents() {
  els.industryList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-industry]");
    if (btn) selectIndustry(btn.dataset.industry);
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
    const [company, industryId] = btn.dataset.save.split("|");
    toggleSave(company, industryId);
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

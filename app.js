const KEY = "cadexus-os-v2";
const THEME_KEY = "cadexus-os-v2-theme";
const VIEW_KEY = "cadexus-os-v2-pipeline-view";
const SAMPLES_KEY = "cadexus-os-v2-samples-dismissed";

const STAGES = [
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "demo", label: "Demo" },
  { id: "proposal", label: "Proposal" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" }
];
const STATUSES = [
  { id: "onboarding", label: "Onboarding" },
  { id: "active", label: "Active" },
  { id: "risk", label: "At risk" }
];
const STAGE_IDS = new Set(STAGES.map(stage => stage.id));
const STATUS_IDS = new Set(STATUSES.map(status => status.id));
const FUNNEL_ORDER = { new: 0, qualified: 1, demo: 2, proposal: 3, won: 4 };
const TITLES = { dashboard: "Dashboard", pipeline: "Pipeline", customers: "Customers", notes: "Decisions", plan: "90 Day Plan" };
const PLAN_PHASES = [
  { id: 1, name: "Foundation", range: "Days 1 to 30", start: 1, end: 30 },
  { id: 2, name: "Prove and repeat", range: "Days 31 to 60", start: 31, end: 60 },
  { id: 3, name: "Expand", range: "Days 61 to 90", start: 61, end: 90 }
];
const PLAN_STATUSES = [
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "done", label: "Done" }
];
const PLAN_ITEMS = [
  { id: "help", phase: 1, weeks: [1, 1], what: "Agree how I help, the definition of first value and the blank targets in this plan (week 1).", why: "Agreeing where I help means I can take sales and follow-ups off your plate without pulling you into every deal, and you can run delivery without me second guessing it. One shared definition of first value means the Command Centre means the same thing to both of us.", doneWhen: "A one page agreement you are happy with. First value defined in one sentence. Every Target: ___ in this plan filled in." },
  { id: "playbook", phase: 1, weeks: [1, 2], what: "Write the onboarding playbook from trial start to first value (weeks 1 to 2).", why: "Cadexus promises early access members guided onboarding to migrate their pricing and job data. The trial converts at day 14, so customers need to see value inside that window. A written playbook makes the promise repeatable and lets me tell every prospect exactly what their first two weeks look like.", doneWhen: "A checklist covering pricing library import, templates, first quote and first job. Each step has a person responsible and a day number." },
  { id: "log-customers", phase: 1, weeks: [2, 2], what: "Log every current customer in the Command Centre (week 2).", why: "I can see account health without asking you for updates, and at-risk accounts show up before they cancel.", doneWhen: "Every current account has a record with status, Cadexus org ID, first value and risks. Sample records cleared." },
  { id: "handover", phase: 1, weeks: [3, 3], what: "Set the handover from sale to onboarding (week 3).", why: "The gap between yes and getting started is where trust is easiest to lose. A clear handover means every new customer reaches you with the context you need and nothing falls through.", doneWhen: "Handover rule written in the Decisions log: when a lead moves to Won you start onboarding within ___ days. Used on the next won deal." },
  { id: "blockers", phase: 1, weeks: [3, 4], what: "Rank and fix the top three blockers (weeks 3 to 4).", why: "Customers who stall or leave cost more than any lead I can bring in. Each blocker removed also makes the next demo easier.", doneWhen: "Top three risks logged with a person responsible and a date. Each one fixed or scheduled." },
  { id: "first-value", phase: 2, weeks: [5, 5], what: "Get every onboarding customer to first value.", why: "First value is the moment a customer decides Cadexus is worth paying for. Until then every customer is a risk, however good the demo was.", doneWhen: "Every Onboarding record shows first value as yes, or a named risk with a next step." },
  { id: "outcomes", phase: 2, weeks: [6, 6], what: "Capture the first verified outcomes, with permission.", why: "Proof sells. I won't invent numbers, so the only results I can use in sales are ones a customer has confirmed and agreed to share.", doneWhen: "Target: ___ verified outcomes logged, each with the customer's written OK." },
  { id: "checkin", phase: 2, weeks: [6, 6], what: "Run a 30 day check-in with each customer.", why: "It catches problems while they are still easy to fix and tells us which customers are ready to talk about results.", doneWhen: "A check-in held for every customer past day 30, with risks and outcomes updated in the Command Centre." },
  { id: "playbook-2", phase: 2, weeks: [7, 7], what: "Update the playbook to version 2.", why: "The first customers show where onboarding really slows down. Fixing that now shortens time to first value for everyone after them.", doneWhen: "Playbook updated. Time to first value measured for each new customer." },
  { id: "feedback", phase: 2, weeks: null, what: "Turn customer feedback into roadmap decisions.", why: "Early access members were promised a say in the roadmap. Showing them their feedback was heard keeps them loyal, and lets me talk about the roadmap honestly in demos.", doneWhen: "Each product decision recorded in the Decisions log with the customer feedback behind it." },
  { id: "proof", phase: 2, weeks: [8, 8], what: "Give me one proof point per trade segment.", why: "Builders, electricians, plumbers, carpenters and roofers each want to hear from someone like them. You hold that knowledge and I can use it without you sitting in every demo.", doneWhen: "A short list of real, permitted proof points by segment." },
  { id: "case-studies", phase: 3, weeks: [9, 9], what: "Write two or three case studies from verified outcomes.", why: "A case study does the selling while neither of us is in the room. It also supports holding the price instead of discounting.", doneWhen: "Two or three case studies, each approved by the customer before use." },
  { id: "referrals", phase: 3, weeks: [10, 10], what: "Ask happy customers for referrals at the right moment.", why: "Trades talk to trades. A referral after a verified result is the cheapest and warmest lead Cadexus can get.", doneWhen: "Every customer with a verified outcome has been asked. Referrals are logged as leads with source Referral and I follow them up for you." },
  { id: "grow", phase: 3, weeks: [10, 10], what: "Grow within existing accounts when the customer needs it.", why: "Moving from Gold to Platinum, adding seats or adding rostering grows revenue without new sales effort. It only works when it follows real value, so it sits with you.", doneWhen: "A list of accounts where an upgrade genuinely fits, the conversation held and the result logged." },
  { id: "scale", phase: 3, weeks: [11, 11], what: "Make onboarding scale.", why: "If every new customer needs the same hours from you, growth stops at your calendar. Trade templates and a tight playbook let you onboard more customers at once.", doneWhen: "Templates for each trade Cadexus serves. Onboarding capacity agreed. Target: ___ new customers per month." },
  { id: "review", phase: 3, weeks: [12, 12], what: "Hold the day 90 review.", why: "We judge the plan on what the Command Centre shows, not on feel, and you set the next 90 days from there.", doneWhen: "Review held, measures compared with targets and the next 90 day plan agreed." }
];
const PLAN_WEEKS = [
  { week: 1, text: "How I help, first value and targets agreed. First weekly sync held." },
  { week: 2, text: "Onboarding playbook drafted. Every customer logged in the Command Centre." },
  { week: 3, text: "Handover rule set and recorded. Top risks ranked." },
  { week: 4, text: "Top three blockers fixed or scheduled. Day 30 check on how the split is working." },
  { week: 5, text: "Every onboarding customer has a path to first value." },
  { week: 6, text: "30 day check-ins under way. First verified outcome requested." },
  { week: 7, text: "Playbook version 2. Time to first value measured." },
  { week: 8, text: "Proof points by segment handed to me. Day 60 review." },
  { week: 9, text: "First case study drafted and sent for customer approval." },
  { week: 10, text: "Referral asks made. Upgrade fit list built." },
  { week: 11, text: "Trade templates done. Onboarding capacity agreed." },
  { week: 12, text: "Day 90 review. Next 90 day plan set." }
];
const MEASURES = [
  { id: "ttfv", name: "Time to first value", detail: "Days from onboarding start to the agreed first value event." },
  { id: "trial", name: "First value in trial", detail: "Share of new customers who reach first value inside the 14 day trial." },
  { id: "handover", name: "Handover time", detail: "Days from a lead moving to Won to onboarding starting." },
  { id: "risk", name: "At-risk accounts", detail: "Accounts marked At risk, and how long each has been there." },
  { id: "outcomes", name: "Verified outcomes", detail: "Outcomes confirmed by the customer with permission to share." },
  { id: "referrals", name: "Referrals", detail: "New leads with source Referral." },
  { id: "expansion", name: "Expansion", detail: "Accounts that upgraded plan, added seats or added rostering." },
  { id: "hours", name: "Partner's hours on sales", detail: "Hours a week he spends on demos, follow-ups and lead admin; manual entry." }
];

let stageFilter = "all";
let customerFilter = "all";
let pipelineView = "table";
let pendingFocus = null;
let lastFocus = null;
let toastTimer = 0;

function uid() {
  if (window.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function persist(silent) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    if (!silent) toast("Could not save in this browser.");
    return false;
  }
}
function save() {
  persist(false);
  render();
}
function stampRecord(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return;
  if (!record.id) record.id = uid();
  if (!record.createdAt && record.ts) record.createdAt = record.ts;
}
function migrate(parsed) {
  if (!Array.isArray(parsed.leads)) parsed.leads = [];
  if (!Array.isArray(parsed.customers)) parsed.customers = [];
  if (!Array.isArray(parsed.notes)) parsed.notes = [];
  if (!Array.isArray(parsed.activity)) parsed.activity = [];
  parsed.leads.forEach(stampRecord);
  parsed.customers.forEach(stampRecord);
  parsed.notes.forEach(note => {
    if (!note || typeof note !== "object" || Array.isArray(note)) return;
    if (!note.id) note.id = uid();
  });
  if (!parsed.plan || typeof parsed.plan !== "object" || Array.isArray(parsed.plan)) {
    parsed.plan = { startDate: "", items: {}, targets: {}, hours: "" };
  } else {
    if (typeof parsed.plan.startDate !== "string" || !parseISODate(parsed.plan.startDate)) parsed.plan.startDate = "";
    if (!parsed.plan.items || typeof parsed.plan.items !== "object" || Array.isArray(parsed.plan.items)) parsed.plan.items = {};
    if (!parsed.plan.targets || typeof parsed.plan.targets !== "object" || Array.isArray(parsed.plan.targets)) parsed.plan.targets = {};
    if (typeof parsed.plan.hours !== "string") parsed.plan.hours = parsed.plan.hours == null ? "" : String(parsed.plan.hours);
  }
  return parsed;
}
function loadData() {
  let parsed = null;
  try { parsed = JSON.parse(localStorage.getItem(KEY) || ""); } catch (e) { parsed = null; }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) parsed = { leads: [], customers: [], notes: [] };
  return migrate(parsed);
}

function parseISODate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}
function toISODate(date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}
function todayISO() { return toISODate(new Date()); }
function calendarDaysBetween(start, end) {
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((utcEnd - utcStart) / 86400000);
}
function formatDayCount(value) {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded);
  return text + (Math.abs(rounded) === 1 ? " day" : " days");
}
function formatDate(iso) {
  const date = parseISODate(iso);
  if (!date) return "";
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}
function formatWhen(ts) {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-AU", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}
function tsToISO(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return "";
  return toISODate(date);
}
function localDateToTs(iso) {
  const date = parseISODate(iso);
  return date ? date.getTime() : null;
}
function endOfWeekISO(date) {
  const day = date.getDay();
  const mondayOffset = day === 0 ? 6 : day - 1;
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayOffset);
  return toISODate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6));
}
function rangeThisWeek() {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? 6 : day - 1;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
  return [start.getTime(), end.getTime()];
}
function rangeThisMonth() {
  const now = new Date();
  return [new Date(now.getFullYear(), now.getMonth(), 1).getTime(), new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime()];
}
function numericValue(value) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
function formatMoney(value) {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: Number.isInteger(value) ? 0 : 2 }).format(value);
}
function snippet(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  return clean.length > 90 ? clean.slice(0, 89) + "…" : clean;
}
function listAnd(items) {
  if (!items.length) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return items[0] + " and " + items[1];
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}
function plural(count, word) { return count + " " + word + (count === 1 ? "" : "s"); }
function normName(value) { return String(value || "").trim().toLowerCase(); }
function isMobile() { return window.matchMedia("(max-width: 800px)").matches; }
function stageLabel(id) {
  const found = STAGES.find(stage => stage.id === id);
  return found ? found.label : (id || "Unknown");
}
function statusLabel(id) {
  const found = STATUSES.find(status => status.id === id);
  return found ? found.label : (id || "Unknown");
}
function knownClass(id, allowed) { return allowed.has(id) ? id : "unknown"; }
function badge(className, label) { return `<span class="status ${esc(className)}">${esc(label)}</span>`; }
function sampleBadge(on) { return on ? '<span class="badge sample">Sample</span>' : ""; }
function isSampleLead(lead) {
  if (!lead || typeof lead !== "object") return false;
  if (lead.sample === true) return true;
  if (lead.name === "Northside Builders" && lead.source === "Referral" && lead.segment === "10–50 staff builder") return true;
  if (lead.name === "Harbour Trades" && lead.source === "Cadexus site" && lead.segment === "Trade contractor") return true;
  return false;
}
function isSampleCustomer(customer) {
  if (!customer || typeof customer !== "object") return false;
  if (customer.sample === true) return true;
  return customer.name === "Summit Construction" && customer.orgId === "org_abc123" && customer.status === "onboarding";
}
function hasSamples() { return data.leads.some(isSampleLead) || data.customers.some(isSampleCustomer); }
function firstValueLabel(value) { return value === "yes" ? "Reached" : "Not yet"; }
function yesNo(value) { return value === "yes" ? "Yes" : "No"; }
function outcomeHtml(value) {
  const text = String(value || "").trim();
  return text ? esc(text) : '<span class="quiet">Not recorded</span>';
}
function risksHtml(value) {
  const text = String(value || "").trim();
  return text ? esc(text) : '<span class="quiet">—</span>';
}
function expansionLabel(value) {
  if (value === "plan") return "Upgraded plan";
  if (value === "seats") return "Added seats";
  if (value === "rostering") return "Added rostering";
  return "—";
}
function dash(value) {
  const text = String(value || "").trim();
  return text ? esc(text) : "—";
}
function logActivity(entry) {
  if (!Array.isArray(data.activity)) data.activity = [];
  data.activity.push(Object.assign({ id: uid(), ts: Date.now() }, entry));
}
function leadEvents(lead) {
  return data.activity.filter(event => event.entity === "lead" && event.recordId === lead.id);
}
function itemState(id) {
  const saved = (data.plan.items && data.plan.items[id]) || {};
  return {
    status: ["not-started", "in-progress", "done"].includes(saved.status) ? saved.status : "not-started",
    assignee: saved.assignee === "partner" || saved.assignee === "founder" ? saved.assignee : "",
    notes: typeof saved.notes === "string" ? saved.notes : ""
  };
}
function setItemState(id, patch) {
  const current = itemState(id);
  data.plan.items[id] = {
    status: patch.status != null ? patch.status : current.status,
    assignee: patch.assignee != null ? patch.assignee : current.assignee,
    notes: patch.notes != null ? patch.notes : current.notes
  };
}
function planStartDate() { return parseISODate(data.plan.startDate); }
function planDayNumber() {
  const start = planStartDate();
  if (!start) return null;
  return calendarDaysBetween(start, new Date()) + 1;
}
function planWeekNumber() {
  const day = planDayNumber();
  if (day == null || day < 1 || day > 90) return null;
  const phaseIndex = Math.floor((day - 1) / 30);
  const dayInPhase = (day - 1) % 30;
  let weekInPhase = 3;
  if (dayInPhase < 7) weekInPhase = 0;
  else if (dayInPhase < 15) weekInPhase = 1;
  else if (dayInPhase < 22) weekInPhase = 2;
  return phaseIndex * 4 + weekInPhase + 1;
}
function currentPhaseId() {
  const day = planDayNumber();
  if (day == null || day < 1 || day > 90) return null;
  const phase = PLAN_PHASES.find(item => day >= item.start && day <= item.end);
  return phase ? phase.id : null;
}
function phaseTitle(phase) { return "Phase " + phase.id + ", " + phase.range + ", " + phase.name; }
function planHeadline() {
  const start = planStartDate();
  if (!start) return "Set start date";
  const until = calendarDaysBetween(new Date(), start);
  if (until > 0) return "Starts in " + formatDayCount(until);
  const day = planDayNumber();
  if (day > 90) return "Day " + day + ". The 90 days are complete.";
  const phase = PLAN_PHASES.find(item => item.id === currentPhaseId());
  return "Day " + day + " of 90. Week " + planWeekNumber() + " of 12. " + (phase ? phaseTitle(phase) : "");
}
function itemInWeek(item, week) {
  return !!(item.weeks && week && week >= item.weeks[0] && week <= item.weeks[1]);
}
function targetValue(id) {
  const value = data.plan.targets ? data.plan.targets[id] : "";
  return typeof value === "string" ? value : (value == null ? "" : String(value));
}
function hoursValue() {
  return typeof data.plan.hours === "string" ? data.plan.hours : "";
}
function median(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}
function withSampleNote(text, samples) {
  return samples ? text + " (includes sample)" : text;
}
function currentTimeToValue() {
  const days = [];
  let samples = 0;
  data.customers.forEach(customer => {
    if (customer.firstValue !== "yes" || !customer.startedAt || !customer.firstValueAt) return;
    const diff = calendarDaysBetween(new Date(customer.startedAt), new Date(customer.firstValueAt));
    if (diff < 0) return;
    days.push(diff);
    if (isSampleCustomer(customer)) samples += 1;
  });
  if (!days.length) return "Not tracked yet";
  let text = formatDayCount(median(days));
  if (days.length > 1) text += " median of " + days.length;
  return withSampleNote(text, samples);
}
function currentTrial() {
  const cohort = data.customers.filter(customer => customer.startedAt);
  if (!cohort.length) return "Not tracked yet";
  const hit = cohort.filter(customer => {
    if (customer.firstValue !== "yes" || !customer.firstValueAt) return false;
    const day = calendarDaysBetween(new Date(customer.startedAt), new Date(customer.firstValueAt)) + 1;
    return day >= 1 && day <= 14;
  });
  return withSampleNote(hit.length + " of " + cohort.length, cohort.some(isSampleCustomer));
}
function wonTimestamp(lead) {
  const times = data.activity.filter(event => event.entity === "lead" && event.recordId === lead.id && ((event.type === "stage" && event.to === "won") || (event.type === "created" && event.stage === "won"))).map(event => event.ts);
  if (!times.length) return null;
  return Math.min.apply(null, times);
}
function currentHandover() {
  const pairs = [];
  let samples = false;
  data.leads.forEach(lead => {
    const wonAt = wonTimestamp(lead);
    if (!wonAt) return;
    data.customers.filter(customer => customer.startedAt && normName(customer.name) === normName(lead.name)).forEach(customer => {
      const days = calendarDaysBetween(new Date(wonAt), new Date(customer.startedAt));
      if (days < 0) return;
      pairs.push(days);
      if (isSampleLead(lead) || isSampleCustomer(customer)) samples = true;
    });
  });
  if (!pairs.length) return "Not tracked yet";
  let text = formatDayCount(median(pairs));
  if (pairs.length > 1) text += " median of " + pairs.length;
  return withSampleNote(text, samples);
}
function currentRisk() {
  if (!data.customers.length) return "Not tracked yet";
  const rows = data.customers.filter(customer => customer.status === "risk");
  if (!rows.length) return "0";
  const parts = rows.map(customer => {
    if (!customer.riskSince) return "duration not recorded";
    const days = calendarDaysBetween(new Date(customer.riskSince), new Date());
    return days <= 0 ? "today" : formatDayCount(days);
  });
  return withSampleNote(rows.length + " " + (rows.length === 1 ? "account" : "accounts") + ": " + listAnd(parts), rows.some(isSampleCustomer));
}
function currentOutcomes() {
  const rows = data.customers.filter(customer => String(customer.outcome || "").trim());
  if (!rows.length) return "Not tracked yet";
  return withSampleNote(String(rows.length), rows.some(isSampleCustomer));
}
function currentReferrals() {
  if (!data.leads.length) return "Not tracked yet";
  const rows = data.leads.filter(lead => lead.source === "Referral");
  const samples = rows.filter(isSampleLead).length;
  if (!rows.length) return "0";
  if (!samples) return String(rows.length);
  if (samples === rows.length) return rows.length + " (sample)";
  return rows.length + " (" + samples + " sample)";
}
function currentExpansion() {
  const labels = { plan: "upgraded plan", seats: "added seats", rostering: "added rostering" };
  const rows = data.customers.filter(customer => labels[customer.expansion]);
  if (!rows.length) return "Not tracked yet";
  const counts = { plan: 0, seats: 0, rostering: 0 };
  rows.forEach(customer => { counts[customer.expansion] += 1; });
  const parts = Object.keys(labels).filter(key => counts[key]).map(key => counts[key] + " " + labels[key]);
  return withSampleNote(listAnd(parts), rows.some(isSampleCustomer));
}
function measureCurrent(id) {
  if (id === "ttfv") return currentTimeToValue();
  if (id === "trial") return currentTrial();
  if (id === "handover") return currentHandover();
  if (id === "risk") return currentRisk();
  if (id === "outcomes") return currentOutcomes();
  if (id === "referrals") return currentReferrals();
  if (id === "expansion") return currentExpansion();
  return hoursValue().trim() ? hoursValue().trim() : "Not tracked yet";
}
function countStageEvents(stageId, range) {
  const ids = new Set();
  data.activity.forEach(event => {
    if (event.entity !== "lead" || event.ts < range[0] || event.ts >= range[1]) return;
    const hit = (event.type === "stage" && event.to === stageId) || (event.type === "created" && event.stage === stageId);
    if (hit && event.recordId) ids.add(event.recordId);
  });
  return ids.size;
}
function actionItems() {
  const items = [];
  data.leads.forEach((lead, index) => {
    if (lead.stage === "won" || lead.stage === "lost") return;
    if (!String(lead.next || "").trim() || !parseISODate(lead.due)) return;
    items.push({ kind: "lead", index, name: lead.name, next: lead.next, due: lead.due, owner: lead.owner || "", sample: isSampleLead(lead), stage: lead.stage });
  });
  data.customers.forEach((customer, index) => {
    if (!String(customer.next || "").trim() || !parseISODate(customer.due)) return;
    items.push({ kind: "customer", index, name: customer.name, next: customer.next, due: customer.due, owner: customer.owner || "", sample: isSampleCustomer(customer), status: customer.status });
  });
  return items;
}
function actionBucket(due) {
  const today = todayISO();
  if (due < today) return "overdue";
  if (due === today) return "today";
  if (due <= endOfWeekISO(new Date())) return "week";
  return "later";
}
function enteredStage(lead, stageId) {
  if (lead.stage === stageId) return true;
  return leadEvents(lead).some(event => (event.type === "created" && event.stage === stageId) || (event.type === "stage" && (event.to === stageId || event.from === stageId)));
}
function movedPast(lead, fromId, toId) {
  const minimum = FUNNEL_ORDER[toId];
  return leadEvents(lead).some(event => {
    if (event.type !== "stage" || event.from !== fromId) return false;
    const dest = FUNNEL_ORDER[event.to];
    return dest != null && dest >= minimum;
  });
}
function conversionText(fromId, toId) {
  const entered = data.leads.filter(lead => enteredStage(lead, fromId));
  if (!entered.length) return "Not tracked yet";
  const moved = entered.filter(lead => movedPast(lead, fromId, toId));
  const pct = Math.round(moved.length / entered.length * 100);
  return moved.length + " of " + entered.length + " (" + pct + "%)";
}
function emptyBlock(title, copy, compact) {
  return `<div class="empty${compact ? " compact" : ""}"><p class="empty-title">${esc(title)}</p>${copy ? `<p class="empty-copy">${esc(copy)}</p>` : ""}</div>`;
}
function progressBar(done, total, label) {
  const pct = total ? Math.round(done / total * 100) : 0;
  return `<div class="bar" role="progressbar" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${total}" aria-label="${esc(label)}"><span style="width:${pct}%"></span></div>`;
}
function zeroHint(count, hint) { return count ? hint : "No data yet"; }

function renderMetrics() {
  const openStages = STAGES.filter(stage => ["new", "qualified", "demo", "proposal"].includes(stage.id)).map(stage => ({
    label: stage.label,
    count: data.leads.filter(lead => lead.stage === stage.id).length
  }));
  const openTotal = openStages.reduce((sum, stage) => sum + stage.count, 0);
  const demos = countStageEvents("demo", rangeThisWeek());
  const won = countStageEvents("won", rangeThisMonth());
  const onboarding = data.customers.filter(customer => customer.status === "onboarding").length;
  const risk = data.customers.filter(customer => customer.status === "risk").length;
  const outcomes = data.customers.filter(customer => String(customer.outcome || "").trim()).length;
  const overdue = actionItems().filter(item => actionBucket(item.due) === "overdue").length;
  const month = new Date().toLocaleString("en-AU", { month: "long" });
  const openHint = openTotal
    ? `<span class="mini-counts">${openStages.map(stage => `<span>${esc(stage.label)} <span class="num">${stage.count}</span></span>`).join("")}</span>`
    : "No data yet";
  const cards = [
    { kpi: "open", label: "Open pipeline", value: openTotal, hintHtml: openHint, action: "goto-stage", stage: "open" },
    { kpi: "demos", label: "Demos this week", value: demos, hintHtml: esc(zeroHint(demos, "Since Monday")) },
    { kpi: "won", label: "Won this month", value: won, hintHtml: esc(zeroHint(won, "In " + month)) },
    { kpi: "onboarding", label: "Onboarding", value: onboarding, hintHtml: esc(zeroHint(onboarding, "Status is onboarding")), action: "goto-customers", status: "onboarding" },
    { kpi: "risk", label: "At risk", value: risk, hintHtml: esc(zeroHint(risk, "Status is at risk")), action: "goto-customers", status: "risk", alert: risk > 0 },
    { kpi: "outcomes", label: "Verified outcomes", value: outcomes, hintHtml: esc(zeroHint(outcomes, "With permission to share")), action: "goto-focus", focus: "outcomes-heading" },
    { kpi: "overdue", label: "Overdue", value: overdue, hintHtml: esc(zeroHint(overdue, "Past the due date")), action: "goto-focus", focus: "actions-heading", alert: overdue > 0 }
  ];
  document.getElementById("metrics").innerHTML = cards.map(card => {
    const inner = `<span class="metric-label">${esc(card.label)}</span><span class="metric-value${card.alert ? " alert" : ""}">${esc(card.value)}</span><span class="metric-hint">${card.hintHtml}</span>`;
    if (!card.action) return `<div class="metric" data-kpi="${esc(card.kpi)}">${inner}</div>`;
    const attrs = [`data-kpi="${esc(card.kpi)}"`, `data-action="${esc(card.action)}"`];
    if (card.stage) attrs.push(`data-stage="${esc(card.stage)}"`);
    if (card.status) attrs.push(`data-status="${esc(card.status)}"`);
    if (card.focus) attrs.push(`data-focus="${esc(card.focus)}"`);
    return `<button type="button" class="metric" ${attrs.join(" ")}>${inner}</button>`;
  }).join("");
}
function renderPlanCard() {
  const host = document.getElementById("plan-card");
  const start = planStartDate();
  if (!start) {
    host.innerHTML = `<section class="panel"><div class="panel-head"><h3>This week</h3></div><div class="empty"><p class="empty-title">Set start date</p><p class="empty-copy">The 90 day plan needs a start date before this week can be shown.</p><button type="button" class="btn primary" data-action="goto-plan" data-focus="plan-start">Set start date</button></div></section>`;
    return;
  }
  const day = planDayNumber();
  const until = calendarDaysBetween(new Date(), start);
  if (until > 0) {
    host.innerHTML = `<section class="panel"><div class="panel-head"><h3>This week</h3></div><p class="day-line">${esc(planHeadline())}</p><div class="inline-actions"><button type="button" class="btn ghost" data-action="goto-plan">Open 90 day plan</button></div></section>`;
    return;
  }
  if (day > 90) {
    const open = PLAN_ITEMS.filter(item => itemState(item.id).status !== "done");
    const line = open.length ? open.length + " " + (open.length === 1 ? "item is" : "items are") + " still open." : "All items are done.";
    host.innerHTML = `<section class="panel"><div class="panel-head"><h3>This week</h3></div><p class="day-line">${esc(planHeadline())}</p><p class="panel-note">${esc(line)}</p><div class="inline-actions"><button type="button" class="btn ghost" data-action="goto-plan">Open 90 day plan</button></div></section>`;
    return;
  }
  const week = planWeekNumber();
  const milestone = PLAN_WEEKS.find(item => item.week === week);
  const open = PLAN_ITEMS.filter(item => itemInWeek(item, week) && itemState(item.id).status !== "done");
  const list = open.length ? `<ul class="open-items">${open.map(item => {
    const state = itemState(item.id);
    return `<li><button type="button" data-action="goto-plan-item" data-id="${esc(item.id)}"><span class="action-name">${esc(item.what)}</span>${planStatusBadge(state.status)}</button></li>`;
  }).join("")}</ul>` : `<p class="quiet later-note">No open items this week.</p>`;
  host.innerHTML = `<section class="panel"><div class="panel-head"><h3>This week</h3><span class="quiet num">Day ${day} of 90</span></div><p class="what">Week ${week} of 12</p><p>${esc(milestone ? milestone.text : "")}</p>${list}<div class="inline-actions"><button type="button" class="btn ghost" data-action="goto-plan">Open 90 day plan</button></div></section>`;
}
function planStatusBadge(status) {
  const map = { "not-started": "neutral", "in-progress": "demo", done: "good" };
  const found = PLAN_STATUSES.find(item => item.id === status);
  return badge(map[status] || "neutral", found ? found.label : "Not started");
}
function renderActionGroups() {
  const items = actionItems();
  const groups = [
    { id: "overdue", label: "Overdue", copy: "No next actions are overdue." },
    { id: "today", label: "Today", copy: "No next actions are due today." },
    { id: "week", label: "This week", copy: "No next actions are due this week." }
  ];
  const later = items.filter(item => actionBucket(item.due) === "later").length;
  const groupsHtml = groups.map(group => {
    const rows = items.filter(item => actionBucket(item.due) === group.id).sort((a, b) => a.due < b.due ? -1 : a.due > b.due ? 1 : a.name.localeCompare(b.name));
    const body = rows.length ? rows.map(actionRow).join("") : emptyBlock("No data yet", group.copy, true);
    return `<h4 class="group-label">${group.label}</h4>${body}`;
  }).join("");
  const laterHtml = later ? `<p class="quiet later-note">${later} due after this week.</p>` : "";
  document.getElementById("action-groups").innerHTML = groupsHtml + laterHtml;
}
function actionRow(item) {
  const action = item.kind === "lead" ? "edit-lead" : "edit-customer";
  const meta = ["Due " + formatDate(item.due), item.owner].filter(Boolean).join(" · ");
  const flag = item.kind === "lead"
    ? badge(knownClass(item.stage, STAGE_IDS), stageLabel(item.stage))
    : badge(knownClass(item.status, STATUS_IDS), statusLabel(item.status));
  return `<button type="button" class="action" data-action="${action}" data-index="${item.index}"><span class="action-body"><span class="name-line"><span class="action-name">${esc(item.name)}</span>${sampleBadge(item.sample)}</span><span class="action-next">${esc(item.next)}</span><span class="quiet${item.due < todayISO() ? " overdue" : ""}">${esc(meta)}</span></span><span class="action-meta">${flag}</span></button>`;
}
function renderFunnel() {
  const anyValue = data.leads.some(lead => numericValue(lead.value) != null);
  const counts = STAGES.map(stage => data.leads.filter(lead => lead.stage === stage.id).length);
  const max = Math.max(1, ...counts);
  const totalValue = data.leads.map(lead => numericValue(lead.value)).filter(value => value != null).reduce((sum, value) => sum + value, 0);
  let totalText = data.leads.length ? plural(data.leads.length, "lead") : "No data yet";
  if (anyValue) totalText += " · " + formatMoney(totalValue);
  document.getElementById("stage-total").textContent = totalText;
  let note = "Counts are the leads in each stage now. Conversion uses recorded stage changes.";
  if (data.leads.length && !anyValue) note += " No deal value recorded.";
  if (anyValue) note += " Value is the sum of deal values in the stage.";
  document.getElementById("funnel-note").textContent = note;
  document.getElementById("stage-list").innerHTML = STAGES.map((stage, index) => {
    const count = counts[index];
    const width = Math.round(count / max * 100);
    const sum = stageValue(stage.id);
    const valueCell = anyValue ? `<span class="num">${sum == null ? "—" : esc(formatMoney(sum))}</span>` : "";
    let conv = "";
    if (stage.id === "lost") {
      const moves = data.activity.filter(event => event.entity === "lead" && event.type === "stage" && event.to === "lost").length;
      conv = `<p class="funnel-conv">To lost: ${esc(moves ? moves + " recorded " + (moves === 1 ? "move" : "moves") : "Not tracked yet")}</p>`;
    } else if (index > 0) {
      conv = `<p class="funnel-conv">From ${esc(STAGES[index - 1].label)}: ${esc(conversionText(STAGES[index - 1].id, stage.id))}</p>`;
    }
    return `<div class="funnel-step"><button type="button" class="funnel-row${anyValue ? " has-value" : ""}" data-action="goto-stage" data-stage="${stage.id}"><span>${esc(stage.label)}</span><span class="bar" aria-hidden="true"><span style="width:${width}%"></span></span><span class="stage-count">${count}</span>${valueCell}</button>${conv}</div>`;
  }).join("");
}
function stageValue(stageId) {
  const nums = data.leads.filter(lead => lead.stage === stageId).map(lead => numericValue(lead.value)).filter(value => value != null);
  if (!nums.length) return null;
  return nums.reduce((sum, value) => sum + value, 0);
}
function onboardingDay(customer) {
  if (!customer.startedAt) return { label: "Not recorded", trial: "" };
  const day = calendarDaysBetween(new Date(customer.startedAt), new Date()) + 1;
  if (day < 1) return { label: "Starts in " + formatDayCount(1 - day), trial: "" };
  if (day <= 14) return { label: "Day " + day, trial: "window" };
  return { label: "Day " + day, trial: "past" };
}
function renderOnboarding() {
  const rows = data.customers.map((customer, index) => ({ customer, index })).filter(({ customer }) => customer.status === "onboarding");
  const host = document.getElementById("onboarding-list");
  if (!rows.length) {
    host.innerHTML = emptyBlock("No data yet", "No customers are onboarding.");
    return;
  }
  host.innerHTML = rows.map(({ customer, index }) => {
    const progress = onboardingDay(customer);
    const trial = progress.trial === "window" ? '<span class="badge current">Trial window</span>' : (progress.trial === "past" ? badge("neutral", "Past day 14") : "");
    return `<button type="button" class="action${progress.trial === "window" ? " trial" : ""}" data-action="edit-customer" data-index="${index}"><span class="action-body"><span class="name-line"><span class="action-name">${esc(customer.name)}</span>${sampleBadge(isSampleCustomer(customer))}</span><span class="quiet num">${esc(progress.label)}</span></span><span class="action-meta">${badge(customer.firstValue === "yes" ? "good" : "neutral", yesNo(customer.firstValue))}${trial}</span></button>`;
  }).join("");
}
function renderRisk() {
  const atRisk = [];
  const open = [];
  data.customers.forEach((customer, index) => {
    const risks = String(customer.risks || "").trim();
    if (customer.status === "risk") atRisk.push({ customer, index, risks });
    else if (risks) open.push({ customer, index, risks });
  });
  const host = document.getElementById("risk-list");
  if (!atRisk.length && !open.length) {
    host.innerHTML = emptyBlock("No data yet", "No at-risk customers or open risks.");
    return;
  }
  const riskRows = atRisk.map(({ customer, index, risks }) => {
    let duration = "Duration not recorded";
    if (customer.riskSince) {
      const days = calendarDaysBetween(new Date(customer.riskSince), new Date());
      duration = days <= 0 ? "At risk since today" : "At risk for " + formatDayCount(days);
    }
    const detail = [duration, risks].filter(Boolean).join(" · ");
    return feedButton("edit-customer", index, customer.name, isSampleCustomer(customer), detail, badge("risk", "At risk"));
  }).join("");
  const openRows = open.map(({ customer, index, risks }) => feedButton("edit-customer", index, customer.name, isSampleCustomer(customer), risks, badge(knownClass(customer.status, STATUS_IDS), statusLabel(customer.status)))).join("");
  host.innerHTML = `${atRisk.length ? `<h4 class="group-label">At risk</h4>${riskRows}` : ""}${open.length ? `<h4 class="group-label">Open risks</h4>${openRows}` : ""}`;
}
function feedButton(action, index, name, sample, detail, flag) {
  return `<button type="button" class="action" data-action="${action}" data-index="${index}"><span class="action-body"><span class="name-line"><span class="action-name">${esc(name)}</span>${sampleBadge(sample)}</span><span class="action-next">${esc(detail)}</span></span><span class="action-meta">${flag || ""}</span></button>`;
}
function renderOutcomes() {
  const rows = data.customers.map((customer, index) => ({ customer, index })).filter(({ customer }) => String(customer.outcome || "").trim());
  rows.sort((a, b) => (b.customer.outcomeAt || 0) - (a.customer.outcomeAt || 0));
  const host = document.getElementById("outcome-list");
  if (!rows.length) {
    host.innerHTML = emptyBlock("No data yet", "No verified outcomes.");
    return;
  }
  host.innerHTML = rows.map(({ customer, index }) => {
    const when = customer.outcomeAt ? formatWhen(customer.outcomeAt) : "Time not recorded";
    return feedButton("edit-customer", index, customer.name, isSampleCustomer(customer), customer.outcome, `<span class="quiet">${esc(when)}</span>`);
  }).join("");
}
function renderActivity() {
  const host = document.getElementById("activity-list");
  const all = data.activity.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
  if (!all.length) {
    host.innerHTML = emptyBlock("No data yet", "No activity recorded.");
    return;
  }
  const shown = all.slice(0, 30);
  const more = all.length > 30 ? `<p class="quiet later-note">Showing the latest 30 of ${all.length}.</p>` : "";
  host.innerHTML = shown.map(event => {
    const sample = activitySample(event);
    return `<button type="button" class="action" data-action="open-activity" data-entity="${esc(event.entity || "")}" data-id="${esc(event.recordId || "")}"><span class="action-body"><span class="name-line"><span class="action-name">${esc(activityText(event))}</span>${sampleBadge(sample)}</span><span class="quiet num">${esc(formatWhen(event.ts) || "Time not recorded")}</span></span></button>`;
  }).join("") + more;
}
function activitySample(event) {
  if (event.entity === "lead") {
    const lead = data.leads.find(item => item.id === event.recordId);
    return !!(lead && isSampleLead(lead));
  }
  if (event.entity === "customer") {
    const customer = data.customers.find(item => item.id === event.recordId);
    return !!(customer && isSampleCustomer(customer));
  }
  return false;
}
function activityText(event) {
  const name = event.name || "Untitled";
  if (event.type === "created" && event.entity === "lead") return "Lead created · " + name;
  if (event.type === "created" && event.entity === "customer") return "Customer created · " + name;
  if (event.type === "stage") return "Stage changed · " + name + " · " + stageLabel(event.from) + " to " + stageLabel(event.to);
  if (event.type === "note") return "Note added · " + (snippet(event.detail || "") || "Decision");
  return "Activity recorded";
}
function renderStageChips() {
  const filters = [{ id: "all", label: "All" }, { id: "open", label: "Open" }].concat(STAGES);
  document.getElementById("stage-chips").innerHTML = filters.map(filter => {
    const count = filter.id === "all" ? data.leads.length : filter.id === "open" ? data.leads.filter(lead => lead.stage !== "won" && lead.stage !== "lost").length : data.leads.filter(lead => lead.stage === filter.id).length;
    return `<button type="button" class="chip" data-action="stage-filter" data-stage="${filter.id}" aria-pressed="${stageFilter === filter.id ? "true" : "false"}">${filter.label}<span class="chip-count">${count}</span></button>`;
  }).join("");
  document.querySelectorAll('[data-action="pipeline-view"]').forEach(button => {
    button.setAttribute("aria-pressed", button.dataset.mode === pipelineView ? "true" : "false");
  });
}
function filteredLeads() {
  return data.leads.map((lead, index) => ({ lead, index })).filter(({ lead }) => {
    if (stageFilter === "all") return true;
    if (stageFilter === "open") return lead.stage !== "won" && lead.stage !== "lost";
    return lead.stage === stageFilter;
  });
}
function leadActions(index) {
  return `<div class="actions"><button type="button" class="btn small ghost" data-action="edit-lead" data-index="${index}">Edit</button><button type="button" class="btn small ghost danger-text" data-action="remove-lead" data-index="${index}">Remove</button></div>`;
}
function leadExtra(lead) {
  const bits = [];
  if (lead.due) bits.push("Due " + formatDate(lead.due));
  if (lead.owner) bits.push(lead.owner);
  if (numericValue(lead.value) != null) bits.push(formatMoney(numericValue(lead.value)));
  return bits;
}
function renderPipeline() {
  const rows = filteredLeads();
  const tools = document.getElementById("pipeline-tools");
  const panel = document.getElementById("pipeline-panel");
  tools.hidden = data.leads.length === 0;
  renderStageChips();
  if (!data.leads.length) {
    panel.classList.remove("as-cards");
    panel.innerHTML = `<div class="empty"><p class="empty-title">No leads yet</p><p class="empty-copy">Add the first lead to start the pipeline.</p><button type="button" class="btn primary" data-action="add-lead">New lead</button></div>`;
    return;
  }
  if (!rows.length) {
    panel.classList.remove("as-cards");
    panel.innerHTML = `<div class="empty"><p class="empty-title">Nothing in this view</p><p class="empty-copy">Choose another stage or add a lead.</p></div>`;
    return;
  }
  if (pipelineView === "board") {
    panel.classList.remove("as-cards");
    const extra = rows.filter(({ lead }) => !STAGE_IDS.has(lead.stage));
    const columns = STAGES.map(stage => ({ id: stage.id, label: stage.label, rows: rows.filter(({ lead }) => lead.stage === stage.id) }));
    if (extra.length && (stageFilter === "all" || stageFilter === "open")) columns.push({ id: "other", label: "Other", rows: extra });
    panel.innerHTML = `<div class="board">${columns.map(column => `<section class="column" aria-label="${esc(column.label)}"><div class="column-head"><h3>${esc(column.label)}</h3><span class="column-count">${column.rows.length}</span></div>${column.rows.length ? column.rows.map(({ lead, index }) => `<article class="deal"><div class="name-line">${esc(lead.name)}${sampleBadge(isSampleLead(lead))}</div><p class="deal-meta">${esc(lead.segment || "No segment")}</p><p class="deal-meta">${esc(lead.source || "No source")}</p>${lead.next ? `<p class="deal-next">${esc(lead.next)}</p>` : ""}${leadExtra(lead).map(bit => `<p class="deal-meta num">${esc(bit)}</p>`).join("")}${leadActions(index)}</article>`).join("") : `<p class="column-empty">No leads</p>`}</section>`).join("")}</div>`;
    return;
  }
  if (isMobile()) {
    panel.classList.add("as-cards");
    panel.innerHTML = `<div class="records">${rows.map(({ lead, index }) => `<article class="record"><div class="record-head"><h3 class="name-line">${esc(lead.name)}${sampleBadge(isSampleLead(lead))}</h3>${badge(knownClass(lead.stage, STAGE_IDS), stageLabel(lead.stage))}</div><dl><div><dt>Source</dt><dd>${dash(lead.source)}</dd></div><div><dt>Segment</dt><dd>${dash(lead.segment)}</dd></div><div><dt>Next action</dt><dd>${dash(lead.next)}</dd></div><div><dt>Due</dt><dd>${dash(formatDate(lead.due))}</dd></div><div><dt>Owner</dt><dd>${dash(lead.owner)}</dd></div><div><dt>Deal value</dt><dd class="num">${numericValue(lead.value) == null ? "—" : esc(formatMoney(numericValue(lead.value)))}</dd></div></dl>${leadActions(index)}</article>`).join("")}</div>`;
    return;
  }
  panel.classList.remove("as-cards");
  panel.innerHTML = `<div class="table-scroll"><table><thead><tr><th>Company</th><th>Source</th><th>Segment</th><th>Stage</th><th>Next action</th><th>Due</th><th>Owner</th><th>Value</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${rows.map(({ lead, index }) => `<tr><td><span class="name-line">${esc(lead.name)}${sampleBadge(isSampleLead(lead))}</span></td><td>${dash(lead.source)}</td><td>${dash(lead.segment)}</td><td>${badge(knownClass(lead.stage, STAGE_IDS), stageLabel(lead.stage))}</td><td class="wrap">${dash(lead.next)}</td><td class="num">${dash(formatDate(lead.due))}</td><td>${dash(lead.owner)}</td><td class="num">${numericValue(lead.value) == null ? "—" : esc(formatMoney(numericValue(lead.value)))}</td><td>${leadActions(index)}</td></tr>`).join("")}</tbody></table></div>`;
}
function renderCustomerChips() {
  const filters = [{ id: "all", label: "All" }].concat(STATUSES);
  document.getElementById("customer-chips").innerHTML = filters.map(filter => {
    const count = filter.id === "all" ? data.customers.length : data.customers.filter(customer => customer.status === filter.id).length;
    return `<button type="button" class="chip" data-action="customer-filter" data-status="${filter.id}" aria-pressed="${customerFilter === filter.id ? "true" : "false"}">${filter.label}<span class="chip-count">${count}</span></button>`;
  }).join("");
}
function filteredCustomers() {
  return data.customers.map((customer, index) => ({ customer, index })).filter(({ customer }) => customerFilter === "all" || customer.status === customerFilter);
}
function customerActions(index) {
  return `<div class="actions"><button type="button" class="btn small ghost" data-action="edit-customer" data-index="${index}">Edit</button><button type="button" class="btn small ghost danger-text" data-action="remove-customer" data-index="${index}">Remove</button></div>`;
}
function renderCustomers() {
  const rows = filteredCustomers();
  const tools = document.getElementById("customer-tools");
  const panel = document.getElementById("customers-panel");
  tools.hidden = data.customers.length === 0;
  renderCustomerChips();
  if (!data.customers.length) {
    panel.classList.remove("as-cards");
    panel.innerHTML = `<div class="empty"><p class="empty-title">No customers yet</p><p class="empty-copy">Track onboarding, active and at-risk accounts here.</p><button type="button" class="btn primary" data-action="add-customer">New customer</button></div>`;
    return;
  }
  if (!rows.length) {
    panel.classList.remove("as-cards");
    panel.innerHTML = `<div class="empty"><p class="empty-title">Nothing in this view</p><p class="empty-copy">Choose another status or add a customer.</p></div>`;
    return;
  }
  if (isMobile()) {
    panel.classList.add("as-cards");
    panel.innerHTML = `<div class="records">${rows.map(({ customer, index }) => `<article class="record"><div class="record-head"><h3 class="name-line">${esc(customer.name)}${sampleBadge(isSampleCustomer(customer))}</h3>${badge(knownClass(customer.status, STATUS_IDS), statusLabel(customer.status))}</div><dl><div><dt>First value</dt><dd>${badge(customer.firstValue === "yes" ? "good" : "neutral", firstValueLabel(customer.firstValue))}</dd></div><div><dt>Cadexus org ID</dt><dd class="mono">${dash(customer.orgId)}</dd></div><div><dt>Onboarding start</dt><dd class="num">${dash(formatDate(tsToISO(customer.startedAt)))}</dd></div><div><dt>Next action</dt><dd>${dash(customer.next)}</dd></div><div><dt>Due</dt><dd class="num">${dash(formatDate(customer.due))}</dd></div><div><dt>Owner</dt><dd>${dash(customer.owner)}</dd></div><div><dt>Expansion</dt><dd>${esc(expansionLabel(customer.expansion))}</dd></div><div><dt>Risks</dt><dd>${risksHtml(customer.risks)}</dd></div><div><dt>Verified outcome</dt><dd>${outcomeHtml(customer.outcome)}</dd></div></dl>${customerActions(index)}</article>`).join("")}</div>`;
    return;
  }
  panel.classList.remove("as-cards");
  panel.innerHTML = `<div class="table-scroll"><table><thead><tr><th>Company</th><th>Status</th><th>First value</th><th>Org ID</th><th>Next action</th><th>Due</th><th>Owner</th><th>Risks</th><th>Verified outcome</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${rows.map(({ customer, index }) => `<tr><td><span class="name-line">${esc(customer.name)}${sampleBadge(isSampleCustomer(customer))}</span></td><td>${badge(knownClass(customer.status, STATUS_IDS), statusLabel(customer.status))}</td><td>${badge(customer.firstValue === "yes" ? "good" : "neutral", firstValueLabel(customer.firstValue))}</td><td class="mono">${dash(customer.orgId)}</td><td class="wrap">${dash(customer.next)}</td><td class="num">${dash(formatDate(customer.due))}</td><td>${dash(customer.owner)}</td><td class="wrap">${risksHtml(customer.risks)}</td><td class="wrap">${outcomeHtml(customer.outcome)}</td><td>${customerActions(index)}</td></tr>`).join("")}</tbody></table></div>`;
}
function renderNotes() {
  const notes = data.notes.slice().reverse();
  document.getElementById("notes-list").innerHTML = notes.length ? notes.map(note => `<article class="note"><div class="note-time">${esc(formatWhen(note.ts))}</div><p>${esc(note.text)}</p></article>`).join("") : `<div class="empty"><p class="empty-title">No notes yet</p><p class="empty-copy">Record a decision, a test result or a follow-up rule.</p></div>`;
}
function renderPlan() {
  const doneAll = PLAN_ITEMS.filter(item => itemState(item.id).status === "done").length;
  const phases = PLAN_PHASES.map(phase => {
    const items = PLAN_ITEMS.filter(item => item.phase === phase.id);
    const done = items.filter(item => itemState(item.id).status === "done").length;
    const current = currentPhaseId() === phase.id;
    return `<section class="panel phase${current ? " current" : ""}"><div class="panel-head"><h3>${esc(phaseTitle(phase))}${current ? '<span class="badge current">Current</span>' : ""}</h3><span class="quiet num">${done} of ${items.length}</span></div>${progressBar(done, items.length, phaseTitle(phase))}<div class="plan-items">${items.map(renderPlanItem).join("")}</div></section>`;
  }).join("");
  const week = planWeekNumber();
  const weeks = `<section class="panel"><div class="panel-head"><h3>12 week timeline</h3></div><div class="weeks">${PLAN_WEEKS.map(item => {
    const on = item.week === week;
    return `<article class="week${on ? " current" : ""}"${on ? ' aria-current="true"' : ""}><div class="week-top"><h3>Week ${item.week}</h3>${on ? '<span class="badge current">Current</span>' : ""}</div><p>${esc(item.text)}</p></article>`;
  }).join("")}</div></section>`;
  const measures = isMobile() ? `<div class="records">${MEASURES.map(renderMeasureCard).join("")}</div>` : `<div class="table-scroll"><table class="measures"><thead><tr><th>Measure</th><th>Current</th><th>Target</th></tr></thead><tbody>${MEASURES.map(renderMeasureRow).join("")}</tbody></table></div>`;
  document.getElementById("plan-body").innerHTML = `<div class="plan-stack"><section class="panel"><div class="panel-head"><h3>Overall</h3><span class="quiet num">${doneAll} of ${PLAN_ITEMS.length}</span></div>${progressBar(doneAll, PLAN_ITEMS.length, "Overall progress")}<div class="start-row"><p class="day-line" id="plan-prompt">${esc(planHeadline())}</p><label class="field"><span>Plan start date</span><input type="date" id="plan-start" data-plan="start" value="${esc(data.plan.startDate || "")}"></label></div></section>${phases}${weeks}<section class="panel"><div class="panel-head"><h3>Measures</h3></div><p class="panel-note">Current values are calculated from leads and customers. Targets start blank.</p>${measures}</section></div>`;
}
function renderPlanItem(item) {
  const state = itemState(item.id);
  const statusOptions = PLAN_STATUSES.map(status => `<option value="${status.id}"${status.id === state.status ? " selected" : ""}>${esc(status.label)}</option>`).join("");
  const assignees = [["", "Unassigned"], ["partner", "Partner"], ["founder", "Founder"]].map(pair => `<option value="${pair[0]}"${pair[0] === state.assignee ? " selected" : ""}>${esc(pair[1])}</option>`).join("");
  return `<article class="plan-item" id="plan-item-${esc(item.id)}"><div class="plan-top"><div class="checkline"><input type="checkbox" id="plan-check-${esc(item.id)}" data-plan="check" data-id="${esc(item.id)}" aria-label="Mark done" ${state.status === "done" ? "checked" : ""}><p class="what">${esc(item.what)}</p></div><div class="plan-controls"><select id="plan-status-${esc(item.id)}" data-plan="status" data-id="${esc(item.id)}" aria-label="Status">${statusOptions}</select><select id="plan-owner-${esc(item.id)}" data-plan="assignee" data-id="${esc(item.id)}" aria-label="Assignee">${assignees}</select></div></div><p class="kicker">Why</p><p>${esc(item.why)}</p><p class="kicker">Done when</p><p>${esc(item.doneWhen)}</p><label class="field"><span>Notes</span><textarea id="plan-notes-${esc(item.id)}" data-plan="notes" data-id="${esc(item.id)}">${esc(state.notes)}</textarea></label></article>`;
}
function renderMeasureRow(measure) {
  return `<tr><td><span class="name-line">${esc(measure.name)}</span><span class="cell-sub">${esc(measure.detail)}</span></td><td class="num" data-measure="${esc(measure.id)}">${measure.id === "hours" ? hoursInput() : esc(measureCurrent(measure.id))}</td><td>${targetInput(measure)}</td></tr>`;
}
function renderMeasureCard(measure) {
  return `<article class="record"><h3>${esc(measure.name)}</h3><p class="cell-sub">${esc(measure.detail)}</p><p class="kicker">Current</p><div class="num" data-measure="${esc(measure.id)}">${measure.id === "hours" ? hoursInput() : esc(measureCurrent(measure.id))}</div><label class="target-field"><span>Target:</span>${targetField(measure)}</label></article>`;
}
function hoursInput() {
  return `<input id="plan-hours" data-plan="hours" data-measure="hours" value="${esc(hoursValue())}" placeholder="Not tracked yet" aria-label="Partner's hours on sales, manual entry">`;
}
function targetInput(measure) {
  return `<label class="target-field"><span>Target:</span>${targetField(measure)}</label>`;
}
function targetField(measure) {
  return `<input data-plan="target" data-id="${esc(measure.id)}" value="${esc(targetValue(measure.id))}" placeholder="___" aria-label="Target for ${esc(measure.name)}">`;
}
function renderSearch() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const box = document.getElementById("search-results");
  if (!query) {
    box.innerHTML = `<p class="quiet">Search by company, note, stage or source.</p>`;
    return;
  }
  const total = data.leads.length + data.customers.length + data.notes.length;
  if (!total) {
    box.innerHTML = emptyBlock("No data yet", "Add a lead, customer or note first.");
    return;
  }
  const leads = data.leads.map((lead, index) => ({ lead, index })).filter(({ lead }) => blob([lead.name, lead.source, lead.segment, lead.stage, stageLabel(lead.stage), lead.next, lead.notes, lead.owner]).includes(query));
  const customers = data.customers.map((customer, index) => ({ customer, index })).filter(({ customer }) => blob([customer.name, customer.status, statusLabel(customer.status), customer.orgId, customer.next, customer.risks, customer.outcome, customer.owner]).includes(query));
  const notes = data.notes.map((note, index) => ({ note, index })).filter(({ note }) => blob([note.text]).includes(query));
  if (!leads.length && !customers.length && !notes.length) {
    box.innerHTML = emptyBlock("No matches", "Try a different company, note or stage.");
    return;
  }
  const leadHtml = leads.map(({ lead, index }) => searchHit("lead", index, "Lead", lead.name, isSampleLead(lead), lead.next || lead.notes || lead.source)).join("");
  const customerHtml = customers.map(({ customer, index }) => searchHit("customer", index, "Customer", customer.name, isSampleCustomer(customer), customer.outcome || customer.risks || customer.next || statusLabel(customer.status))).join("");
  const noteHtml = notes.map(({ note, index }) => searchHit("note", index, "Note", snippet(note.text) || "Note", false, formatWhen(note.ts))).join("");
  box.innerHTML = groupHtml("Leads", leadHtml) + groupHtml("Customers", customerHtml) + groupHtml("Notes", noteHtml);
}
function blob(parts) { return parts.map(part => String(part || "")).join(" ").toLowerCase(); }
function groupHtml(title, html) { return html ? `<section class="search-group"><h4>${esc(title)}</h4>${html}</section>` : ""; }
function searchHit(kind, index, kindLabel, title, sample, detail) {
  return `<button type="button" class="search-hit" data-action="search-open" data-kind="${kind}" data-index="${index}"><span class="status neutral">${esc(kindLabel)}</span><span><span class="name-line">${esc(title)}${sampleBadge(sample)}</span><span class="cell-sub">${esc(snippet(detail))}</span></span></button>`;
}
function renderBanner() { document.getElementById("sample-banner").hidden = !hasSamples(); }
function render() {
  renderBanner();
  renderMetrics();
  renderPlanCard();
  renderActionGroups();
  renderFunnel();
  renderOnboarding();
  renderRisk();
  renderOutcomes();
  renderActivity();
  renderPipeline();
  renderCustomers();
  renderNotes();
  renderPlan();
  const search = document.getElementById("modal-search");
  if (search && search.open) renderSearch();
  if (pendingFocus) {
    const selector = pendingFocus;
    pendingFocus = null;
    const el = document.querySelector(selector);
    if (el) el.focus();
  }
}
function showView(id) {
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === id));
  document.querySelectorAll(".nav-btn").forEach(button => {
    const on = button.dataset.view === id;
    button.classList.toggle("active", on);
    if (on) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.title = (TITLES[id] || "Command Centre") + " — Command Centre";
}
function activeHeading() {
  const view = document.querySelector(".view.active");
  return view ? view.querySelector("h2") : null;
}
function openDialog(id) {
  lastFocus = document.activeElement;
  const dialog = document.getElementById(id);
  if (!dialog.open) dialog.showModal();
  const field = dialog.querySelector("input:not([type='hidden']), select, textarea");
  if (field) field.focus();
}
function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (dialog && dialog.open) dialog.close();
}
function closeSearchIfOpen() {
  const dialog = document.getElementById("modal-search");
  if (!dialog.open) return;
  lastFocus = document.querySelector("[data-action='open-search']");
  dialog.close();
}
function openSearch() {
  document.getElementById("search-input").value = "";
  renderSearch();
  openDialog("modal-search");
}
function askConfirm(title, message, confirmLabel) {
  const dialog = document.getElementById("confirm-dialog");
  document.getElementById("confirm-title").textContent = title;
  document.getElementById("confirm-copy").textContent = message;
  document.getElementById("confirm-accept").textContent = confirmLabel;
  return new Promise(resolve => {
    const onClose = () => {
      dialog.removeEventListener("close", onClose);
      resolve(dialog.returnValue === "confirm");
    };
    dialog.addEventListener("close", onClose);
    dialog.showModal();
  });
}
function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
}
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const dark = theme === "dark";
  document.getElementById("theme-toggle").setAttribute("aria-pressed", dark ? "true" : "false");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0e1116" : "#f6f9fc");
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}
function requireName(input) {
  const value = input.value.trim();
  if (value) {
    input.setCustomValidity("");
    return value;
  }
  input.setCustomValidity("Enter a company name.");
  input.reportValidity();
  return "";
}
function parseDealValue(raw) {
  const text = String(raw || "").trim();
  if (!text) return "";
  const number = Number(text);
  if (!Number.isFinite(number) || number < 0) return "";
  return number;
}
function setSelect(id, value) {
  const select = document.getElementById(id);
  const exists = Array.from(select.options).some(option => option.value === value);
  if (!exists && value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }
  select.value = value || select.options[0].value;
}
function editLead(index) {
  const lead = data.leads[index];
  if (!lead) return;
  document.getElementById("l-edit-index").value = String(index);
  document.getElementById("l-name").value = lead.name || "";
  setSelect("l-source", lead.source);
  setSelect("l-segment", lead.segment);
  setSelect("l-stage", lead.stage);
  document.getElementById("l-value").value = numericValue(lead.value) == null ? "" : String(lead.value);
  document.getElementById("l-due").value = lead.due || "";
  document.getElementById("l-next").value = lead.next || "";
  document.getElementById("l-owner").value = lead.owner || "";
  document.getElementById("l-notes").value = lead.notes || "";
  document.getElementById("lead-modal-title").textContent = "Edit lead";
  openDialog("modal-lead");
}
function editCustomer(index) {
  const customer = data.customers[index];
  if (!customer) return;
  document.getElementById("c-edit-index").value = String(index);
  document.getElementById("c-name").value = customer.name || "";
  setSelect("c-status", customer.status);
  document.getElementById("c-org").value = customer.orgId || "";
  setSelect("c-value", customer.firstValue || "no");
  document.getElementById("c-value-date").value = tsToISO(customer.firstValueAt);
  document.getElementById("c-started").value = tsToISO(customer.startedAt);
  setSelect("c-expansion", customer.expansion || "");
  document.getElementById("c-next").value = customer.next || "";
  document.getElementById("c-due").value = customer.due || "";
  document.getElementById("c-owner").value = customer.owner || "";
  document.getElementById("c-risks").value = customer.risks || "";
  document.getElementById("c-outcome").value = customer.outcome || "";
  document.getElementById("cust-modal-title").textContent = "Edit customer";
  openDialog("modal-customer");
}
async function removeLead(index) {
  if (!data.leads[index]) return;
  const ok = await askConfirm("Remove this lead?", "This lead will be deleted from the pipeline on this browser.", "Remove");
  if (!ok) return;
  data.leads.splice(index, 1);
  save();
}
async function removeCustomer(index) {
  if (!data.customers[index]) return;
  const ok = await askConfirm("Remove this customer?", "This customer will be deleted from the list on this browser.", "Remove");
  if (!ok) return;
  data.customers.splice(index, 1);
  save();
}
function csvCell(value) { return '"' + String(value == null ? "" : value).replace(/"/g, '""') + '"'; }
function download(filename, text, type) {
  const blob = new Blob([text], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
function exportCSV(type) {
  const rows = type === "leads" ? data.leads : data.customers;
  if (!rows.length) {
    toast("Nothing to export.");
    return;
  }
  const cols = type === "leads"
    ? [["Name", row => row.name], ["Source", row => row.source], ["Segment", row => row.segment], ["Stage", row => row.stage], ["Next", row => row.next], ["Notes", row => row.notes], ["Due", row => row.due], ["Owner", row => row.owner], ["Value", row => row.value]]
    : [["Name", row => row.name], ["Status", row => row.status], ["FirstValue", row => row.firstValue], ["OrgID", row => row.orgId], ["Risks", row => row.risks], ["Outcome", row => row.outcome], ["Next", row => row.next], ["Due", row => row.due], ["Owner", row => row.owner], ["Started", row => row.startedAt ? tsToISO(row.startedAt) : ""], ["FirstValueDate", row => row.firstValueAt ? tsToISO(row.firstValueAt) : ""], ["Expansion", row => row.expansion || ""]];
  const csv = [cols.map(col => col[0]).join(",")].concat(rows.map(row => cols.map(col => csvCell(col[1](row))).join(","))).join("\n");
  download(type + "-" + todayISO() + ".csv", csv, "text/csv");
}
function exportJSON() {
  download("cadexus-command-centre-" + todayISO() + ".json", JSON.stringify(data, null, 2), "application/json");
}
function onPlanChange(event) {
  const target = event.target;
  if (!target.dataset || !target.dataset.plan) return;
  const id = target.dataset.id;
  if (target.dataset.plan === "check") {
    setItemState(id, { status: target.checked ? "done" : "not-started" });
    pendingFocus = "#plan-check-" + id;
    save();
  } else if (target.dataset.plan === "status") {
    setItemState(id, { status: target.value });
    pendingFocus = "#plan-status-" + id;
    save();
  } else if (target.dataset.plan === "assignee") {
    setItemState(id, { assignee: target.value });
    pendingFocus = "#plan-owner-" + id;
    save();
  } else if (target.dataset.plan === "start") {
    data.plan.startDate = parseISODate(target.value) ? target.value : "";
    pendingFocus = "#plan-start";
    save();
  }
}
function onPlanInput(event) {
  const target = event.target;
  if (!target.dataset || !target.dataset.plan) return;
  if (target.dataset.plan === "notes") setItemState(target.dataset.id, { notes: target.value });
  else if (target.dataset.plan === "target") data.plan.targets[target.dataset.id] = target.value;
  else if (target.dataset.plan === "hours") data.plan.hours = target.value;
  else return;
  persist(true);
}
function seedSamples() {
  const now = Date.now();
  const north = { id: uid(), name: "Northside Builders", source: "Referral", segment: "10–50 staff builder", stage: "demo", next: "Follow up Thursday — send Blueprint outline", notes: "Owner frustrated with quoting delays", sample: true, ts: now, createdAt: now };
  const harbour = { id: uid(), name: "Harbour Trades", source: "Cadexus site", segment: "Trade contractor", stage: "qualified", next: "Book demo next week", notes: "Interested in site diary", sample: true, ts: now, createdAt: now };
  const summit = { id: uid(), name: "Summit Construction", status: "onboarding", orgId: "org_abc123", firstValue: "no", risks: "Waiting on pricing library import", outcome: "", sample: true, ts: now, createdAt: now, startedAt: now };
  data.leads = [north, harbour];
  data.customers = [summit];
  data.activity = data.activity.concat([
    { id: uid(), type: "created", entity: "lead", recordId: north.id, name: north.name, stage: north.stage, ts: now },
    { id: uid(), type: "created", entity: "lead", recordId: harbour.id, name: harbour.name, stage: harbour.stage, ts: now },
    { id: uid(), type: "created", entity: "customer", recordId: summit.id, name: summit.name, ts: now }
  ]);
}

let data = loadData();

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.view));
});
document.getElementById("theme-toggle").addEventListener("click", () => {
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});
document.getElementById("search-input").addEventListener("input", renderSearch);
document.getElementById("plan").addEventListener("change", onPlanChange);
document.getElementById("plan").addEventListener("input", onPlanInput);
document.body.addEventListener("click", async event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "add-lead") {
    closeSearchIfOpen();
    document.getElementById("lead-form").reset();
    document.getElementById("l-edit-index").value = "";
    document.getElementById("lead-modal-title").textContent = "Add lead";
    openDialog("modal-lead");
  } else if (action === "add-customer") {
    closeSearchIfOpen();
    document.getElementById("customer-form").reset();
    document.getElementById("c-edit-index").value = "";
    document.getElementById("c-started").value = todayISO();
    document.getElementById("cust-modal-title").textContent = "Add customer";
    openDialog("modal-customer");
  } else if (action === "add-note") {
    closeSearchIfOpen();
    showView("notes");
    document.getElementById("note-input").focus();
  } else if (action === "open-search") {
    openSearch();
  } else if (action === "close-modal") {
    closeDialog(button.dataset.modal);
  } else if (action === "edit-lead") {
    editLead(Number(button.dataset.index));
  } else if (action === "edit-customer") {
    editCustomer(Number(button.dataset.index));
  } else if (action === "remove-lead") {
    await removeLead(Number(button.dataset.index));
  } else if (action === "remove-customer") {
    await removeCustomer(Number(button.dataset.index));
  } else if (action === "export") {
    exportCSV(button.dataset.type);
  } else if (action === "export-json") {
    exportJSON();
  } else if (action === "import-json") {
    document.getElementById("import-file").click();
  } else if (action === "stage-filter") {
    stageFilter = button.dataset.stage;
    pendingFocus = `[data-action="stage-filter"][data-stage="${stageFilter}"]`;
    render();
  } else if (action === "customer-filter") {
    customerFilter = button.dataset.status;
    pendingFocus = `[data-action="customer-filter"][data-status="${customerFilter}"]`;
    render();
  } else if (action === "pipeline-view") {
    pipelineView = button.dataset.mode === "board" ? "board" : "table";
    try { localStorage.setItem(VIEW_KEY, pipelineView); } catch (e) {}
    pendingFocus = `[data-action="pipeline-view"][data-mode="${pipelineView}"]`;
    render();
  } else if (action === "goto-stage") {
    stageFilter = button.dataset.stage || "all";
    showView("pipeline");
    render();
  } else if (action === "goto-customers") {
    customerFilter = button.dataset.status || "all";
    showView("customers");
    render();
  } else if (action === "goto-focus") {
    showView("dashboard");
    const el = document.getElementById(button.dataset.focus);
    if (el) el.scrollIntoView({ block: "start" });
  } else if (action === "goto-plan") {
    showView("plan");
    const el = document.getElementById(button.dataset.focus || "plan-title");
    if (el) el.focus();
  } else if (action === "goto-plan-item") {
    showView("plan");
    const el = document.getElementById("plan-item-" + button.dataset.id);
    if (el) el.scrollIntoView({ block: "start" });
  } else if (action === "search-open") {
    const kind = button.dataset.kind;
    const index = Number(button.dataset.index);
    closeSearchIfOpen();
    if (kind === "lead") editLead(index);
    else if (kind === "customer") editCustomer(index);
    else {
      showView("notes");
      document.getElementById("notes-title").focus();
    }
  } else if (action === "open-activity") {
    if (button.dataset.entity === "lead") {
      const index = data.leads.findIndex(lead => lead.id === button.dataset.id);
      if (index >= 0) editLead(index);
      else toast("That record is no longer in the list.");
    } else if (button.dataset.entity === "customer") {
      const index = data.customers.findIndex(customer => customer.id === button.dataset.id);
      if (index >= 0) editCustomer(index);
      else toast("That record is no longer in the list.");
    } else if (button.dataset.entity === "note") {
      showView("notes");
    }
  } else if (action === "clear-samples") {
    const ok = await askConfirm("Clear sample data", "Northside Builders, Harbour Trades and Summit Construction will be removed. Your own records stay.", "Clear sample data");
    if (!ok) return;
    const leadIds = new Set(data.leads.filter(isSampleLead).map(lead => lead.id));
    const customerIds = new Set(data.customers.filter(isSampleCustomer).map(customer => customer.id));
    data.leads = data.leads.filter(lead => !isSampleLead(lead));
    data.customers = data.customers.filter(customer => !isSampleCustomer(customer));
    data.activity = data.activity.filter(event => {
      if (event.entity === "lead" && leadIds.has(event.recordId)) return false;
      if (event.entity === "customer" && customerIds.has(event.recordId)) return false;
      return true;
    });
    try { localStorage.setItem(SAMPLES_KEY, "1"); } catch (e) {}
    save();
    toast("Sample data cleared.");
  }
});
["modal-lead", "modal-customer", "modal-search", "confirm-dialog"].forEach(id => {
  const dialog = document.getElementById(id);
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    dialog.close(id === "confirm-dialog" ? "cancel" : "");
  });
  if (id === "confirm-dialog") dialog.addEventListener("cancel", () => { dialog.returnValue = "cancel"; });
});
document.getElementById("modal-lead").addEventListener("close", () => {
  document.getElementById("l-name").setCustomValidity("");
  document.getElementById("lead-form").reset();
  document.getElementById("l-edit-index").value = "";
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
});
document.getElementById("modal-customer").addEventListener("close", () => {
  document.getElementById("c-name").setCustomValidity("");
  document.getElementById("customer-form").reset();
  document.getElementById("c-edit-index").value = "";
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
});
document.getElementById("modal-search").addEventListener("close", () => {
  const dialog = document.getElementById("modal-search");
  if (lastFocus && document.contains(lastFocus) && !dialog.contains(lastFocus)) lastFocus.focus();
});
document.getElementById("l-name").addEventListener("input", event => event.target.setCustomValidity(""));
document.getElementById("c-name").addEventListener("input", event => event.target.setCustomValidity(""));
document.getElementById("lead-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = requireName(document.getElementById("l-name"));
  if (!name) return;
  const idx = document.getElementById("l-edit-index").value;
  const prev = idx !== "" && data.leads[idx] ? data.leads[idx] : {};
  const item = Object.assign({}, prev, {
    name,
    source: document.getElementById("l-source").value,
    segment: document.getElementById("l-segment").value,
    stage: document.getElementById("l-stage").value,
    value: parseDealValue(document.getElementById("l-value").value),
    due: document.getElementById("l-due").value,
    next: document.getElementById("l-next").value.trim(),
    owner: document.getElementById("l-owner").value.trim(),
    notes: document.getElementById("l-notes").value.trim(),
    ts: Date.now()
  });
  if (!item.id) item.id = uid();
  if (!item.createdAt) item.createdAt = item.ts;
  if (isSampleLead(prev)) item.sample = true;
  if (idx === "") {
    data.leads.push(item);
    logActivity({ type: "created", entity: "lead", recordId: item.id, name: item.name, stage: item.stage });
  } else {
    if (prev.stage !== item.stage) logActivity({ type: "stage", entity: "lead", recordId: item.id, name: item.name, from: prev.stage, to: item.stage });
    data.leads[idx] = item;
  }
  save();
  closeDialog("modal-lead");
  const heading = activeHeading();
  if (heading) heading.focus();
});
document.getElementById("customer-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = requireName(document.getElementById("c-name"));
  if (!name) return;
  const idx = document.getElementById("c-edit-index").value;
  const prev = idx !== "" && data.customers[idx] ? data.customers[idx] : {};
  const nextStatus = document.getElementById("c-status").value;
  const nextValue = document.getElementById("c-value").value;
  const outcome = document.getElementById("c-outcome").value.trim();
  const dateRaw = document.getElementById("c-value-date").value;
  const startRaw = document.getElementById("c-started").value;
  let firstValueAt = null;
  if (dateRaw) firstValueAt = localDateToTs(dateRaw);
  else if (nextValue === "yes" && prev.firstValue !== "yes") firstValueAt = Date.now();
  let riskSince = prev.riskSince || null;
  if (nextStatus === "risk" && prev.status !== "risk") riskSince = Date.now();
  if (nextStatus !== "risk") riskSince = null;
  let outcomeAt = prev.outcomeAt || null;
  if (!outcome) outcomeAt = null;
  else if (outcome !== String(prev.outcome || "").trim()) outcomeAt = Date.now();
  const item = Object.assign({}, prev, {
    name,
    status: nextStatus,
    orgId: document.getElementById("c-org").value.trim(),
    firstValue: nextValue,
    firstValueAt,
    startedAt: startRaw ? localDateToTs(startRaw) : null,
    expansion: document.getElementById("c-expansion").value,
    next: document.getElementById("c-next").value.trim(),
    due: document.getElementById("c-due").value,
    owner: document.getElementById("c-owner").value.trim(),
    risks: document.getElementById("c-risks").value.trim(),
    outcome,
    outcomeAt,
    riskSince,
    ts: Date.now()
  });
  if (!item.id) item.id = uid();
  if (!item.createdAt) item.createdAt = item.ts;
  if (isSampleCustomer(prev)) item.sample = true;
  if (idx === "") {
    data.customers.push(item);
    logActivity({ type: "created", entity: "customer", recordId: item.id, name: item.name });
  } else data.customers[idx] = item;
  save();
  closeDialog("modal-customer");
  const heading = activeHeading();
  if (heading) heading.focus();
});
document.getElementById("note-form").addEventListener("submit", event => {
  event.preventDefault();
  const text = document.getElementById("note-input").value.trim();
  if (!text) return;
  const note = { id: uid(), text, ts: Date.now() };
  data.notes.push(note);
  logActivity({ type: "note", entity: "note", recordId: note.id, name: "Decisions", detail: text });
  save();
  event.target.reset();
  toast("Note saved.");
});
document.getElementById("import-file").addEventListener("change", async event => {
  const file = event.target.files && event.target.files[0];
  event.target.value = "";
  if (!file) return;
  let parsed = null;
  try { parsed = JSON.parse(await file.text()); } catch (e) { parsed = null; }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || !Array.isArray(parsed.leads) || !Array.isArray(parsed.customers) || !Array.isArray(parsed.notes)) {
    toast("That file isn't a Command Centre backup.");
    return;
  }
  const ok = await askConfirm("Import JSON backup", "This replaces leads, customers, notes, the 90 day plan and the activity log in this browser.", "Import");
  if (!ok) return;
  data = migrate(parsed);
  save();
  toast("Backup imported.");
});
document.addEventListener("keydown", event => {
  if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
  event.preventDefault();
  const open = document.querySelector("dialog[open]");
  if (open && open.id !== "modal-search") return;
  if (open && open.id === "modal-search") {
    document.getElementById("search-input").focus();
    return;
  }
  openSearch();
});

try {
  const storedView = localStorage.getItem(VIEW_KEY);
  if (storedView === "board" || storedView === "table") pipelineView = storedView;
} catch (e) {}
applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
const mac = /Mac|iPhone|iPad/.test(navigator.platform || "") || /Mac/.test(navigator.userAgent || "");
document.querySelectorAll(".mod-key").forEach(el => { el.textContent = mac ? "⌘K" : "Ctrl K"; });
let dismissed = false;
try { dismissed = localStorage.getItem(SAMPLES_KEY) === "1"; } catch (e) {}
if (!dismissed && !data.leads.length && !data.customers.length) {
  seedSamples();
  save();
} else {
  persist(true);
  render();
}
window.matchMedia("(max-width: 800px)").addEventListener("change", () => render());

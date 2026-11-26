const SUPABASE_URL = process.env.SUPABASE_URL || "https://sfsngquxpyaytxnddzdz.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_WfRb4S185FCf24L2OUAWVA_Xom4hJ69";
const APP = "cadexus_command_centre";

const tools = [
  { name: "get_dashboard_summary", description: "Read live Cadexus and PlanDepa dashboard totals. Clearly distinguishes sample records.", inputSchema: { type: "object", properties: {} } },
  { name: "list_leads", description: "Read leads from the Command Centre. Optionally filter by business or stage.", inputSchema: { type: "object", properties: { business: { type: "string", enum: ["cadexus", "plandepa", "unassigned"] }, stage: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 100 } } } },
  { name: "list_customers", description: "Read customer records and account health from the Command Centre.", inputSchema: { type: "object", properties: { status: { type: "string", enum: ["onboarding", "active", "risk"] }, limit: { type: "integer", minimum: 1, maximum: 100 } } } },
  { name: "list_next_actions", description: "Read dated and undated next actions for leads and customers.", inputSchema: { type: "object", properties: { business: { type: "string", enum: ["cadexus", "plandepa", "unassigned"] }, limit: { type: "integer", minimum: 1, maximum: 100 } } } }
];
const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
};
function rpc(id, result) { return { jsonrpc: "2.0", id, result }; }
function error(id, code, message) { return { jsonrpc: "2.0", id, error: { code, message } }; }
function bearer(req) {
  const value = req.headers.authorization || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}
async function supabase(path, token, options = {}) {
  return fetch(SUPABASE_URL + path, { ...options, headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + token, ...(options.headers || {}) } });
}
async function loadData(token) {
  const identity = await supabase("/auth/v1/user", token);
  if (!identity.ok) return { unauthorized: true };
  const response = await supabase("/rest/v1/user_app_data?app=eq." + encodeURIComponent(APP) + "&select=data", token);
  if (!response.ok) throw new Error("Data unavailable");
  const rows = await response.json();
  return rows[0]?.data || { leads: [], customers: [], notes: [], activity: [], plan: {} };
}
function recordContent(value) {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}
function sampleAware(list) {
  return { records: list, sample_records: list.filter(item => item.sample === true).length, note: "Records marked sample are examples, not verified business results." };
}
async function callTool(name, args, data) {
  const leads = Array.isArray(data.leads) ? data.leads : [];
  const customers = Array.isArray(data.customers) ? data.customers : [];
  const limit = Math.max(1, Math.min(100, Number(args.limit) || 50));
  if (name === "get_dashboard_summary") {
    const actualLeads = leads.filter(x => x.sample !== true);
    const actualCustomers = customers.filter(x => x.sample !== true);
    const count = (records, predicate) => records.filter(predicate).length;
    return recordContent({
      businesses: {
        plandepa: { leads: count(actualLeads, x => x.business === "plandepa"), qualified: count(actualLeads, x => x.business === "plandepa" && x.stage === "qualified"), blueprint_or_proposal: count(actualLeads, x => x.business === "plandepa" && x.stage === "proposal"), won: count(actualLeads, x => x.business === "plandepa" && x.stage === "won") },
        cadexus: { leads: count(actualLeads, x => x.business === "cadexus"), demos: count(actualLeads, x => x.business === "cadexus" && x.stage === "demo"), won: count(actualLeads, x => x.business === "cadexus" && x.stage === "won"), customers: count(actualCustomers, () => true), onboarding: count(actualCustomers, x => x.status === "onboarding"), at_risk: count(actualCustomers, x => x.status === "risk") }
      },
      sample_records_excluded_from_totals: leads.length - actualLeads.length + customers.length - actualCustomers.length,
      notes: Array.isArray(data.notes) ? data.notes.length : 0,
      source: "Command Centre saved records"
    });
  }
  if (name === "list_leads") {
    let rows = leads;
    if (args.business) rows = rows.filter(x => x.business === args.business);
    if (args.stage) rows = rows.filter(x => x.stage === args.stage);
    return recordContent(sampleAware(rows.slice(0, limit)));
  }
  if (name === "list_customers") {
    let rows = customers;
    if (args.status) rows = rows.filter(x => x.status === args.status);
    return recordContent(sampleAware(rows.slice(0, limit)));
  }
  if (name === "list_next_actions") {
    const rows = [
      ...leads.filter(x => x.next).map(x => ({ type: "lead", id: x.id, name: x.name, business: x.business, action: x.next, due: x.due || null, owner: x.owner || null, sample: x.sample === true })),
      ...customers.filter(x => x.next).map(x => ({ type: "customer", id: x.id, name: x.name, business: "cadexus", action: x.next, due: x.due || null, owner: x.owner || null, sample: x.sample === true }))
    ].filter(x => !args.business || x.business === args.business).sort((a, b) => String(a.due || "9999").localeCompare(String(b.due || "9999")));
    return recordContent(sampleAware(rows.slice(0, limit)));
  }
  throw new Error("Unknown tool");
}
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization,content-type,mcp-protocol-version");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("MCP-Protocol-Version", "2025-03-26");
  if (req.method === "OPTIONS") { res.statusCode = 204; return res.end(); }
  const token = bearer(req);
  if (!token) {
    const origin = "https://" + (req.headers.host || "cadexus-command-centre-beyond-business.vercel.app");
    res.setHeader("WWW-Authenticate", 'Bearer resource_metadata="' + origin + '/.well-known/oauth-protected-resource"');
    return json(res, 401, { error: "Sign in through the MCP connection flow." });
  }
  try {
    const data = await loadData(token);
    if (data.unauthorized) return json(res, 401, { error: "Access token is invalid or expired." });
    if (req.method === "GET") return json(res, 405, { error: "Use POST for MCP requests." });
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    if (body.method === "notifications/initialized") { res.statusCode = 202; return res.end(); }
    if (body.method === "initialize") {
      return json(res, 200, rpc(body.id, { protocolVersion: "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "Cadexus PlanDepa Command Centre", version: "1.0.0" } }));
    }
    if (body.method === "ping") return json(res, 200, rpc(body.id, {}));
    if (body.method === "tools/list") return json(res, 200, rpc(body.id, { tools }));
    if (body.method === "tools/call") {
      const name = body.params?.name;
      try {
        const result = await callTool(name, body.params?.arguments || {}, data);
        return json(res, 200, rpc(body.id, result));
      } catch {
        return json(res, 200, rpc(body.id, { ...recordContent({ error: "Tool not found or data unavailable." }), isError: true }));
      }
    }
    return json(res, 200, error(body.id, -32601, "Method not found"));
  } catch {
    return json(res, 500, error(null, -32603, "Command Centre MCP service is temporarily unavailable."));
  }
}

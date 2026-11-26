const SUPABASE_URL = process.env.SUPABASE_URL || "https://sfsngquxpyaytxnddzdz.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_WfRb4S185FCf24L2OUAWVA_Xom4hJ69";
const APP = "cadexus_command_centre";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
function bearer(req) {
  const value = req.headers.authorization || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}
async function supabase(path, token, options = {}) {
  return fetch(SUPABASE_URL + path, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + token,
      ...(options.headers || {})
    }
  });
}
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "PUT") {
    res.setHeader("Allow", "GET, PUT");
    return json(res, 405, { error: "Method not allowed" });
  }
  const token = bearer(req);
  if (!token) return json(res, 401, { error: "Sign in to sync Command Centre data." });
  try {
    const identity = await supabase("/auth/v1/user", token);
    if (!identity.ok) return json(res, 401, { error: "Session expired. Sign in again." });
    const user = await identity.json();
    if (!user || !user.id) return json(res, 401, { error: "Could not verify this session." });

    const query = "/rest/v1/user_app_data?app=eq." + encodeURIComponent(APP) + "&select=data";
    if (req.method === "GET") {
      const result = await supabase(query, token);
      if (!result.ok) return json(res, result.status, { error: "Could not read shared Command Centre data." });
      const rows = await result.json();
      return json(res, 200, { data: rows[0]?.data || null });
    }

    let body = req.body;
    if (typeof body === "string") {
      if (body.length > 300000) return json(res, 413, { error: "The data is too large to sync." });
      body = JSON.parse(body);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json(res, 400, { error: "Invalid Command Centre data." });
    const allowed = { leads: body.leads, customers: body.customers, notes: body.notes, activity: body.activity, plan: body.plan };
    if (!Array.isArray(allowed.leads) || !Array.isArray(allowed.customers) || !Array.isArray(allowed.notes)) {
      return json(res, 400, { error: "Required dashboard lists are missing." });
    }
    if (JSON.stringify(allowed).length > 300000) return json(res, 413, { error: "The data is too large to sync." });
    const result = await supabase("/rest/v1/user_app_data?on_conflict=user_id,app", token, {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ user_id: user.id, app: APP, data: allowed, updated_at: new Date().toISOString() })
    });
    if (!result.ok) return json(res, result.status, { error: "Could not save shared Command Centre data." });
    return json(res, 200, { ok: true });
  } catch {
    return json(res, 500, { error: "Shared storage is temporarily unavailable." });
  }
}

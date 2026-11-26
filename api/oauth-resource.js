export default function handler(req, res) {
  const origin = "https://" + (req.headers.host || "cadexus-command-centre-beyond-business.vercel.app");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify({
    resource: origin + "/api/mcp",
    authorization_servers: ["https://sfsngquxpyaytxnddzdz.supabase.co/auth/v1"],
    scopes_supported: ["read:dashboard"],
    bearer_methods_supported: ["header"]
  }));
}

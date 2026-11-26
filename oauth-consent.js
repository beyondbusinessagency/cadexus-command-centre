(() => {
  const URL = "https://sfsngquxpyaytxnddzdz.supabase.co";
  const KEY = "sb_publishable_WfRb4S185FCf24L2OUAWVA_Xom4hJ69";
  const sb = window.supabase.createClient(URL, KEY, { auth: { flowType: "pkce", detectSessionInUrl: true } });
  const authorizationId = new URLSearchParams(location.search).get("authorization_id");
  const message = document.getElementById("message");
  const form = document.getElementById("login-form");
  const logged = document.getElementById("logged-in");
  async function show() {
    const { data: { session } } = await sb.auth.getSession();
    form.hidden = !!session;
    logged.hidden = !session;
    if (!session) return;
    const result = await sb.auth.oauth.getAuthorizationDetails(authorizationId);
    if (result.error) { message.textContent = result.error.message; return; }
    const details = result.data;
    document.getElementById("requesting").textContent = "Request from " + (details.client?.name || "an AI agent") + ". Requested scopes: " + (details.scope || "read:dashboard");
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    message.textContent = "Sending a secure sign-in link…";
    const { error } = await sb.auth.signInWithOtp({ email: document.getElementById("email").value.trim(), options: { emailRedirectTo: location.origin + "/oauth/consent?authorization_id=" + encodeURIComponent(authorizationId) } });
    message.textContent = error ? error.message : "Check your email and open the sign-in link on this device.";
  });
  document.getElementById("approve").addEventListener("click", async () => {
    const { error } = await sb.auth.oauth.approveAuthorization(authorizationId);
    message.textContent = error ? error.message : "Access approved. Returning to your AI agent…";
  });
  document.getElementById("deny").addEventListener("click", async () => {
    const { error } = await sb.auth.oauth.denyAuthorization(authorizationId);
    message.textContent = error ? error.message : "Access denied. Returning to your AI agent…";
  });
  if (!authorizationId) message.textContent = "This approval link is missing its request ID.";
  else show();
})();

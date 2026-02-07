// js/pages/acceptInvite.page.js
import { getSupabase } from "../core/supabaseClient.js";
import { getSession } from "../core/session.js";
import { path } from "../core/config.js";
import { dashboardPathForRole } from "../core/roles.js";

async function main() {
  const statusEl = document.querySelector("#status");

  function getToken() {
    const url = new URL(window.location.href);
    return url.searchParams.get("token");
  }

  const token = getToken();
  if (!token) {
    statusEl.textContent = "Missing invite token.";
    return;
  }

  const session = await getSession();
  if (!session?.user) {
    statusEl.textContent = "Please register or log in first, then reopen the invite link.";
    window.location.replace(path("/register.html"));
    return;
  }

  const supabase = getSupabase();

  try {
    statusEl.textContent = "Validating invite…";

    const { data: invite, error: invErr } = await supabase
      .from("invites")
      .select("organization_id, invited_role, status, invited_email")
      .eq("token", token)
      .single();

    if (invErr) throw invErr;

    if (invite.status !== "PENDING") {
      statusEl.textContent = `Invite is already ${invite.status}.`;
      return;
    }

    statusEl.textContent = "Joining company…";

    const { error: memErr } = await supabase.from("org_members").insert({
      organization_id: invite.organization_id,
      user_id: session.user.id,
      role: invite.invited_role,
      is_active: true,
    });

    if (memErr) throw memErr;

    const { error: updErr } = await supabase
      .from("invites")
      .update({
        status: "ACCEPTED",
        accepted_by_user_id: session.user.id,
        accepted_at: new Date().toISOString(),
      })
      .eq("token", token);

    if (updErr) throw updErr;

    statusEl.textContent = "Done. Redirecting…";
    window.location.replace(dashboardPathForRole(invite.invited_role));
  } catch (e) {
    console.error(e);
    statusEl.textContent = e.message || "Failed to accept invite.";
  }
}

main();

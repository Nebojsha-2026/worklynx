// js/data/invites.api.js
import { getSupabase } from "../core/supabaseClient.js";

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export async function createInvite({ organizationId, email, role }) {
  const supabase = getSupabase();

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes?.user;
  if (!user) throw new Error("Not logged in.");

  const token = randomToken();

  // Optional expiry: 7 days from now
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("invites")
    .insert({
      organization_id: organizationId,
      invited_email: email.toLowerCase(),
      invited_role: role,            // <-- your column
      invited_by_user_id: user.id,   // <-- your column
      token,
      status: "PENDING",
      expires_at: expiresAt,
    })
    .select("token, invited_email, invited_role")
    .single();

  if (error) throw error;
  return data;
}

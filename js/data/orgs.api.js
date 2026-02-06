// js/data/orgs.api.js
import { getSupabase } from "../core/supabaseClient.js";

export async function createOrganization({ name }) {
  const supabase = getSupabase();

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes?.user;
  if (!user) throw new Error("Not logged in.");

  // 1) Insert organization (NO select here)
  const { error: orgErr } = await supabase
    .from("organizations")
    .insert({
      name,
      owner_user_id: user.id,
      currency_code: "AUD",
      theme: {},
    });

  if (orgErr) throw orgErr;

  // 2) Fetch the org we just created
  const { data: org, error: fetchErr } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (fetchErr) throw fetchErr;

  // 3) Add BO membership
  const { error: memErr } = await supabase.from("org_members").insert({
    organization_id: org.id,
    user_id: user.id,
    role: "BO",
    is_active: true,
  });

  if (memErr) throw memErr;

  return org;
}

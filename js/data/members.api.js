// js/data/members.api.js
import { getSupabase } from "../core/supabaseClient.js";

export async function getMyMemberships() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("org_members")
    .select("organization_id, role, is_active")
    .eq("is_active", true);

  if (error) throw error;
  return data || [];
}

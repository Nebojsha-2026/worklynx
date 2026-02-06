// js/core/orgContext.js
import { getSupabase } from "./supabaseClient.js";

let cachedOrg = null;

/**
 * Load the active organization for the logged-in user.
 * For now: pick the org where user is BO (later we’ll support multi-org).
 */
export async function loadOrgContext() {
  if (cachedOrg) return cachedOrg;

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, company_logo_url, currency_code, theme")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;

  cachedOrg = data;
  return data;
}

export function clearOrgContext() {
  cachedOrg = null;
}

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
import { getSupabase } from "../core/supabaseClient.js";

export async function listOrgMembers({ organizationId, roles = null }) {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("list_org_members", {
    p_org_id: organizationId,
    p_roles: roles,
  });
  if (error) throw error;
  return data || [];
}

export async function deactivateOrgMember({ organizationId, userId }) {
  const supabase = getSupabase();
  const { error } = await supabase.rpc("deactivate_org_member", {
    p_org_id: organizationId,
    p_user_id: userId,
  });
  if (error) throw error;
}

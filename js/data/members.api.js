// js/data/members.api.js
import { getSupabase } from "../core/supabaseClient.js";
import { getSession } from "../core/session.js";

export async function getMyMemberships() {
  const supabase = getSupabase();
  const session = await getSession();
  const uid = session?.user?.id;
  if (!uid) return [];

  const { data, error } = await supabase
    .from("org_members")
    .select("organization_id, role, is_active")
    .eq("user_id", uid)
    .eq("is_active", true);

  if (error) throw error;
  return data || [];
}

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

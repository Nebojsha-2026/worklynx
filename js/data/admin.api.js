// js/data/admin.api.js
import { getSupabase } from "../core/supabaseClient.js";

export async function isPlatformAdmin(userId) {
  if (!userId) return false;
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("platform_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  // If RLS denies, you'll see an error: that usually means the user is NOT admin.
  if (error) return false;
  return !!data;
}


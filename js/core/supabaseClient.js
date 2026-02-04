// js/core/supabaseClient.js
import { CONFIG } from "./config.js";

export function getSupabase() {
  if (window.__supabase) return window.__supabase;

  // Requires the UMD script in HTML:
  // <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    throw new Error("Supabase UMD library not loaded. Add the CDN <script> tag.");
  }

  window.__supabase = window.supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_ANON_KEY
  );

  return window.__supabase;
}


import { supabase } from "./supabase.js";

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function login(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "/login.html";
}

export async function getProfile() {
  const session = await getSession();
  if (!session) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return data;
}

import { getSession, getProfile } from "./auth.js";

export async function protect(role) {
  const session = await getSession();
  if (!session) return redirect("/login.html");

  const profile = await getProfile();
  if (!profile || profile.role !== role) {
    return redirect("/login.html");
  }

  return profile;
}

function redirect(path) {
  window.location.href = path;
}

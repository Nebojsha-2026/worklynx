import { path } from "./config.js";
import { getSession } from "./session.js";
import { isPlatformAdmin } from "../data/admin.api.js";
import { getMyMemberships } from "../data/members.api.js";
import { pickHighestRole, dashboardPathForRole } from "./roles.js";

export async function redirectIfLoggedIn() {
  const session = await getSession();
  const user = session?.user;
  if (!user) return;

  const admin = await isPlatformAdmin(user.id);
  if (admin) {
    window.location.replace(path("/app/admin/dashboard.html"));
    return;
  }

  const memberships = await getMyMemberships();
  const roles = memberships.map((m) => m.role);
  const highest = pickHighestRole(roles);

  if (!highest) {
    window.location.replace(path("/pricing.html"));
    return;
  }

  window.location.replace(dashboardPathForRole(highest));
}
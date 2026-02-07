// js/pages/bo.managers.page.js
import { enforceRoleRouting } from "../core/guards.js";
import { renderHeader } from "../ui/header.js";
import { renderFooter } from "../ui/footer.js";
import { loadOrgContext } from "../core/orgContext.js";

await enforceRoleRouting();

const org = await loadOrgContext();

document.body.prepend(
  renderHeader({
    companyName: org.name,
    companyLogoUrl: org.company_logo_url,
  })
);

document.body.append(renderFooter({ version: "v0.1.0" }));

const main = document.querySelector("main");
main.innerHTML = `
  <h1>Managers</h1>
  <p>Invite Business Manager(s) and Managers to join <strong>${org.name}</strong>.</p>

  <section class="wl-card" style="padding:16px; max-width:720px;">
    <h2 style="margin-top:0;">Send an invite</h2>

    <form id="inviteForm" class="wl-form">
      <label>Email</label>
      <input id="inviteEmail" type="email" required placeholder="name@company.com" />

      <label>Role</label>
      <select id="inviteRole" required>
        <option value="BM">Business Manager (BM)</option>
        <option value="MANAGER">Manager</option>
      </select>

      <button class="wl-btn" type="submit">Generate invite link (next step)</button>
    </form>

    <div id="inviteResult" style="margin-top:12px;"></div>
  </section>
`;

document.querySelector("#inviteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#inviteEmail").value.trim();
  const role = document.querySelector("#inviteRole").value;

  // Next step will call Supabase + generate a real token link
  const result = document.querySelector("#inviteResult");
  result.innerHTML = `
    <div class="wl-card" style="padding:12px;">
      <strong>Next step:</strong> we will create an invite in Supabase and generate a link.<br/>
      Email: <code>${email}</code><br/>
      Role: <code>${role}</code>
    </div>
  `;
});

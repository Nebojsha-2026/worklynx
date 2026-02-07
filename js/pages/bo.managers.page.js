// js/pages/bo.managers.page.js
import { renderHeader } from "../ui/header.js";
import { renderFooter } from "../ui/footer.js";
import { loadOrgContext } from "../core/orgContext.js";
import { requireRole } from "../core/guards.js";
import { path } from "../core/config.js";
import { createInvite } from "../data/invites.api.js";

await requireRole(["BO", "BM"]);

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

      <button class="wl-btn" type="submit">Create invite</button>
    </form>

    <div id="inviteResult" style="margin-top:12px;"></div>
  </section>
`;

document.querySelector("#inviteForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#inviteEmail").value.trim();
  const role = document.querySelector("#inviteRole").value;

  try {
    const res = await createInvite({
      organizationId: org.id,
      email,
      role,
    });

   const inviteUrl =
  `${window.location.origin}` +
  path(`/accept-invite.html#token=${encodeURIComponent(res.token)}`);

    document.querySelector("#inviteResult").innerHTML = `
      <div class="wl-card" style="padding:12px;">
        <div><strong>Invite created</strong></div>
        <div>Email: <code>${res.invited_email}</code></div>
        <div>Role: <code>${res.invited_role}</code></div>
        <div style="margin-top:8px;">
          Invite link:<br/>
          <input style="width:100%; padding:8px;" readonly value="${inviteUrl}" />
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to create invite.");
  }
});

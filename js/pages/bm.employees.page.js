// js/pages/bm.employees.page.js
import { requireRole } from "../core/guards.js";
import { renderHeader } from "../ui/header.js";
import { renderFooter } from "../ui/footer.js";
import { renderSidebar } from "../ui/sidebar.js";
import { loadOrgContext } from "../core/orgContext.js";
import { createInvite } from "../data/invites.api.js";
import { path } from "../core/config.js";
import { listOrgMembers, deactivateOrgMember } from "../data/members.api.js";

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
main.classList.add("wl-page");

main.innerHTML = `
  <div class="wl-shell">
    <div id="wlSidebar"></div>
    <div id="wlContent"></div>
  </div>
`;

main.querySelector("#wlSidebar").append(renderSidebar("BM"));

main.querySelector("#wlContent").innerHTML = `
  <h1>Employees</h1>
  <p>Invite employees to join <strong>${org.name}</strong>.</p>

  <section class="wl-card" style="padding:16px; max-width:720px;">
    <h2 style="margin-top:0;">Invite an employee</h2>

    <form id="inviteEmployeeForm" class="wl-form">
      <label>Email</label>
      <input id="employeeEmail" type="email" required placeholder="employee@company.com" />
      <button class="wl-btn" type="submit">Create invite</button>
    </form>

    <div id="inviteEmployeeResult" style="margin-top:12px;"></div>
  </section>

  <section style="margin-top:16px;">
    <h2>Current employees</h2>
    <div id="employeesList" class="wl-card" style="padding:12px;"></div>
  </section>
`;

async function refreshEmployees() {
  const box = document.querySelector("#employeesList");
  box.innerHTML = "Loading...";

  try {
    const rows = await listOrgMembers({
      organizationId: org.id,
      roles: ["EMPLOYEE"],
    });

    if (!rows.length) {
      box.innerHTML = `<div style="opacity:.85;">No employees yet.</div>`;
      return;
    }

    box.innerHTML = `
      <div style="display:grid; gap:8px;">
        ${rows
          .map(
            (m) => `
          <div class="wl-card" style="padding:10px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700;">EMPLOYEE</div>
              <div style="font-size:12px; opacity:.85;">User ID: <code>${m.user_id}</code></div>
            </div>
            <button class="wl-btn" data-remove="${m.user_id}" style="padding:8px 10px;">Remove</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    box.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const userId = btn.getAttribute("data-remove");
        if (!confirm("Remove this employee from the company?")) return;

        try {
          await deactivateOrgMember({ organizationId: org.id, userId });
          await refreshEmployees();
        } catch (err) {
          console.error(err);
          alert(err.message || "Failed to remove employee.");
        }
      });
    });
  } catch (err) {
    console.error(err);
    box.innerHTML = `<div style="color:#ffb3b3;">Failed to load employees.</div>`;
  }
}

document.querySelector("#inviteEmployeeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#employeeEmail").value.trim();

  try {
    const res = await createInvite({
      organizationId: org.id,
      email,
      role: "EMPLOYEE",
    });

    const inviteUrl =
      `${window.location.origin}` +
      path(`/accept-invite.html#token=${encodeURIComponent(res.token)}`);

    document.querySelector("#inviteEmployeeResult").innerHTML = `
      <div class="wl-card" style="padding:12px;">
        <div><strong>Employee invite created</strong></div>
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
    alert(err.message || "Failed to create employee invite.");
  }
});

await refreshEmployees();

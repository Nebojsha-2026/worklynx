// js/pages/manager.create-shift.page.js
import { requireRole } from "../../core/guards.js";
import { renderHeader } from "../../ui/header.js";
import { renderFooter } from "../../ui/footer.js";
import { renderSidebar } from "../../ui/sidebar.js";
import { loadOrgContext } from "../../core/orgContext.js";
import { createShift } from "../../data/shifts.api.js";

await requireRole(["BO", "BM", "MANAGER"]);

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
  <div class="wl-shell">
    <div id="wlSidebar"></div>
    <div id="wlContent"></div>
  </div>
`;

main.querySelector("#wlSidebar").append(renderSidebar("MANAGER"));

main.querySelector("#wlContent").innerHTML = `
  <h1>Create shift</h1>

  <section class="wl-card" style="padding:16px; max-width:720px;">
    <form id="shiftForm" class="wl-form">

      <label>Title</label>
      <input id="title" required placeholder="Morning shift" />

      <label>Description</label>
      <textarea id="description" rows="3"></textarea>

      <label>Location</label>
      <input id="location" placeholder="Main warehouse" />

      <label>Hourly rate</label>
      <input id="rate" type="number" step="0.01" required />

      <label>Start</label>
      <input id="startAt" type="datetime-local" required />

      <label>End</label>
      <input id="endAt" type="datetime-local" required />

      <button class="wl-btn" type="submit">Create shift</button>
    </form>

    <div id="result" style="margin-top:12px;"></div>
  </section>
`;

document.querySelector("#shiftForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    organization_id: org.id,
    title: document.querySelector("#title").value.trim(),
    description: document.querySelector("#description").value.trim(),
    location: document.querySelector("#location").value.trim(),
    hourly_rate: Number(document.querySelector("#rate").value),
    start_at: document.querySelector("#startAt").value,
    end_at: document.querySelector("#endAt").value,
  };

  try {
    const shift = await createShift(payload);

    document.querySelector("#result").innerHTML = `
      <div class="wl-card" style="padding:12px;">
        <strong>Shift created</strong><br/>
        ${shift.title}
      </div>
    `;

    e.target.reset();
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to create shift");
  }
});

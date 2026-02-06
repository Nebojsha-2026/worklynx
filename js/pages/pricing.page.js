// js/pages/pricing.page.js
import { getSession } from "../core/session.js";
import { path } from "../core/config.js";
import { createOrganization } from "../data/orgs.api.js";

const session = await getSession();
if (!session?.user) {
  window.location.replace(path("/login.html"));
}

const form = document.querySelector("#createOrgForm");
const nameInput = document.querySelector("#companyName");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  if (!name) {
    alert("Company name is required");
    return;
  }

  try {
    form.querySelector("button").disabled = true;

    await createOrganization({ name });

    // Now you have a BO role → routing will send you to BO dashboard
    window.location.replace(path("/app/bo/dashboard.html"));
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to create company.");
  } finally {
    form.querySelector("button").disabled = false;
  }
});

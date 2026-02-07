// js/ui/footer.js
import { path } from "../core/config.js";

export function renderFooter({ version = "v0.1.0" } = {}) {
  const footer = document.createElement("footer");
  footer.className = "wl-footer";

  footer.innerHTML = `
    <div class="wl-footer__inner">
      <div class="wl-footer__col">
        <h4>WorkLynx</h4>
        <div>Modern timesheets & shift management.</div>
      </div>

      <div class="wl-footer__col">
        <h4>Support</h4>
        <a href="${path("/index.html")}">Contact Support</a>
        <a href="${path("/index.html")}">System Status</a>
      </div>

      <div class="wl-footer__col">
        <h4>Product</h4>
        <a href="${path("/index.html")}">Changelog</a>
        <a href="${path("/index.html")}">Maintenance Schedule</a>
      </div>

      <div class="wl-footer__col">
        <h4>Meta</h4>
        <div>Built by Nebojsha</div>
        <div>Version: ${version}</div>
      </div>
    </div>
  `;

  return footer;
}

import { protect } from "../core/router.js";
import { logout } from "../core/auth.js";

const profile = await protect("employee");

document.querySelector("#logoutBtn").onclick = logout;

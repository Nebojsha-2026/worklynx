import { protect } from "../core/router.js";
import { logout } from "../core/auth.js";

const profile = await protect("manager");

document.querySelector("#logoutBtn").onclick = logout;

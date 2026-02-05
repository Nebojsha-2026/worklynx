// js/pages/index.page.js
import { redirectIfLoggedIn } from "../core/guards.js";

// If user is logged in, send them to the correct dashboard
await redirectIfLoggedIn();

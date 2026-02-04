// js/core/config.js
export const CONFIG = {
  SUPABASE_URL: "https://ljnpugeuyosecggnbapa.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbnB1Z2V1eW9zZWNnZ25iYXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjgzNTYsImV4cCI6MjA4NTc0NDM1Nn0.Cv4XnbR3O21H4lfqRWyx6ph2qjyqlU7DHGFWLrrNTLo",

  APP_NAME: "WorkLynx",

  // Default UI options
  DEFAULT_CURRENCY: "AUD",
  DEFAULT_LANG: "en",
  BASE_PATH: "/Worklynx",
};
export function path(p) {
  return `${CONFIG.BASE_PATH}${p}`;
}

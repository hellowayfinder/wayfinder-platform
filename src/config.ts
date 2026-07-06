import type { AppConfig } from "./types";

// ─────────────────────────────────────────────────────────
// WayFinder Configuration
// Update these values before deploying to production
// ─────────────────────────────────────────────────────────

const CONFIG: AppConfig = {
  // ── Google Sheets ──────────────────────────────────────
  // 1. Share your sheet: Share → Anyone with link → Viewer
  // 2. Enable Sheets API in Google Cloud Console
  // 3. Generate an API key and paste below
  // 4. Replace YOUR_SHEET_ID with the ID from your sheet URL
  //    URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
  SHEET_ID: "13nu-yr792lhdoa3hhLDkXg3X3uLS2JP-m-itYbZZhAg",
  SHEET_TAB: "Replit_Providers", // exact tab name in your sheet
  GOOGLE_API_KEY: "AIzaSyBhxY5HkM9mWnKGFDNypzkrCk0Eyi_75TM",

  // ── Google Analytics ───────────────────────────────────
  // Replace with your GA4 Measurement ID (G-XXXXXXXXXX)
  GA_ID: "G-XXXXXXXXXX",

  // ── Feedback Form ──────────────────────────────────────
  // Google Forms: Send → Embed → copy the src= URL
  FEEDBACK_FORM_URL: "YOUR_GOOGLE_FORM_3_EMBED_URL_HERE",

  // ── App Info ───────────────────────────────────────────
  APP_NAME: "WayFinder",
  APP_TAGLINE: "Trusted special needs providers in Chennai",
  APP_CITY: "Chennai",
};

export default CONFIG;

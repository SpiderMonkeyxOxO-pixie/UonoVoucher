#!/usr/bin/env node
"use strict";
/**
 * Runs automatically after `npm run build` (npm "postbuild"). The build copies
 * dist/ (the prebuild step empties it), which would wipe the live codes on
 * every deploy and on the daily rebuild. If the admin
 * panel's master copy exists, put it back.
 */
const fs = require("node:fs");
const path = require("node:path");
const { MASTER_FILE, LIVE_FILE } = require("./paths.cjs");

if (!fs.existsSync(MASTER_FILE)) {
  console.log("[promo-admin] no master promo file yet — no live codes to restore.");
  process.exit(0);
}
try {
  fs.mkdirSync(path.dirname(LIVE_FILE), { recursive: true });
  const tmp = `${LIVE_FILE}.tmp`;
  fs.copyFileSync(MASTER_FILE, tmp);
  fs.renameSync(tmp, LIVE_FILE);
  console.log(`[promo-admin] restored live promo codes -> ${LIVE_FILE}`);
} catch (err) {
  // Never fail the build over this, but make it loud.
  console.error("[promo-admin] COULD NOT RESTORE promo codes:", err.message);
}

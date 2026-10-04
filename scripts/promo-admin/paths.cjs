"use strict";
/**
 * Shared config for the promo admin and the post-build restore step.
 * Settings live in an env file OUTSIDE the git checkout (default
 * /www/wwwroot/uonovoucher-admin.env, next to the site folder).
 */
const fs = require("node:fs");
const path = require("node:path");

const SITE_ROOT = path.resolve(process.env.SITE_ROOT || path.join(__dirname, "..", ".."));

function loadEnvFile(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
loadEnvFile(process.env.ENV_FILE || path.resolve(SITE_ROOT, "..", "uonovoucher-admin.env"));

module.exports = {
  SITE_ROOT,
  // Master copy: survives rebuilds (the build wipes dist/).
  MASTER_FILE: path.resolve(
    process.env.PROMO_MASTER ||
      path.join(SITE_ROOT, "..", "uonovoucher-admin-data", "promo-live.json"),
  ),
  // The file nginx serves; the site fetches it as /promo-live.json.
  LIVE_FILE: path.resolve(process.env.PROMO_LIVE || path.join(SITE_ROOT, "dist", "promo-live.json")),
  BACKUP_DIR: path.resolve(
    process.env.BACKUP_DIR || path.join(SITE_ROOT, "..", "uonovoucher-admin-data", "backups"),
  ),
};

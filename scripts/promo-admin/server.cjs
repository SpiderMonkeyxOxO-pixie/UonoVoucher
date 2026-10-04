#!/usr/bin/env node
/**
 * code.uonovoucher.com — promo-code admin for the UonoVoucher.com (Vite SPA) site.
 *
 * Zero dependencies (Node 18+). Runs as its own PM2 process on 127.0.0.1 behind
 * an nginx/aaPanel reverse proxy for code.uonovoucher.com. The site is a prerendered
 * SPA whose built-in promo data is fixed at build time, so it fetches /promo-live.json
 * in the browser on every load and merges those codes over the built-in ones (homepage,
 * /promo-codes/, game pages) — no rebuild needed. A rebuild empties dist/, so the admin
 * keeps a MASTER copy outside the repo and writes it to dist/promo-live.json too;
 * restore.cjs (npm "postbuild") puts the master back after every build.
 *
 * Config: env file OUTSIDE the git checkout (see paths.cjs and README.md).
 */
"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { SITE_ROOT, MASTER_FILE, LIVE_FILE, BACKUP_DIR } = require("./paths.cjs");

const PORT = Number(process.env.PORT || 3150);
const PUBLIC_URL = (process.env.PUBLIC_URL || "https://uonovoucher.com").replace(/\/$/, "");
const SECURE_COOKIE = process.env.INSECURE_COOKIES !== "1";
const SESSION_MS = 8 * 60 * 60 * 1000;
const COOKIE = "uv_admin";
const MAX_CODE_LENGTH = 40;

function authConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
      process.env.ADMIN_PASSWORD_HASH &&
      (process.env.ADMIN_SESSION_SECRET || "").length >= 32,
  );
}

// ---------- auth ----------
const sign = (payload) =>
  crypto.createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "").update(payload).digest("base64url");

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

function verifyPassword(password, stored) {
  const [scheme, saltHex, hashHex] = String(stored).split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const fails = new Map();

function clientKey(req) {
  return (
    req.headers["x-real-ip"] ||
    String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown"
  );
}
function isLockedOut(req) {
  const key = clientKey(req);
  const rec = fails.get(key);
  if (!rec) return false;
  if (Date.now() - rec.first > LOCK_MS) {
    fails.delete(key);
    return false;
  }
  return rec.count >= MAX_FAILS;
}
function recordFailure(req) {
  const key = clientKey(req);
  const rec = fails.get(key);
  if (!rec || Date.now() - rec.first > LOCK_MS) fails.set(key, { count: 1, first: Date.now() });
  else rec.count += 1;
}

function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function isAuthenticated(req) {
  if (!authConfigured()) return false;
  const token = parseCookies(req)[COOKIE];
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  if (!safeEqual(token.slice(i + 1), sign(payload))) return false;
  return Number(payload.split(".")[0]) > Date.now();
}

const sessionCookie = (value, maxAgeSec) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}${SECURE_COOKIE ? "; Secure" : ""}`;

// ---------- promo data ----------
const istDateOf = (d) => new Date(d.getTime() + 330 * 60_000).toISOString().slice(0, 10);

/** Games (slug + display name, in site order) come from the site source. */
function siteGames() {
  let src = "";
  try {
    src = fs.readFileSync(path.join(SITE_ROOT, "src", "data", "games.ts"), "utf8");
  } catch {
    /* none */
  }
  const out = [];
  for (const m of src.matchAll(/"slug":\s*"([^"]+)",\s*"name":\s*"((?:[^"\\]|\\.)*)"/g)) {
    let name = m[2];
    try {
      name = JSON.parse('"' + m[2] + '"');
    } catch {
      /* keep raw */
    }
    out.push({ slug: m[1], name });
  }
  return out;
}

function readStored() {
  try {
    const j = JSON.parse(fs.readFileSync(MASTER_FILE, "utf8"));
    if (j && typeof j === "object" && j.codes && typeof j.codes === "object") return j;
  } catch {
    /* fall through */
  }
  return { date: istDateOf(new Date()), updatedAt: new Date().toISOString(), codes: {} };
}

function ensureMaster() {
  if (fs.existsSync(MASTER_FILE)) return;
  fs.mkdirSync(path.dirname(MASTER_FILE), { recursive: true });
  // Prefer what is live right now so nothing already published is lost.
  const seed = fs.existsSync(LIVE_FILE) ? fs.readFileSync(LIVE_FILE, "utf8") : null;
  try {
    if (seed && JSON.parse(seed).codes) {
      fs.writeFileSync(MASTER_FILE, seed);
      return;
    }
  } catch {
    /* fall through */
  }
  fs.writeFileSync(MASTER_FILE, JSON.stringify(readStored(), null, 1));
}

function readSheet() {
  ensureMaster();
  const stored = readStored();
  const games = siteGames();
  const known = new Set(games.map((g) => g.slug));
  const extras = Object.keys(stored.codes).filter((s) => !known.has(s)).map((s) => ({ slug: s, name: s }));
  const platforms = [...games, ...extras].map((g) => {
    const c = stored.codes[g.slug] || {};
    return {
      slug: g.slug,
      name: g.name,
      hasCard: true,
      morning: c.morning || "",
      afternoon: c.afternoon || "",
      evening: c.evening || "",
    };
  });
  const anyCode = platforms.some((p) => p.morning || p.afternoon || p.evening);
  const today = istDateOf(new Date());
  let liveInSync = true;
  try {
    liveInSync = fs.readFileSync(LIVE_FILE, "utf8") === fs.readFileSync(MASTER_FILE, "utf8");
  } catch {
    liveInSync = false;
  }
  return {
    platforms,
    savedAt: stored.updatedAt,
    today,
    savedOn: stored.date,
    stale: anyCode && stored.date !== today,
    liveInSync,
  };
}

function codeProblem(value, unchanged) {
  if (!value) return null;
  if (value.length > MAX_CODE_LENGTH) return `longer than ${MAX_CODE_LENGTH} characters`;
  if (/[\u0000-\u001f\u007f]/.test(value)) return "contains a control character";
  return null;
}

function validate(list, existing) {
  const errors = [];
  const rows = [];
  const allowed = new Set([...siteGames().map((g) => g.slug), ...existing.keys()]);
  if (!Array.isArray(list) || list.length === 0 || list.length > 400) {
    return { rows, errors: ["Platform list is missing or too long."] };
  }
  const seen = new Set();
  for (const p of list) {
    const slug = String((p && p.slug) || "");
    if (!allowed.has(slug) || seen.has(slug)) {
      errors.push(`Unknown or duplicate platform: ${slug.slice(0, 40)}`);
      continue;
    }
    seen.add(slug);
    const prev = existing.get(slug);
    const row = { slug };
    for (const slot of ["morning", "afternoon", "evening"]) {
      const v = String((p && p[slot]) || "").trim();
      const problem = codeProblem(v, Boolean(prev) && prev[slot] === v);
      if (problem) errors.push(`${p.name || slug} — ${slot}: ${problem}`);
      row[slot] = v;
    }
    rows.push(row);
  }
  return { rows, errors };
}

/** The file the site fetches: only games that have at least one code. */
function serialize(rows) {
  const codes = {};
  for (const r of rows) {
    const c = {};
    for (const slot of ["morning", "afternoon", "evening"]) if (r[slot]) c[slot] = r[slot];
    if (Object.keys(c).length) codes[r.slug] = c;
  }
  return (
    JSON.stringify({ date: istDateOf(new Date()), updatedAt: new Date().toISOString(), codes }, null, 1) + "\n"
  );
}

function backupCurrent() {
  try {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    fs.copyFileSync(MASTER_FILE, path.join(BACKUP_DIR, `promo-live-${stamp}.json`));
    const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.startsWith("promo-live-")).sort();
    for (const f of files.slice(0, Math.max(0, files.length - 60))) fs.unlinkSync(path.join(BACKUP_DIR, f));
  } catch (err) {
    console.warn("backup failed:", err.message);
  }
}

function atomicWrite(file, content) {
  const tmp = `${file}.tmp`;
  let mode = 0o644;
  let owner = null;
  try {
    const st = fs.statSync(file);
    mode = st.mode & 0o777;
    owner = { uid: st.uid, gid: st.gid };
  } catch {
    /* new file */
  }
  fs.writeFileSync(tmp, content, { encoding: "utf8", mode });
  if (owner && typeof process.getuid === "function" && process.getuid() === 0) {
    try {
      fs.chownSync(tmp, owner.uid, owner.gid);
    } catch {
      /* best effort */
    }
  }
  fs.renameSync(tmp, file);
}

/** Writes the master (durable) and the live file (served). Returns a status for the UI. */
function writeSheet(rows) {
  ensureMaster();
  backupCurrent();
  const content = serialize(rows);
  atomicWrite(MASTER_FILE, content);
  try {
    if (!fs.existsSync(path.dirname(LIVE_FILE))) {
      return { ok: false, message: "Saved, but dist/ was not found — the live file was not updated." };
    }
    atomicWrite(LIVE_FILE, content);
    return { ok: true };
  } catch (err) {
    console.warn("live write failed:", err.message);
    return { ok: false, message: "Saved, but the live file could not be updated." };
  }
}

// ---------- http helpers ----------
const SECURITY_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "same-origin",
  "Content-Security-Policy":
    "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
};

function send(res, status, body, type = "text/html; charset=utf-8", extra = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, "Content-Type": type, ...extra });
  res.end(body);
}
const sendJson = (res, status, obj) => send(res, status, JSON.stringify(obj), "application/json; charset=utf-8");
const redirect = (res, to, extra = {}) => {
  res.writeHead(303, { ...SECURITY_HEADERS, Location: to, ...extra });
  res.end();
};

function readBody(req, limit = 200_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("Body too large"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// ---------- pages ----------
const PAGE_STYLE = `
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,Segoe UI,Arial,sans-serif;background:#f1f5f9;color:#0f172a}
header{background:#0f172a;color:#fff}.bar{max-width:1150px;margin:0 auto;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px}
.bar b span{color:#67e8f9}button,input{font:inherit}main{max-width:1150px;margin:0 auto;padding:20px 16px 90px}
.btn{min-height:40px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;color:#334155;padding:0 14px;cursor:pointer;font-weight:600}
.btn:disabled{opacity:.5;cursor:default}.btn-primary{background:#4f46e5;border-color:#4f46e5;color:#fff}.btn-dark{background:transparent;border-color:#ffffff55;color:#fff;min-height:36px}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:14px}.toolbar{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
.toolbar label{font-size:14px;font-weight:600;color:#334155;flex:1;min-width:180px}.toolbar input{display:block;width:100%;min-height:40px;margin-top:4px;border:1px solid #cbd5e1;border-radius:8px;padding:0 10px}
.muted{font-size:12px;color:#64748b}.grid{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.grid li.changed{border-color:#f59e0b;box-shadow:0 0 0 1px #fcd34d}.grid h2{font-size:14px;margin:0 0 8px}.slot{display:flex;align-items:center;gap:8px;margin-top:6px}
.slot span{width:76px;font-size:12px;font-weight:600;color:#64748b;flex:none}.slot input{flex:1;min-width:0;min-height:40px;border:1px solid #cbd5e1;border-radius:6px;padding:0 8px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px}
.warn{background:#fffbeb;border:1px solid #fcd34d;color:#78350f;border-radius:10px;padding:12px;margin-bottom:14px;font-size:14px}
.err{color:#b91c1c;font-size:14px}.ok{color:#047857;font-weight:600;font-size:14px}
.save{position:fixed;left:0;right:0;bottom:0;background:#fffffff2;border-top:1px solid #e2e8f0;padding:12px 16px}.save>div{max-width:1150px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.login{max-width:360px;margin:60px auto;padding:0 16px}.login label{display:block;font-size:14px;font-weight:600;margin-top:14px}
.login input{display:block;width:100%;min-height:44px;margin-top:4px;border:1px solid #cbd5e1;border-radius:8px;padding:0 10px}
`;

const shell = (title, inner, authed) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>${esc(title)}</title><style>${PAGE_STYLE}</style></head><body>
<header><div class="bar"><b>UonoVoucher <span>Admin</span></b>${
  authed ? '<form method="post" action="/logout"><button class="btn btn-dark" type="submit">Log out</button></form>' : ""
}</div></header>${inner}</body></html>`;

function loginPage(error, username = "") {
  const body = authConfigured()
    ? `<form method="post" action="/login" autocomplete="on">
<label>Username<input name="username" autocomplete="username" required value="${esc(username)}"></label>
<label>Password<input name="password" type="password" autocomplete="current-password" required></label>
${error ? `<p class="err" role="alert">${esc(error)}</p>` : ""}
<button class="btn btn-primary" style="width:100%;margin-top:18px;min-height:44px" type="submit">Log in</button></form>`
    : `<p class="warn">Admin login is not configured on this server. Set ADMIN_USERNAME, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET (see scripts/promo-admin/README.md), then restart.</p>`;
  return shell(
    "Admin log in — UonoVoucher",
    `<div class="login"><h1 style="margin:0 0 4px;font-size:24px">Admin log in</h1><p class="muted">Restricted area. Authorised administrators only.</p>${body}</div>`,
    false,
  );
}

const editorPage = () =>
  shell(
    "Promo codes — UonoVoucher Admin",
    `<main><h1 style="margin:0;font-size:24px">Daily promo codes</h1>
<p class="muted" style="font-size:14px">Enter each platform's Morning / Afternoon / Evening code, then press Save. Changes appear on
<a href="${esc(PUBLIC_URL)}/promo-codes/" target="_blank" rel="noopener noreferrer">${esc(PUBLIC_URL.replace("https://", ""))}/promo-codes/</a> straight away (no rebuild). Empty boxes show "Awaiting release".</p>
<div id="app" class="muted">Loading…</div></main><script src="/app.js"></script>`,
    true,
  );

// ---------- browser app (served at /app.js so CSP can forbid inline scripts) ----------
const APP_JS = `(function () {
  var SLOTS = [["morning", "Morning"], ["afternoon", "Afternoon"], ["evening", "Evening"]];
  var app = document.getElementById("app");
  var data, saved, pending = false, result = null, query = "";
  var el = function (tag, props, kids) {
    var n = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (props[k] == null) return;
      if (k === "class") n.className = props[k];
      else if (k === "text") n.textContent = props[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), props[k]);
      else n.setAttribute(k, props[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  };
  var clone = function (p) { return p.map(function (x) { return { slug: x.slug, name: x.name, hasCard: x.hasCard, morning: x.morning, afternoon: x.afternoon, evening: x.evening }; }); };
  var rowDirty = function (a, b) { return !b || a.morning !== b.morning || a.afternoon !== b.afternoon || a.evening !== b.evening; };
  function dirtyCount() {
    var by = {}; saved.forEach(function (s) { by[s.slug] = s; });
    return data.platforms.filter(function (p) { return rowDirty(p, by[p.slug]); }).length;
  }
  function api(path, body) {
    return fetch(path, { method: "POST", headers: { "Content-Type": "application/json", "X-Requested-With": "promo-admin" }, body: JSON.stringify(body || {}) })
      .then(function (r) { if (r.status === 401) { location.href = "/login"; throw new Error("auth"); } return r.json(); });
  }
  function finish(r) {
    pending = false; result = r;
    if (r.ok) { data.stale = false; data.liveInSync = !r.live || r.live.ok; saved = clone(data.platforms); }
    render();
  }
  function save() { pending = true; render(); api("/api/save", { platforms: data.platforms }).then(finish).catch(function () { pending = false; render(); }); }
  function newDay() {
    if (!confirm("Start a new day? This clears ALL codes for every platform.")) return;
    pending = true; render();
    api("/api/new-day").then(function (r) { if (r.ok) data.platforms.forEach(function (p) { p.morning = p.afternoon = p.evening = ""; }); finish(r); });
  }
  function render() {
    var dirty = dirtyCount();
    var filled = data.platforms.filter(function (p) { return p.morning || p.afternoon || p.evening; }).length;
    var by = {}; saved.forEach(function (s) { by[s.slug] = s; });
    var children = [];
    var items = [];
    if (data.stale) children.push(el("div", { class: "warn", role: "status" }, [
      "These codes were last saved on ", el("b", { text: data.savedOn }), " but today is ", el("b", { text: data.today }),
      " (IST). Visitors may be seeing old codes — press ", el("b", { text: "Start new day" }), " to clear them."]));
    if (data.liveInSync === false) children.push(el("div", { class: "warn" }, ["The live file on the website differs from the saved master copy (a rebuild may have reset it). Press Save changes to publish the saved codes again."]));
    children.push(el("div", { class: "card toolbar" }, [
      el("label", {}, ["Find a platform", el("input", { type: "search", value: query, oninput: function (e) { query = e.target.value.toLowerCase(); filterList(); }, placeholder: "e.g. win rummy" })]),
      el("button", { class: "btn", type: "button", disabled: pending ? "disabled" : null, onclick: newDay, text: "Start new day" }),
      el("p", { class: "muted", style: "width:100%;margin:0", text: filled + " of " + data.platforms.length + " platforms have a code" }),
    ]));
    var list = el("ul", { class: "grid" });
    data.platforms.forEach(function (p) {
      var li = el("li", { class: "card" + (rowDirty(p, by[p.slug]) ? " changed" : "") }, [el("h2", { text: p.name })]);
      SLOTS.forEach(function (s) {
        li.appendChild(el("label", { class: "slot" }, [el("span", { text: s[1] }), el("input", {
          type: "text", value: p[s[0]], maxlength: "40", autocomplete: "off", autocapitalize: "off", spellcheck: "false", placeholder: "Not released yet",
          oninput: function (e) { p[s[0]] = e.target.value; li.className = "card" + (rowDirty(p, by[p.slug]) ? " changed" : ""); status(); }
        })]));
      });
      if (!p.hasCard) li.appendChild(el("p", { class: "muted", style: "color:#b45309", text: "No card for this platform on the site yet — codes won't show until one is added." }));
      items.push({ li: li, text: (p.name + " " + p.slug).toLowerCase() });
      list.appendChild(li);
    });
    function filterList() { items.forEach(function (it) { it.li.hidden = Boolean(query) && it.text.indexOf(query) < 0; }); }
    filterList();
    children.push(list);
    var statusEl = el("span", { class: "muted", style: "font-size:14px", "aria-live": "polite" });
    function status() { var d = dirtyCount(); statusEl.textContent = d ? d + " platform" + (d === 1 ? "" : "s") + " changed — not saved yet" : "All changes saved"; saveBtn.disabled = pending || !d; }
    var saveBtn = el("button", { class: "btn btn-primary", type: "button", onclick: save, text: pending ? "Saving…" : "Save changes" });
    var bar = el("div", {}, [saveBtn, statusEl]);
    if (result && result.ok && !dirty) bar.appendChild(el("span", { class: "ok", role: "status", text: "✓ Saved — " + result.count + " platform" + (result.count === 1 ? "" : "s") + " with codes live" + (result.live && !result.live.ok ? " (" + result.live.message + ")" : "") }));
    var save2 = el("div", { class: "save" }, [bar]);
    if (result && !result.ok) {
      var ul = el("ul", { class: "err", role: "alert", style: "margin:8px auto 0;max-width:1150px" });
      (result.errors || ["Save failed."]).forEach(function (e) { ul.appendChild(el("li", { text: e })); });
      save2.appendChild(ul);
    }
    children.push(save2);
    app.textContent = ""; children.forEach(function (c) { app.appendChild(c); });
    status();
  }
  window.addEventListener("beforeunload", function (e) { if (data && dirtyCount()) e.preventDefault(); });
  fetch("/api/sheet", { headers: { "X-Requested-With": "promo-admin" } })
    .then(function (r) { if (r.status === 401) { location.href = "/login"; throw new Error("auth"); } return r.json(); })
    .then(function (d) { data = d; saved = clone(d.platforms); render(); })
    .catch(function (e) { if (e.message !== "auth") app.textContent = "Could not load the promo sheet."; });
})();`;

// ---------- routing ----------
async function handle(req, res) {
  const url = new URL(req.url, "http://localhost");
  const route = `${req.method} ${url.pathname}`;

  if (route === "GET /robots.txt") return send(res, 200, "User-agent: *\nDisallow: /\n", "text/plain");
  if (route === "GET /healthz") return send(res, 200, "ok", "text/plain");

  if (route === "GET /login") return isAuthenticated(req) ? redirect(res, "/") : send(res, 200, loginPage());
  if (route === "POST /login") {
    if (!sameOrigin(req)) return send(res, 403, "Forbidden", "text/plain");
    if (isLockedOut(req)) return send(res, 429, loginPage("Too many failed attempts. Try again in 15 minutes."));
    const form = new URLSearchParams(await readBody(req, 10_000));
    const username = form.get("username") || "";
    const password = form.get("password") || "";
    if (!authConfigured()) return send(res, 200, loginPage());
    const passOk = verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);
    const userOk = safeEqual(username, process.env.ADMIN_USERNAME);
    if (!(passOk && userOk)) {
      recordFailure(req);
      return send(res, 401, loginPage("Incorrect username or password.", username));
    }
    fails.delete(clientKey(req));
    const payload = `${Date.now() + SESSION_MS}.${crypto.randomBytes(12).toString("base64url")}`;
    return redirect(res, "/", { "Set-Cookie": sessionCookie(`${payload}.${sign(payload)}`, SESSION_MS / 1000) });
  }
  if (route === "POST /logout") {
    if (!sameOrigin(req)) return send(res, 403, "Forbidden", "text/plain");
    return redirect(res, "/login", { "Set-Cookie": sessionCookie("", 0) });
  }

  if (!isAuthenticated(req)) {
    if (url.pathname.startsWith("/api/")) return sendJson(res, 401, { ok: false, errors: ["Not logged in."] });
    return redirect(res, "/login");
  }

  if (route === "GET /" || route === "GET /promo-codes") return send(res, 200, editorPage());
  if (route === "GET /app.js") return send(res, 200, APP_JS, "application/javascript; charset=utf-8");

  if (url.pathname.startsWith("/api/")) {
    if (req.headers["x-requested-with"] !== "promo-admin" || !sameOrigin(req)) {
      return sendJson(res, 403, { ok: false, errors: ["Forbidden."] });
    }
    if (route === "GET /api/sheet") return sendJson(res, 200, readSheet());

    if (route === "POST /api/save" || route === "POST /api/new-day") {
      const current = readSheet().platforms;
      let rows;
      if (route === "POST /api/new-day") {
        rows = current.map((p) => ({ slug: p.slug, morning: "", afternoon: "", evening: "" }));
      } else {
        let body;
        try {
          body = JSON.parse(await readBody(req));
        } catch {
          return sendJson(res, 400, { ok: false, errors: ["Invalid request."] });
        }
        const existing = new Map(current.map((p) => [p.slug, p]));
        const v = validate(body.platforms, existing);
        if (v.errors.length) return sendJson(res, 200, { ok: false, errors: v.errors });
        rows = v.rows;
      }
      const live = writeSheet(rows);
      return sendJson(res, 200, {
        ok: true,
        savedAt: new Date().toISOString(),
        count: rows.filter((r) => r.morning || r.afternoon || r.evening).length,
        live,
      });
    }
  }
  return send(res, 404, "Not found", "text/plain");
}

// Always start: under PM2, require.main is PM2's own wrapper, so a `require.main === module`
// guard would leave the process "online" but never listening.
if (!process.env.PROMO_ADMIN_NO_LISTEN) {
  if (!authConfigured()) console.warn("[promo-admin] ADMIN_* settings missing — login is disabled.");
  http
    .createServer((req, res) => {
      handle(req, res).catch((err) => {
        console.error(err);
        if (!res.headersSent) send(res, 500, "Server error", "text/plain");
      });
    })
    .listen(PORT, "127.0.0.1", () =>
      console.log(`[promo-admin] http://127.0.0.1:${PORT}  master=${MASTER_FILE}  live=${LIVE_FILE}`),
    );
}

module.exports = { readSheet, serialize, siteGames };

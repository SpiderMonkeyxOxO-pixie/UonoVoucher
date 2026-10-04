# Promo-code admin — code.uonovoucher.com

A dependency-free Node server (`server.cjs`, Node 18+) for the daily
Morning / Afternoon / Evening promo codes. Single admin, no sign-up.

## How it works

UonoVoucher is a prerendered SPA: its built-in promo records are fixed at build
time. The admin writes **today's codes** to `/promo-live.json`; the site fetches
that file in the browser on every load and merges the codes over the built-in
records on the **homepage tracker, /promo-codes/, and each game page**
(`src/data/livePromo.ts`). No rebuild is needed — saves are live immediately.

- Games with live codes sort first and show status "Reported", checked on the save date.
  Games without live codes keep their built-in record unchanged.
- Each game can have up to three codes (AM / PM / Eve tabs).
- `npm run build` empties `dist/`, so the admin keeps a **master copy outside the
  repo** (`/www/wwwroot/uonovoucher-admin-data/promo-live.json`). The npm
  `postbuild` hook (`restore.cjs`) copies it back after every build, including
  the daily 07:45 cron rebuild.
- The build-time prerender ignores live codes (it skips the fetch for automated
  browsers), so static HTML snapshots never contain a stale day's codes.

## One-time setup (on the VPS)

1. **DNS (Cloudflare):** A record `code` -> same IP as uonovoucher.com.
2. **Deploy the code** (same as your cron job):
   ```
   cd /www/wwwroot/uonovoucher.com && git fetch origin && git reset --hard origin/main && npm run build
   ```
3. **Settings file OUTSIDE the repo** (replace the password, keep the single quotes):
   ```
   node -e "const c=require('crypto');const s=c.randomBytes(16);console.log('ADMIN_PASSWORD_HASH=scrypt:'+s.toString('hex')+':'+c.scryptSync(process.argv[1],s,64).toString('hex'));console.log('ADMIN_SESSION_SECRET='+c.randomBytes(32).toString('base64url'))" 'your-long-password' > /tmp/new.env
   (echo "ADMIN_USERNAME=Admin"; echo "PORT=3150"; cat /tmp/new.env) > /www/wwwroot/uonovoucher-admin.env
   rm /tmp/new.env; chmod 600 /www/wwwroot/uonovoucher-admin.env; history -c
   ```
4. **Start it:**
   ```
   ss -tlnp | grep 3150          # should print nothing (port free)
   pm2 start scripts/promo-admin/server.cjs --name uonovoucher-admin
   pm2 save
   sleep 2; curl -s http://127.0.0.1:3150/healthz; echo     # -> ok
   ```
5. **aaPanel:** add site `code.uonovoucher.com` (static) -> Reverse proxy: dir `/`,
   target `http://127.0.0.1:3150`, Sent Domain `$host`, **cache OFF**; then SSL
   (Let's Encrypt) + Force HTTPS.

If the website's files are served from a folder other than
`/www/wwwroot/uonovoucher.com/dist`, set `PROMO_LIVE=/that/path/promo-live.json`
in the settings file and restart with `pm2 restart uonovoucher-admin --update-env`.

## Daily use

Log in at https://code.uonovoucher.com -> type codes into Morning / Afternoon /
Evening -> **Save changes**. **Start new day** clears all live codes (the built-in
records show again). A warning appears if the saved codes are from an earlier day.

## Notes

- Platforms come from `src/data/games.ts` (58 games). Newly typed codes that look like a
  link/domain are rejected.
- Each save backs up the previous master to `/www/wwwroot/uonovoucher-admin-data/backups/` (last 60 kept).
- 5 failed logins from one IP locks that IP out for 15 minutes; sessions last 8 h.

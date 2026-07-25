import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execSync } from 'node:child_process';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const SITE_URL = 'https://uonovoucher.com';

function getRoutesFromSitemap() {
  const xml = readFileSync(join(distDir, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return locs.map((loc) => {
    const path = loc.replace(SITE_URL, '') || '/';
    return path.startsWith('/') ? path : `/${path}`;
  });
}

function outputPathFor(route) {
  if (route === '/') return join(distDir, 'index.html');
  const clean = route.endsWith('/') ? route.slice(0, -1) : route;
  return join(distDir, clean.slice(1), 'index.html');
}

function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      fetch(url)
        .then(() => resolve())
        .catch(() => {
          if (Date.now() > deadline) reject(new Error(`Server at ${url} did not start within ${timeoutMs}ms`));
          else setTimeout(tryOnce, 200);
        });
    };
    tryOnce();
  });
}

function killServer(server) {
  if (!server.pid) return;
  try {
    if (process.platform === 'win32') {
      // spawn(..., { shell: true }) on Windows wraps the real process (vite preview)
      // inside a cmd.exe shell; server.kill() only signals that wrapper and leaves
      // the actual server running, so the build hangs forever. /T kills the tree.
      execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' });
    } else {
      // Negative PID targets the whole process group (requires detached: true below).
      process.kill(-server.pid, 'SIGKILL');
    }
  } catch {
    // Process may have already exited — nothing to do.
  }
}

async function main() {
  const routes = getRoutesFromSitemap();
  console.log(`Prerendering ${routes.length} routes...`);

  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: root,
    stdio: 'pipe',
    shell: true,
    detached: process.platform !== 'win32',
  });
  server.on('error', (err) => {
    console.error('Failed to start preview server:', err);
    process.exit(1);
  });

  let succeeded = 0;
  let failed = [];

  try {
    await waitForServer(BASE + '/', 20000);

    // Batch with a fresh browser per batch — a long-lived single browser navigating
    // 100+ pages back-to-back hits a resource ceiling in some sandboxed environments
    // and starts failing with ERR_INSUFFICIENT_RESOURCES partway through.
    const BATCH_SIZE = 12;
    for (let i = 0; i < routes.length; i += BATCH_SIZE) {
      const batch = routes.slice(i, i + BATCH_SIZE);
      const browser = await chromium.launch();
      const page = await browser.newPage();

      for (const route of batch) {
        try {
          await page.goto(BASE + route, { waitUntil: 'load', timeout: 20000 });
          await page.waitForTimeout(250);
          const html = await page.content();
          const outPath = outputPathFor(route);
          mkdirSync(dirname(outPath), { recursive: true });
          writeFileSync(outPath, html);
          succeeded++;
        } catch (err) {
          failed.push({ route, error: String(err).split('\n')[0] });
        }
      }

      await browser.close();
    }
  } finally {
    killServer(server);
  }

  console.log(`Prerendered ${succeeded}/${routes.length} routes.`);
  if (failed.length > 0) {
    console.warn(`Failed (${failed.length}):`);
    for (const f of failed) console.warn(`  ${f.route} — ${f.error}`);
  }
  if (succeeded === 0) {
    console.error('No routes were prerendered successfully — failing the build.');
    process.exit(1);
  }
}

main();

import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3210);
// Chromium projects use the locally installed Google Chrome, so they need no download. Set
// E2E_CHANNEL="" to use Playwright's bundled Chromium instead (`npx playwright install chromium`).
// WebKit and Firefox always use Playwright's builds: `npx playwright install webkit firefox`.
const channel = process.env.E2E_CHANNEL ?? "chrome";
const chrome = { channel: channel || undefined };
const desktopViewport = { width: 1440, height: 900 };

// Project names end in their kind (desktop, mobile, reduced-motion); tests gate on that suffix.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  // One retry everywhere: many parallel Chrome launches occasionally time out locally. Retried tests are
  // still reported as "flaky", so real instability stays visible.
  retries: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  // Serves the production build: run `npm run build` first (the test:e2e script does).
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: "chrome-desktop", use: { ...devices["Desktop Chrome"], ...chrome, viewport: desktopViewport } },
    { name: "chrome-mobile", use: { ...devices["Pixel 7"], ...chrome, viewport: { width: 390, height: 844 } } },
    { name: "chrome-reduced-motion", use: { ...devices["Desktop Chrome"], ...chrome, viewport: desktopViewport, reducedMotion: "reduce" } },
    { name: "webkit-desktop", use: { ...devices["Desktop Safari"], viewport: desktopViewport } },
    { name: "webkit-mobile", use: { ...devices["iPhone 14"] } },
    { name: "firefox-desktop", use: { ...devices["Desktop Firefox"], viewport: desktopViewport } },
  ],
});

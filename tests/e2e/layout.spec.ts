import { expect, test } from "@playwright/test";
import { projectKind, routes } from "./helpers";

const widths = [320, 390, 768, 1024, 1440];

test.describe("no horizontal overflow or clipped text", () => {
  // Runs on every desktop engine: text metrics differ between Chrome, Safari and Firefox.
  test.beforeEach(({}, testInfo) => test.skip(projectKind(testInfo.project.name) !== "desktop", "viewport sweep runs on desktop projects"));

  for (const width of widths) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(route);
        const total = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < total; y += 600) await page.evaluate((top) => scrollTo(0, top), y);
        const problems = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const skip = ".custom-cursor, .page-wipe, dialog, [data-statement-line], [data-gallery-mode='horizontal'] [data-gallery-track], .sr-only, .skip-link";
          const clipped = [...document.querySelectorAll("h1, h2, h3, p, a, button, label, dd, figcaption, li > span")]
            .filter((el) => !el.closest(skip))
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.width > 0 && (r.right > vw + 1 || r.left < -1))
            .map(({ el }) => `${el.tagName} "${el.textContent?.trim().slice(0, 30)}"`);
          // scrollbar-gutter can make this negative; only positive values are overflow.
          return { overflow: Math.max(0, document.documentElement.scrollWidth - vw), clipped };
        });
        expect(problems, `${route} at ${width}px`).toEqual({ overflow: 0, clipped: [] });
      }
    });
  }
});

test("page metadata is unique and crawl files exist", async ({ page, request }) => {
  test.skip(test.info().project.name !== "chrome-desktop", "engine-independent, runs once");
  const titles = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle, route).toBeTruthy();
    titles.add(ogTitle!);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S{20,}|.{40,}/);
    const ids = await page.evaluate(() => [...document.querySelectorAll("[id]")].map((el) => el.id));
    expect(ids.length, `duplicate ids on ${route}`).toBe(new Set(ids).size);
    expect(await page.locator("img:not([alt])").count(), route).toBe(0);
  }
  expect(titles.size).toBe(routes.length);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const route of routes) expect(sitemap).toContain(route === "/" ? "</loc>" : `${route}</loc>`);
  expect(sitemap.match(/<loc>/g)?.length).toBe(routes.length);
});

import { expect, test } from "@playwright/test";
import { expectNoOverlay, projectKind } from "./helpers";

test.describe("desktop motion", () => {
  test.beforeEach(({}, testInfo) => test.skip(projectKind(testInfo.project.name) !== "desktop", "desktop only"));

  test("work gallery is horizontal, unclipped at both ends, and keyboard reachable", async ({ page }) => {
    await page.goto("/work");
    const section = page.locator("section", { has: page.locator("[data-gallery-track]") });
    await expect(section).toHaveAttribute("data-gallery-mode", "horizontal");

    const geometry = () =>
      page.evaluate(() => {
        const panels = [...document.querySelectorAll("[data-gallery-panel]")].map((panel) => panel.getBoundingClientRect());
        return { first: panels[0].left, last: panels.at(-1)!.right, width: document.documentElement.clientWidth };
      });
    const start = await page.evaluate(() => document.querySelector(".pin-spacer")!.getBoundingClientRect().top + scrollY);
    await page.evaluate((y) => scrollTo(0, y), start);
    await expect.poll(async () => (await geometry()).first).toBeGreaterThan(0);

    const distance = await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>("[data-gallery-track]")!;
      return track.scrollWidth - document.documentElement.clientWidth;
    });
    await page.evaluate((y) => scrollTo(0, y), start + distance);
    await expect.poll(async () => { const g = await geometry(); return g.width - g.last; }, { timeout: 4000 }).toBeGreaterThan(0);

    await page.evaluate(() => scrollTo(0, 0));
    for (const title of ["Rift / Apparel", "Frequency / Festival", "Mono / Objects", "Signal / Culture"]) {
      const link = page.getByRole("link", { name: `View case study for ${title}` });
      await link.focus();
      await expect(link).toBeInViewport({ ratio: 1, timeout: 4000 });
    }
  });

  test("custom cursor labels project links without blocking clicks", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/has-custom-cursor/);
    const card = page.locator('[data-scroll-section="work"] a[data-cursor="view"]').first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await expect(page.locator(".custom-cursor__label")).toHaveText("View project");
    await card.click();
    await expect(page).toHaveURL(/\/work\/rift$/);
    await expectNoOverlay(page);
  });

  test("magnetic CTA pulls toward the pointer and returns home", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: "Start a project" });
    await cta.scrollIntoViewIfNeeded();
    const box = (await cta.boundingBox())!;
    await page.mouse.move(box.x + box.width - 4, box.y + 4, { steps: 6 });
    await expect.poll(() => cta.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)).toBeGreaterThan(4);
    await page.mouse.move(box.x - 300, box.y - 200, { steps: 6 });
    await expect.poll(() => cta.evaluate((el) => getComputedStyle(el).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  });

  test("repeated navigation does not stack overlays or pinned sections", async ({ page }) => {
    await page.goto("/");
    for (let round = 0; round < 2; round++) {
      for (const name of ["Work", "Studio", "Contact"]) {
        await page.locator("header").getByRole("link", { name, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`/${name.toLowerCase()}$`));
        await expectNoOverlay(page);
        await expect(page.locator(".pin-spacer")).toHaveCount(name === "Work" ? 1 : 0);
      }
    }
  });
});

test.describe("touch devices", () => {
  test.beforeEach(({}, testInfo) => test.skip(projectKind(testInfo.project.name) !== "mobile", "mobile only"));

  test("no custom cursor, vertical gallery, and a working mobile menu", async ({ page }) => {
    await page.goto("/work");
    await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
    await expect(page.locator("[data-gallery-mode]")).toHaveCount(0);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await page.getByRole("button", { name: "Menu" }).tap();
    await page.getByRole("dialog").getByRole("link", { name: /Contact/ }).tap();
    await expect(page).toHaveURL(/\/contact$/);
    await expectNoOverlay(page);
  });
});

test.describe("reduced motion", () => {
  test.beforeEach(({}, testInfo) => test.skip(projectKind(testInfo.project.name) !== "reduced-motion", "reduced-motion only"));

  test("content is final immediately and nothing scroll-jacks", async ({ page }) => {
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.dataset.intro ?? null)).toBeNull();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);

    const maxWipe = await page.evaluate(async () => {
      const ink = document.querySelector('[data-wipe="ink"]')!;
      let max = 0;
      const sample = setInterval(() => { max = Math.max(max, new DOMMatrix(getComputedStyle(ink).transform).d); }, 20);
      document.querySelector<HTMLAnchorElement>('header a[href="/work"]')!.click();
      await new Promise((resolve) => setTimeout(resolve, 1200));
      clearInterval(sample);
      return max;
    });
    await expect(page).toHaveURL(/\/work$/);
    expect(maxWipe).toBe(0);
    await expect(page.locator("[data-gallery-mode]")).toHaveCount(0);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);

    const words = await page.goto("/").then(() => page.locator("#manifesto-title [data-word]").evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity)));
    expect(new Set(words)).toEqual(new Set(["1"]));
  });
});

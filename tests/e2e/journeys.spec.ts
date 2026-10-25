import { expect, test } from "@playwright/test";
import { expectNoOverlay, projectKind, projects, trackConsoleErrors } from "./helpers";

test("homepage renders the hero and settles its entrance", async ({ page }) => {
  const assertNoErrors = trackConsoleErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("We don’t do ordinary.");
  await expect(page.getByRole("img", { name: /acid-lime ribbon sculpture/i })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.intro ?? "settled"), { timeout: 5000 }).toBe("settled");
  await expect(page.getByRole("link", { name: "Scroll" })).toBeVisible();
  assertNoErrors();
});

test("fullscreen menu: keyboard open, focus inside, Escape closes and restores focus", async ({ page }) => {
  await page.goto("/work");
  const trigger = page.getByRole("button", { name: "Menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
  await expect(page.locator("html")).toHaveClass(/is-scroll-locked/);

  for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("html")).not.toHaveClass(/is-scroll-locked/);
});

test("menu navigation closes the menu and lands on the route", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("dialog").getByRole("link", { name: /Studio/ }).click();
  await expect(page).toHaveURL(/\/studio$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Not here to fit in.");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expectNoOverlay(page);
});

test("every case study opens from Work and chains through Next project", async ({ page }) => {
  const assertNoErrors = trackConsoleErrors(page);
  await page.goto("/work");
  for (const project of projects) {
    // Keyboard activation works in every layout, including the pinned horizontal gallery.
    const link = page.getByRole("link", { name: `View case study for ${project.title}` });
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/work/${project.slug}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title, { ignoreCase: true });
    await expectNoOverlay(page);
    await page.goBack();
    await expect(page).toHaveURL(/\/work$/);
  }

  await page.goto("/work/rift");
  for (const next of ["frequency", "mono", "signal", "rift"]) {
    await page.getByRole("navigation", { name: "Next project" }).getByRole("link").click();
    await expect(page).toHaveURL(new RegExp(`/work/${next}$`));
    await expectNoOverlay(page);
  }
  assertNoErrors();
});

test("browser back and forward keep content and never leave an overlay", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /All projects/ }).click();
  await expect(page).toHaveURL(/\/work$/);
  await page.goto("/contact");
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Selected work.");
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("We don’t do ordinary.");
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Selected work.");
  await expectNoOverlay(page);
});

test("contact form validates, then confirms without sending anything", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => request.method() !== "GET" && writes.push(`${request.method()} ${request.url()}`));
  await page.goto("/contact");
  await page.getByRole("button", { name: "Check inquiry" }).click();

  await expect(page.getByText("Enter your name.")).toBeVisible();
  await expect(page.getByText("Enter an email address like name@studio.com.")).toBeVisible();
  await expect(page.getByText("Choose the kind of project.")).toBeVisible();
  await expect(page.getByLabel("Name")).toBeFocused();
  await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");

  await page.getByLabel("Name").fill("Test Person");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Project type").selectOption("Brand Identity");
  await page.getByLabel("Project description").fill("A test brief for a fictional label that needs an identity.");
  await page.getByRole("button", { name: "Check inquiry" }).click();

  const status = page.getByRole("status");
  await expect(status.getByRole("heading", { name: "Inquiry checked." })).toBeFocused();
  await expect(status).toContainText("nothing was sent, saved or stored");
  expect(writes).toEqual([]);
});

test("a service row opens the inquiry with that service preselected", async ({ page }) => {
  await page.goto("/studio");
  await page.getByRole("link", { name: /Brand Identity.*Start a Brand Identity inquiry/ }).click();
  await expect(page).toHaveURL(/\/contact\?type=Brand%20Identity$/);
  await expect(page.getByLabel("Project type")).toHaveValue("Brand Identity");
});

test("skip link moves focus to the main content", async ({ page, browserName }, testInfo) => {
  test.skip(projectKind(testInfo.project.name) === "mobile", "keyboard journey");
  await page.goto("/studio");
  // Safari's default keyboard setting skips links on Tab; Option+Tab is how its users reach them.
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("invalid project slugs return a real 404", async ({ page }) => {
  const response = await page.goto("/work/not-a-project");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Off the grid.");
});

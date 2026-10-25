import { expect, test, type Locator, type Page } from "@playwright/test";
import { projectKind, trackConsoleErrors } from "./helpers";

async function openArtifact(page: Page, slug: string, heading: string) {
  await page.goto(`/work/${slug}`);
  const section = page.locator('[data-scroll-section="artifact"]');
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByText("In the browser")).toBeVisible();
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(heading, { ignoreCase: true });
  return section;
}

const riftOpening = (section: Locator) =>
  section.locator("[data-rift-stage]").evaluate((el) => Number(getComputedStyle(el).getPropertyValue("--rift")));

/** Zero crossings of the central violet strand: about two per wave cycle, so slower tempos cross less. */
const ribbonCrossings = (section: Locator) =>
  section.locator("[data-tempo] path").nth(2).evaluate((path) => {
    const signs = [...path.getAttribute("d")!.matchAll(/[ML][\d.]+ ([\d.]+)/g)]
      .map((match) => Number(match[1]) - 240)
      .filter((y) => Math.abs(y) > 0.5)
      .map(Math.sign);
    return signs.slice(1).filter((sign, i) => sign !== signs[i]).length;
  });

const dashOffset = (section: Locator) => section.locator("[data-lamp-line]").evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset));

const markMatrix = (section: Locator) =>
  section.locator("[data-mark]").evaluate((el) => {
    const { a, b, e, f } = (el as SVGGElement).transform.baseVal.consolidate()!.matrix;
    // Quarter steps absorb GSAP's sub-pixel rounding; + 0 turns -0 into 0.
    return [a, b, e, f].map((n) => Math.round(n * 4) / 4 + 0);
  });

test.describe("case-study artifacts", () => {
  test("rift: the fracture opens and closes from the keyboard", async ({ page }) => {
    const assertNoErrors = trackConsoleErrors(page);
    const section = await openArtifact(page, "rift", "Open the rift.");
    await expect(section.getByRole("img", { name: /RIFT wordmark/ })).toBeVisible();

    const slider = section.getByRole("slider", { name: "Fracture" });
    await slider.focus();
    await page.keyboard.press("End");
    await expect(slider).toHaveAttribute("aria-valuetext", "100% open");
    await expect.poll(() => riftOpening(section)).toBe(1);
    await page.keyboard.press("Home");
    await expect(slider).toHaveAttribute("aria-valuetext", "0% open");
    await expect.poll(() => riftOpening(section)).toBe(0);
    assertNoErrors();
  });

  test("rift: a fine pointer pulls the fracture open near the break", async ({ page }, testInfo) => {
    test.skip(projectKind(testInfo.project.name) !== "desktop", "fine pointer with motion only");
    const section = await openArtifact(page, "rift", "Open the rift.");
    const slider = section.getByRole("slider", { name: "Fracture" });
    await slider.focus();
    await page.keyboard.press("Home");
    const box = (await section.locator("[data-rift-stage]").boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
    await expect(slider).toHaveAttribute("aria-valuetext", "100% open");
    await page.mouse.move(box.x + 8, box.y + box.height / 2, { steps: 4 });
    await expect(slider).toHaveAttribute("aria-valuetext", "0% open");
  });

  test("frequency: the tempo radio group reshapes the ribbon", async ({ page }) => {
    const assertNoErrors = trackConsoleErrors(page);
    const section = await openArtifact(page, "frequency", "Change the tempo.");
    const svg = section.getByRole("img", { name: /shaped by a tempo of 120 BPM/ });
    await expect(svg).toBeVisible();
    await expect(section.getByRole("radio", { name: "120" })).toBeChecked();

    await section.getByRole("radio", { name: "120" }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(section.getByRole("radio", { name: "90" })).toBeChecked();
    await expect(section.locator("[data-tempo]")).toHaveAttribute("data-tempo", "90");
    await expect.poll(() => ribbonCrossings(section)).toBeLessThanOrEqual(5);

    await section.getByText("174", { exact: true }).click();
    await expect(section.getByRole("radio", { name: "174" })).toBeChecked();
    await expect.poll(() => ribbonCrossings(section)).toBeGreaterThanOrEqual(8);
    assertNoErrors();
  });

  test("frequency: the loop can be paused", async ({ page }, testInfo) => {
    test.skip(projectKind(testInfo.project.name) === "reduced-motion", "the loop only exists with motion");
    const section = await openArtifact(page, "frequency", "Change the tempo.");
    const pause = section.getByRole("button", { name: "Pause motion" });
    await pause.focus();
    await page.keyboard.press("Enter");
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    const path = section.locator("[data-tempo] path").first();
    const before = await path.getAttribute("d");
    await page.waitForTimeout(400);
    expect(await path.getAttribute("d")).toBe(before);
  });

  test("mono: the line draws in and the light toggles from the keyboard", async ({ page }) => {
    const assertNoErrors = trackConsoleErrors(page);
    const section = await openArtifact(page, "mono", "One line, one light.");
    const drawing = section.getByRole("img", { name: /one continuous line/ });
    await drawing.scrollIntoViewIfNeeded();
    await page.evaluate(() => scrollBy(0, 300));
    await expect.poll(() => dashOffset(section)).toBe(0);
    await expect(section.getByRole("listitem")).toHaveCount(3);

    const light = section.getByRole("button", { name: "Light" });
    await expect(light).toHaveAttribute("aria-pressed", "true");
    await light.focus();
    await page.keyboard.press("Space");
    await expect(light).toHaveAttribute("aria-pressed", "false");
    await expect.poll(() => section.locator("[data-lamp-glow]").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    assertNoErrors();
  });

  test("signal: crop, rotate and scale all move the mark from the keyboard", async ({ page }) => {
    const assertNoErrors = trackConsoleErrors(page);
    const section = await openArtifact(page, "signal", "Flex the mark.");
    await expect(section.getByRole("img", { name: /SIGNAL mark/ })).toBeVisible();

    await section.getByRole("radio", { name: "Whole" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(section.getByRole("radio", { name: "Edge" })).toBeChecked();

    await section.getByRole("button", { name: "Rotate 90°" }).focus();
    await page.keyboard.press("Enter");
    await expect(section.getByRole("status")).toHaveText("Rotation 90°");

    await section.getByRole("slider", { name: "Scale" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(section.getByRole("slider", { name: "Scale" })).toHaveAttribute("aria-valuetext", "125%");

    // Edge crop (x 150), a quarter turn and 125% scale, all about the tile centre.
    await expect.poll(() => markMatrix(section)).toEqual([0, 1.25, 600, -50]);
    assertNoErrors();
  });
});

test.describe("case-study artifacts with reduced motion", () => {
  test.beforeEach(({}, testInfo) => test.skip(projectKind(testInfo.project.name) !== "reduced-motion", "reduced-motion only"));

  test("every artifact shows its final static state and nothing moves on its own", async ({ page }) => {
    const rift = await openArtifact(page, "rift", "Open the rift.");
    await page.evaluate(() => scrollBy(0, 400));
    await page.waitForTimeout(300);
    expect(await riftOpening(rift)).toBe(0.5);
    await expect(rift.getByRole("slider", { name: "Fracture" })).toHaveAttribute("aria-valuetext", "50% open");

    const frequency = await openArtifact(page, "frequency", "Change the tempo.");
    await expect(frequency.getByRole("button", { name: "Pause motion" })).toHaveCount(0);
    const path = frequency.locator("[data-tempo] path").first();
    const still = await path.getAttribute("d");
    await page.waitForTimeout(400);
    expect(await path.getAttribute("d")).toBe(still);

    const mono = await openArtifact(page, "mono", "One line, one light.");
    expect(await dashOffset(mono)).toBe(0);
    for (const opacity of await mono.locator("[data-callout]").evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity))) {
      expect(opacity).toBe("1");
    }

    const signal = await openArtifact(page, "signal", "Flex the mark.");
    await signal.getByRole("button", { name: "Rotate 90°" }).click();
    await expect(signal.getByRole("status")).toHaveText("Rotation 90°");
    expect(await markMatrix(signal)).toEqual([0, 1, 400, 0]);
  });
});

import { expect, type Page } from "@playwright/test";

export const routes = ["/", "/work", "/work/rift", "/work/frequency", "/work/mono", "/work/signal", "/studio", "/contact", "/colophon"] as const;

export const projects = [
  { slug: "rift", title: "Rift / Apparel" },
  { slug: "frequency", title: "Frequency / Festival" },
  { slug: "mono", title: "Mono / Objects" },
  { slug: "signal", title: "Signal / Culture" },
] as const;

/** Fails the test on any console error or uncaught exception, including hydration warnings. */
export function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("status of 404")) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  return () => expect(errors, errors.join("\n")).toEqual([]);
}

/** Waits until the page-transition overlay is fully retracted. */
export async function expectNoOverlay(page: Page) {
  await expect
    .poll(() => page.evaluate(() => [...document.querySelectorAll("[data-wipe]")].every((layer) => getComputedStyle(layer).transform.startsWith("matrix(1, 0, 0, 0"))))
    .toBe(true);
}

export type ProjectKind = "desktop" | "mobile" | "reduced-motion";

/** Project names end in their kind, e.g. "webkit-mobile" (see playwright.config.ts). */
export function projectKind(projectName: string): ProjectKind {
  if (projectName.endsWith("reduced-motion")) return "reduced-motion";
  if (projectName.endsWith("mobile")) return "mobile";
  return "desktop";
}

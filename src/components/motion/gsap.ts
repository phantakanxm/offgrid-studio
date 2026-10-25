import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Every motion feature is gated by one of these through gsap.matchMedia, so reduced-motion users,
 * touch devices and smaller screens never build the animations at all, and crossing a breakpoint
 * reverts them cleanly.
 */
export const motionQuery = {
  any: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
  belowDesktop: "(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)",
  finePointer: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)",
} as const;

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, useGSAP };

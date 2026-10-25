"use client";

import { ScrollTrigger, gsap, motionQuery, useGSAP } from "./gsap";
import { buildMediaReveal } from "./reveal";
import { useParentElement } from "./useParentElement";

/** Reveals every [data-reveal] item inside the parent element as it scrolls into view. */
export function MediaReveal() {
  const { anchorRef, getParent } = useParentElement();

  useGSAP(() => {
    const root = getParent();
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(motionQuery.any, () => {
      root.querySelectorAll("[data-reveal]").forEach((item) => {
        const tl = buildMediaReveal(item);
        ScrollTrigger.create({ trigger: item, start: "top 88%", once: true, onEnter: () => tl.play() });
      });
    });
    return () => mm.revert();
  });

  return <span ref={anchorRef} hidden />;
}

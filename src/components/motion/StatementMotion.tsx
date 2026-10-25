"use client";

import { gsap, motionQuery, useGSAP } from "./gsap";
import { useParentElement } from "./useParentElement";

/**
 * The statement drifts across its clipped section while the texture eases behind it, and a lime
 * band rises from the bottom edge as the section leaves so it hands over to the contact CTA.
 */
export function StatementMotion() {
  const { anchorRef, getParent } = useParentElement();

  useGSAP(() => {
    const section = getParent();
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add(motionQuery.any, () => {
      const pass = { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8 };
      const [first, second] = section.querySelectorAll("[data-statement-line]");

      gsap.fromTo("[data-statement-bg]", { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.02, ease: "none", scrollTrigger: pass });
      if (first) gsap.fromTo(first, { xPercent: -7 }, { xPercent: 3, ease: "none", scrollTrigger: pass });
      if (second) gsap.fromTo(second, { xPercent: 7 }, { xPercent: -3, ease: "none", scrollTrigger: pass });
      gsap.fromTo(
        "[data-statement-band]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: section, start: "bottom 85%", end: "bottom top", scrub: 0.5 } },
      );
    }, section);
    return () => mm.revert();
  });

  return <span ref={anchorRef} hidden />;
}

"use client";

import { gsap, motionQuery, useGSAP } from "./gsap";
import { useParentElement } from "./useParentElement";

/**
 * Scroll-linked contrast reveal for a heading rendered with EditorialHeading's `splitWords`.
 * Words start muted (still above 3:1) and reach full contrast while the whole heading is still on screen.
 */
export function TextScrub() {
  const { anchorRef, getParent } = useParentElement();

  useGSAP(() => {
    const heading = getParent();
    if (!heading) return;
    const mm = gsap.matchMedia();
    mm.add(motionQuery.any, () => {
      gsap.fromTo(
        heading.querySelectorAll("[data-word]"),
        // 0.5 keeps the muted words at 3.4:1 on paper, so the text stays legible before it is revealed.
        { opacity: 0.5 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: heading, start: "top 85%", end: "bottom 70%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        heading,
        { y: 40 },
        { y: 0, ease: "none", scrollTrigger: { trigger: heading, start: "top bottom", end: "bottom 70%", scrub: 0.6 } },
      );
    });
    return () => mm.revert();
  });

  return <span ref={anchorRef} hidden />;
}

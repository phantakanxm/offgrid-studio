"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "./gsap";
import { registerPageCover } from "./transitionBridge";

// If a route never commits (offline, slow chunk), the overlay lifts anyway rather than trapping the user.
const FAILSAFE_MS = 2500;

/**
 * Exit-then-enter wipe for link navigations: lime then ink rise from the bottom, the route changes
 * underneath, then both retract upward. Back/forward and direct loads are never intercepted, and the
 * overlay never takes pointer events.
 */
export function PageTransition() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingFrom = useRef<string | null>(null);
  const failsafe = useRef<number | undefined>(undefined);

  const revealRef = useRef<(() => void) | null>(null);

  useGSAP(
    (_context, contextSafe) => {
      if (!contextSafe) return;

      const reveal = contextSafe(() => {
        window.clearTimeout(failsafe.current);
        pendingFrom.current = null;
        gsap
          .timeline()
          .to("[data-wipe='ink']", { scaleY: 0, transformOrigin: "50% 0%", duration: 0.5, ease: "power4.inOut" })
          .to("[data-wipe='lime']", { scaleY: 0, transformOrigin: "50% 0%", duration: 0.45, ease: "power4.inOut" }, 0.08);
      });

      const cover = contextSafe((navigate: () => void) => {
        if (pendingFrom.current) return;
        pendingFrom.current = window.location.pathname;
        gsap
          .timeline({
            onComplete: () => {
              navigate();
              failsafe.current = window.setTimeout(reveal, FAILSAFE_MS);
            },
          })
          .fromTo("[data-wipe='lime']", { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 100%", duration: 0.34, ease: "power4.inOut" })
          .fromTo("[data-wipe='ink']", { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 100%", duration: 0.34, ease: "power4.inOut" }, 0.07);
      });

      revealRef.current = reveal;
      registerPageCover(cover);
      return () => {
        registerPageCover(null);
        revealRef.current = null;
        window.clearTimeout(failsafe.current);
      };
    },
    { scope: rootRef },
  );

  useEffect(() => {
    if (!pendingFrom.current || pendingFrom.current === pathname) return;
    // Let the new route paint once under the overlay before lifting it.
    const frame = requestAnimationFrame(() => revealRef.current?.());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div ref={rootRef} aria-hidden className="page-wipe">
      <div data-wipe="lime" className="page-wipe__layer bg-lime" />
      <div data-wipe="ink" className="page-wipe__layer bg-ink" />
    </div>
  );
}

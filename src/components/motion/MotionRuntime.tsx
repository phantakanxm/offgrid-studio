"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "./gsap";

/** Global ScrollTrigger housekeeping that individual behaviours should not each repeat. */
export function MotionRuntime() {
  useEffect(() => {
    // Mobile URL-bar show/hide resizes the viewport constantly; recalculating then causes jumps.
    ScrollTrigger.config({ ignoreMobileResize: true });
    // Web fonts can change text metrics after triggers were measured.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return null;
}

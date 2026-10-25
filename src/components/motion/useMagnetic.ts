"use client";

import { useRef } from "react";
import { gsap, motionQuery, useGSAP } from "./gsap";

interface MagneticOptions {
  /** Maximum travel of the element, in pixels, at the edge of its box. */
  pull?: number;
  /** Extra travel of the [data-magnetic-label] child, in pixels. */
  labelPull?: number;
  /** Re-bind when these change, for elements that unmount and remount (e.g. a form's submit button). */
  dependencies?: unknown[];
}

/**
 * Pulls an element a few pixels toward the pointer while it is over it, with its label moving a
 * little further, then eases both home on leave. Transform-only, so layout and the hit area stay put.
 */
export function useMagnetic<T extends HTMLElement>({ pull = 12, labelPull = 5, dependencies = [] }: MagneticOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add(motionQuery.finePointer, () => {
        const label = element.querySelector<HTMLElement>("[data-magnetic-label]");
        const settle = { duration: 0.6, ease: "power3.out" };
        const x = gsap.quickTo(element, "x", settle);
        const y = gsap.quickTo(element, "y", settle);
        const labelX = label ? gsap.quickTo(label, "x", settle) : null;
        const labelY = label ? gsap.quickTo(label, "y", settle) : null;
        let box: DOMRect | null = null;

        const onEnter = () => {
          // Measure without the current offset so the pull never feeds back into itself.
          const rect = element.getBoundingClientRect();
          const offsetX = Number(gsap.getProperty(element, "x"));
          const offsetY = Number(gsap.getProperty(element, "y"));
          box = new DOMRect(rect.left - offsetX, rect.top - offsetY, rect.width, rect.height);
        };
        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          if (!box) onEnter();
          if (!box) return;
          const nx = gsap.utils.clamp(-1, 1, (event.clientX - (box.left + box.width / 2)) / (box.width / 2));
          const ny = gsap.utils.clamp(-1, 1, (event.clientY - (box.top + box.height / 2)) / (box.height / 2));
          x(nx * pull);
          y(ny * pull * 0.6);
          labelX?.(nx * labelPull);
          labelY?.(ny * labelPull * 0.6);
        };
        const onLeave = () => {
          box = null;
          x(0);
          y(0);
          labelX?.(0);
          labelY?.(0);
        };

        element.addEventListener("pointerenter", onEnter);
        element.addEventListener("pointermove", onMove);
        element.addEventListener("pointerleave", onLeave);
        return () => {
          element.removeEventListener("pointerenter", onEnter);
          element.removeEventListener("pointermove", onMove);
          element.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies, revertOnUpdate: true },
  );

  return ref;
}

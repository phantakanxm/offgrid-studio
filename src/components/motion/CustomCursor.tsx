"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { resolveCursorLabel } from "./cursor";
import { gsap, motionQuery, useGSAP } from "./gsap";

const ACTIVE_CLASS = "has-custom-cursor";
const NATIVE_CURSOR_TARGETS = "input, textarea, select, [contenteditable]";

/**
 * A precise dot that tracks the pointer exactly, plus a label that trails slightly behind it when
 * the pointer is over a [data-cursor] element. Fine pointers only. Positions are written straight
 * to transforms through quickTo, so React never re-renders on pointer movement.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const resetRef = useRef<(() => void) | null>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const dot = dotRef.current;
    const label = labelRef.current;
    const text = textRef.current;
    if (!dot || !label || !text) return;

    const mm = gsap.matchMedia();
    mm.add(motionQuery.finePointer, () => {
      const html = document.documentElement;
      html.classList.add(ACTIVE_CLASS);

      const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
      const labelX = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3.out" });
      const labelY = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3.out" });
      let shown = false;
      let currentLabel: string | null = null;

      const setVisible = (visible: boolean) => {
        if (visible === shown) return;
        shown = visible;
        gsap.to([dot, label], { autoAlpha: visible ? 1 : 0, duration: 0.2, overwrite: "auto" });
      };

      const setLabel = (next: string | null) => {
        if (next === currentLabel) return;
        currentLabel = next;
        if (next) text.textContent = next;
        gsap.to(label, { scale: next ? 1 : 0, duration: 0.35, ease: next ? "back.out(2)" : "power3.out", overwrite: "auto" });
        gsap.to(dot, { scale: next ? 0.5 : 1, duration: 0.3, ease: "power3.out", overwrite: "auto" });
      };

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        if (!shown) {
          gsap.set([dot, label], { x: event.clientX, y: event.clientY });
        }
        dotX(event.clientX);
        dotY(event.clientY);
        labelX(event.clientX);
        labelY(event.clientY);
        setVisible(true);
      };

      // Form fields keep the native cursor (text caret, select affordance), so the dot steps aside.
      const onOver = (event: PointerEvent) => {
        const overField = event.target instanceof Element && event.target.closest(NATIVE_CURSOR_TARGETS);
        gsap.to(dot, { opacity: overField ? 0 : 1, duration: 0.15, overwrite: "auto" });
        setLabel(overField ? null : resolveCursorLabel(event.target));
      };

      const onDown = () => gsap.to(dot, { scale: currentLabel ? 0.35 : 0.6, duration: 0.15 });
      const onUp = () => gsap.to(dot, { scale: currentLabel ? 0.5 : 1, duration: 0.25 });
      const onLeave = () => setVisible(false);

      resetRef.current = () => setLabel(null);
      gsap.set(label, { scale: 0 });
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      html.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);

      return () => {
        resetRef.current = null;
        html.classList.remove(ACTIVE_CLASS);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        html.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("blur", onLeave);
      };
    });
    return () => mm.revert();
  });

  // The element under a still pointer changes on navigation; Safari does not re-fire pointerover for it.
  useEffect(() => {
    resetRef.current?.();
  }, [pathname]);

  return (
    <div aria-hidden className="custom-cursor">
      <div ref={dotRef} className="custom-cursor__dot" />
      <div ref={labelRef} className="custom-cursor__label">
        <span ref={textRef} className="text-meta" />
      </div>
    </div>
  );
}

"use client";

import { ScrollTrigger, gsap, motionQuery, useGSAP } from "./gsap";
import { buildMediaReveal } from "./reveal";
import { useParentElement } from "./useParentElement";

const DRAG_THRESHOLD = 6;

/**
 * Desktop: the project list becomes a pinned horizontal track whose scroll distance equals its real
 * overflow, with drag-to-scroll and keyboard focus kept in view. Below desktop it stays a vertical
 * list with scroll reveals. The horizontal layout lives behind [data-gallery-mode="horizontal"], set
 * only here, so without JavaScript or with reduced motion the page is the plain vertical list.
 */
export function WorkGalleryMotion() {
  const { anchorRef, getParent } = useParentElement();

  useGSAP(() => {
    const section = getParent();
    const track = section?.querySelector<HTMLElement>("[data-gallery-track]");
    if (!section || !track) return;
    const panels = Array.from(track.querySelectorAll<HTMLElement>("[data-gallery-panel]"));
    const mm = gsap.matchMedia();

    mm.add(motionQuery.desktop, () => {
      section.dataset.galleryMode = "horizontal";
      track.dataset.cursor = "drag";

      const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

      const scroll = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      const trigger = scroll.scrollTrigger as ScrollTrigger;

      gsap.fromTo(
        section.querySelector("[data-gallery-progress]"),
        { scaleX: 0 },
        { scaleX: 1, ease: "none", transformOrigin: "0% 50%", scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true } },
      );

      panels.forEach((panel) => {
        const reveal = buildMediaReveal(panel, "left");
        ScrollTrigger.create({ trigger: panel, containerAnimation: scroll, start: "left 92%", once: true, onEnter: () => reveal.play() });
      });

      // Tabbing into an off-screen panel scrolls the page so the translated track brings it into view.
      const onFocusIn = (event: FocusEvent) => {
        const panel = (event.target as Element).closest<HTMLElement>("[data-gallery-panel]");
        if (!panel) return;
        const offset = panel.getBoundingClientRect().left - track.getBoundingClientRect().left;
        const gutter = parseFloat(getComputedStyle(track).paddingLeft);
        const target = trigger.start + gsap.utils.clamp(0, distance(), offset - gutter);
        // The browser's own focus scroll runs after focusin and would undo this, so go one frame later.
        requestAnimationFrame(() => window.scrollTo({ top: target, behavior: "instant" }));
      };

      let dragStart: { x: number; scroll: number } | null = null;
      let dragged = false;
      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        dragStart = { x: event.clientX, scroll: window.scrollY };
        dragged = false;
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!dragStart) return;
        const dx = event.clientX - dragStart.x;
        if (!dragged && Math.abs(dx) < DRAG_THRESHOLD) return;
        if (!dragged) {
          dragged = true;
          section.dataset.dragging = "";
        }
        // The track moves one pixel per pixel scrolled, so a drag maps directly onto scroll position.
        window.scrollTo({ top: gsap.utils.clamp(trigger.start, trigger.end, dragStart.scroll - dx), behavior: "instant" });
      };
      const onPointerUp = () => {
        dragStart = null;
        delete section.dataset.dragging;
      };
      // A drag that ends over a link must not also follow it.
      const onClickCapture = (event: MouseEvent) => {
        if (!dragged) return;
        event.preventDefault();
        event.stopPropagation();
        dragged = false;
      };
      const onDragStart = (event: DragEvent) => event.preventDefault();

      track.addEventListener("focusin", onFocusIn);
      track.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerup", onPointerUp);
      track.addEventListener("click", onClickCapture, true);
      track.addEventListener("dragstart", onDragStart);

      return () => {
        track.removeEventListener("focusin", onFocusIn);
        track.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        track.removeEventListener("click", onClickCapture, true);
        track.removeEventListener("dragstart", onDragStart);
        delete section.dataset.galleryMode;
        delete section.dataset.dragging;
        delete track.dataset.cursor;
      };
    });

    mm.add(motionQuery.belowDesktop, () => {
      panels.forEach((panel) => {
        const reveal = buildMediaReveal(panel);
        ScrollTrigger.create({ trigger: panel, start: "top 85%", once: true, onEnter: () => reveal.play() });
      });
    });

    return () => mm.revert();
  });

  return <span ref={anchorRef} hidden />;
}

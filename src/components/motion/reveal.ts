import { gsap } from "./gsap";

type RevealDirection = "up" | "left";

const hiddenClip: Record<RevealDirection, string> = {
  up: "inset(100% 0% 0% 0%)",
  left: "inset(0% 0% 0% 100%)",
};

/**
 * The shared project-image reveal: the frame opens through a clip-path while the image inside
 * settles from a slight scale, then the metadata follows. Elements opt in with data attributes:
 * [data-reveal] item > [data-reveal-frame] > [data-reveal-inner], plus any [data-reveal-meta].
 */
export function buildMediaReveal(item: Element, direction: RevealDirection = "up") {
  const frame = item.querySelector("[data-reveal-frame]");
  const inner = item.querySelector("[data-reveal-inner]");
  const meta = item.querySelectorAll("[data-reveal-meta]");
  const tl = gsap.timeline({ paused: true });

  if (frame) {
    tl.fromTo(
      frame,
      { clipPath: hiddenClip[direction] },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "power3.inOut", clearProps: "clipPath" },
      0,
    );
  }
  if (inner) tl.fromTo(inner, { scale: 1.14 }, { scale: 1, duration: 1.4, ease: "power3.out", clearProps: "transform" }, 0);
  if (meta.length) {
    tl.fromTo(
      meta,
      // Opacity, never autoAlpha: visibility:hidden would make links unfocusable and hide
      // headings from screen readers until the reveal has played.
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power2.out", clearProps: "opacity,transform" },
      0.45,
    );
  }
  return tl;
}

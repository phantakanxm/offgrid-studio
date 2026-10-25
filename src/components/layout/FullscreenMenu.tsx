"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { X } from "lucide-react";
import { menuNav } from "@/data/navigation";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { gsap, motionQuery, useGSAP } from "@/components/motion/gsap";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { isActivePath } from "./NavLink";
import { Wordmark } from "./Wordmark";

const SCROLL_LOCK_CLASS = "is-scroll-locked";
// Closing runs the opening timeline backwards, faster; after picking a link it is faster still.
const CLOSE_SPEED = 1.8;
const NAVIGATE_CLOSE_SPEED = 2.6;

export function FullscreenMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Without motion no timeline exists and the dialog simply opens and closes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQuery.any, () => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const tl = gsap.timeline({ paused: true, onReverseComplete: () => dialog.close() });
        tl.fromTo("[data-menu-wipe]", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.36, ease: "power3.inOut" })
          .fromTo("[data-menu-panel]", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.42, ease: "power3.inOut" }, 0.08)
          .fromTo("[data-menu-link]", { yPercent: 110 }, { yPercent: 0, duration: 0.65, stagger: 0.06, ease: "expo.out" }, 0.28)
          .fromTo("[data-menu-meta]", { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05 }, 0.62);
        timelineRef.current = tl;
        return () => {
          timelineRef.current = null;
        };
      }, dialogRef);
      return () => mm.revert();
    },
    { scope: dialogRef },
  );

  // Browser back/forward can change the route while the dialog is open.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => () => document.documentElement.classList.remove(SCROLL_LOCK_CLASS), []);

  function open() {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    setIsOpen(true);
    timelineRef.current?.timeScale(1).play();
  }

  // Idempotent: repeated clicks or Escape presses only keep reversing the same timeline.
  function close(speed = CLOSE_SPEED) {
    const dialog = dialogRef.current;
    const tl = timelineRef.current;
    if (!dialog?.open) return;
    if (!tl || tl.progress() === 0) {
      dialog.close();
      return;
    }
    tl.timeScale(speed).reverse();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    // Escape: run the exit animation instead of the browser's instant close.
    event.preventDefault();
    close();
  }

  // Fires for every close path: the close button, Escape, a link click and route changes.
  function handleClose() {
    timelineRef.current?.pause(0);
    document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="site-menu"
        data-cursor="open"
        className="text-meta inline-flex min-h-11 items-center gap-2 transition-colors hover:text-lime"
      >
        <span aria-hidden className="flex w-4 flex-col gap-[3px]">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-2/3 bg-current" />
        </span>
        Menu
      </button>

      <dialog
        ref={dialogRef}
        id="site-menu"
        aria-label="Site menu"
        onCancel={handleCancel}
        onClose={handleClose}
        className="menu-dialog"
      >
        <div aria-hidden data-menu-wipe="" className="absolute inset-0 bg-lime" />
        <div data-menu-panel="" className="surface-ink relative flex min-h-full flex-col">
          <div className="h-(--header-h) shrink-0 border-b border-line">
            <Container className="flex h-full items-center justify-between">
              <Wordmark className="text-xl" />
              <button
                type="button"
                onClick={() => close()}
                className="text-meta inline-flex min-h-11 items-center gap-2 transition-colors hover:text-lime"
              >
                Close
                <X aria-hidden className="size-4" />
              </button>
            </Container>
          </div>

          <Container as="nav" aria-label="Menu" className="flex flex-1 flex-col justify-center py-10">
            <ol className="border-t border-line">
              {menuNav.map((item, index) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-line">
                    <TransitionLink
                      href={item.href}
                      onClick={() => close(NAVIGATE_CLOSE_SPEED)}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline gap-4 py-3 md:gap-8 md:py-4"
                    >
                      <span className="text-meta w-8 shrink-0 text-muted">{String(index + 1).padStart(2, "0")}</span>
                      <span className="block overflow-hidden">
                        <span
                          data-menu-link=""
                          className="text-display-xl block transition-colors duration-200 group-hover:text-lime group-focus-visible:text-lime group-aria-[current=page]:text-lime"
                        >
                          {item.label}
                        </span>
                      </span>
                    </TransitionLink>
                  </li>
                );
              })}
            </ol>
          </Container>

          <Container className="text-meta flex flex-wrap justify-between gap-4 pb-6 text-muted">
            <span data-menu-meta="">{site.tagline}</span>
            <TransitionLink
              href="/colophon"
              onClick={() => close(NAVIGATE_CLOSE_SPEED)}
              data-menu-meta=""
              className="inline-flex min-h-11 items-center underline underline-offset-4 transition-colors hover:text-lime"
            >
              About this build
            </TransitionLink>
            <span data-menu-meta="">{site.philosophy}</span>
          </Container>
        </div>
      </dialog>
    </>
  );
}

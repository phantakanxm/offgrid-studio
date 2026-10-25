"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { prefersReducedMotion } from "./gsap";
import { navigateWithTransition } from "./transitionBridge";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * next/link with an exit wipe. onNavigate only fires for same-origin client navigations, so
 * modified clicks, new tabs, downloads and external URLs keep their native behaviour untouched.
 */
export function TransitionLink({ href, onNavigate, replace, scroll, ...props }: TransitionLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      replace={replace}
      scroll={scroll}
      onNavigate={(event) => {
        onNavigate?.(event);
        const target = new URL(href, window.location.href);
        // Hash and query changes on the same page are not page changes.
        if (target.pathname === window.location.pathname || prefersReducedMotion()) return;
        event.preventDefault();
        navigateWithTransition(() => {
          if (replace) router.replace(href, { scroll });
          else router.push(href, { scroll });
        });
      }}
      {...props}
    />
  );
}

"use client";

import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { useMagnetic } from "@/components/motion/useMagnetic";
import { cn } from "@/lib/utils";

interface CtaLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function CtaLink({ href, children, className }: CtaLinkProps) {
  const magneticRef = useMagnetic<HTMLAnchorElement>();

  return (
    <TransitionLink
      ref={magneticRef}
      href={href}
      data-cursor="open"
      className={cn(
        "text-display-sm group inline-flex min-h-16 items-center justify-between gap-6 bg-ink px-6 py-5 text-lime transition-colors duration-300 hover:bg-signal hover:text-ink [--focus:var(--ink)]",
        className,
      )}
    >
      <span data-magnetic-label="" className="inline-flex items-center gap-6">
        {children}
        <ArrowUpRight
          aria-hidden
          className="size-[1.1em] shrink-0 transition-[translate] duration-300 ease-(--ease-editorial) group-hover:translate-x-1 group-hover:-translate-y-1"
          strokeWidth={2.25}
        />
      </span>
    </TransitionLink>
  );
}

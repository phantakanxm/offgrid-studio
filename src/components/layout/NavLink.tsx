"use client";

import { usePathname } from "next/navigation";
import type { NavItem } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/motion/TransitionLink";

export function isActivePath(pathname: string, href: NavItem["href"]) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ item, className }: { item: NavItem; className?: string }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);

  return (
    <TransitionLink
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-meta inline-flex min-h-11 items-center underline-offset-[6px] transition-colors hover:text-lime aria-[current=page]:text-lime aria-[current=page]:underline",
        className,
      )}
    >
      {item.label}
    </TransitionLink>
  );
}

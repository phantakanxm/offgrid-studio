import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: ReactNode;
  index?: string;
  className?: string;
}

export function SectionLabel({ children, index, className }: SectionLabelProps) {
  return (
    <p className={cn("text-meta flex items-center gap-3", className)}>
      {index ? <span className="text-tone-muted">{index}</span> : <span aria-hidden className="size-2 bg-current" />}
      <span>{children}</span>
    </p>
  );
}

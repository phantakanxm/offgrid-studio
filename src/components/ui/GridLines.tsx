import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** The studio's underlying column grid made visible. Content aligns to it; display type and imagery break it. */
export function GridLines({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <div className="container-editorial grid-editorial h-full">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            data-grid-line=""
            style={{ "--i": index } as CSSProperties}
            className={cn(
              "h-full border-x border-current opacity-[0.07]",
              index >= 4 && "hidden md:block",
              index >= 8 && "md:hidden lg:block",
            )}
          />
        ))}
      </div>
    </div>
  );
}

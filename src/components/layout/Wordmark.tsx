import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-bold uppercase tracking-[-0.04em]", className)}>
      Offgrid<sup className="ml-[0.05em] align-super text-[0.45em] font-medium tracking-normal">®</sup>
    </span>
  );
}

import { useRef } from "react";

/**
 * Behaviour components render a hidden <span> and animate their parent, so Server Components keep
 * their markup and no wrapper element disturbs the grid. `hidden` keeps the span out of layout.
 */
export function useParentElement() {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const getParent = () => anchorRef.current?.parentElement ?? null;
  return { anchorRef, getParent };
}

/** Elements declare a contextual cursor with data-cursor="<intent>"; the closest declaration wins. */
export const cursorLabels = {
  view: "View project",
  open: "Open",
  drag: "Drag",
  explore: "Explore",
} as const;

export type CursorIntent = keyof typeof cursorLabels;

export function resolveCursorLabel(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  const intent = target.closest("[data-cursor]")?.getAttribute("data-cursor");
  return intent && intent in cursorLabels ? cursorLabels[intent as CursorIntent] : null;
}

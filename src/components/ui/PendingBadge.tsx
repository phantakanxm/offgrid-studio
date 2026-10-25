/** Marks a value the author has not supplied yet, so placeholders never pass for real content. */
export function PendingBadge() {
  return <span className="text-meta border border-line px-1.5 py-0.5 text-muted">Pending</span>;
}

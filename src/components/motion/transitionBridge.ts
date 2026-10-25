/**
 * Bridge between TransitionLink (many instances) and PageTransition (one overlay in the root
 * layout). The overlay registers a cover function; links ask it to cover, then navigate.
 */
type Cover = (navigate: () => void) => void;

let cover: Cover | null = null;

export function registerPageCover(next: Cover | null) {
  cover = next;
}

/** Runs `navigate` behind the overlay when one is mounted, or straight away otherwise. */
export function navigateWithTransition(navigate: () => void) {
  if (cover) cover(navigate);
  else navigate();
}

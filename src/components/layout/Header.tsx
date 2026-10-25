import { TransitionLink } from "@/components/motion/TransitionLink";
import { primaryNav } from "@/data/navigation";
import { Container } from "@/components/ui/Container";
import { FullscreenMenu } from "./FullscreenMenu";
import { NavLink } from "./NavLink";
import { Wordmark } from "./Wordmark";

export function Header() {
  return (
    <header className="surface-ink fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-line">
      <Container className="flex h-full items-center justify-between gap-6">
        <TransitionLink href="/" aria-label="OFFGRID Studio home" className="inline-flex min-h-11 items-center">
          <Wordmark className="text-xl" />
        </TransitionLink>
        <nav aria-label="Primary" className="flex items-center gap-6 md:gap-8">
          <ul className="hidden items-center gap-8 md:flex">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
          <FullscreenMenu />
        </nav>
      </Container>
    </header>
  );
}

import { TransitionLink } from "@/components/motion/TransitionLink";
import { menuNav } from "@/data/navigation";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-ink border-t border-line pt-16 pb-6 md:pt-24">
      <Container className="grid-editorial gap-y-12">
        <p className="text-display-md col-span-4 md:col-span-8 lg:col-span-6">{site.tagline}</p>

        <nav aria-label="Footer" className="col-span-2 md:col-span-3 lg:col-start-8 lg:col-span-2">
          <p className="text-meta mb-4 text-muted">Index</p>
          <ul className="space-y-1">
            {menuNav.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="text-body inline-flex min-h-11 items-center hover:text-lime md:min-h-9">
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-5 lg:col-span-3">
          <p className="text-meta mb-4 text-muted">Contact</p>
          <a
            href={`mailto:${site.email.address}`}
            className="text-body inline-flex min-h-11 items-center break-all hover:text-lime md:min-h-9"
          >
            {site.email.address}
          </a>
          {site.email.isPlaceholder && <p className="text-meta text-muted">Placeholder address</p>}

          <p className="text-meta mt-8 mb-4 text-muted">Social</p>
          <ul className="space-y-1">
            {site.socials.map((social) => (
              <li key={social.label} className="text-body flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1">
                {social.href ? (
                  <a href={social.href} className="hover:text-lime" rel="noreferrer" target="_blank">
                    {social.label}
                  </a>
                ) : (
                  <>
                    <span className="text-muted">{social.label}</span>
                    <PendingBadge />
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="mt-16 md:mt-24">
        {/* Container query units size the wordmark to the exact content width at every breakpoint. */}
        <div className="@container">
          <p aria-hidden className="text-[25cqi] leading-[0.78]">
            <Wordmark className="block" />
          </p>
        </div>
        <div className="text-meta mt-6 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line pt-4 text-muted">
          <span>
            © {year} {site.name}
          </span>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-2">
              Concept &amp; build: {site.author.name ?? <PendingBadge />}
            </span>
            <TransitionLink href="/colophon" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-lime md:min-h-9">
              About this build
            </TransitionLink>
          </p>
          <span>{site.philosophy}</span>
        </div>
      </Container>
    </footer>
  );
}

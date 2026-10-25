import { pageMetadata } from "@/lib/metadata";
import { site } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { GridLines } from "@/components/ui/GridLines";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata = pageMetadata({
  title: "About this build",
  description: "OFFGRID / STUDIO is a fictional studio concept and a frontend portfolio project. The stack, the motion architecture and how the build is tested.",
  path: "/colophon",
});

const credits = [
  { label: "Concept & build", value: site.author.name, href: null },
  { label: "Portfolio", value: site.author.portfolioUrl, href: site.author.portfolioUrl },
  { label: "Repository", value: site.author.repositoryUrl, href: site.author.repositoryUrl },
] as const;

const stack = [
  { name: "Next.js 16", detail: "App Router with Turbopack. Every route is statically prerendered." },
  { name: "React 19", detail: "Pages and sections are Server Components. Only interactive pieces and the motion layer run on the client." },
  { name: "TypeScript", detail: "Projects, services, media and site details are typed content in one data folder." },
  { name: "Tailwind CSS 4", detail: "Design tokens live in CSS custom properties. Each surface owns its colours and contrast." },
  { name: "GSAP + ScrollTrigger", detail: "All scroll and interaction motion, scoped and reverted with @gsap/react. No smooth-scroll library." },
  { name: "React Hook Form + Zod", detail: "Validation for the inquiry form, which is a demo and sends nothing." },
  { name: "Playwright", detail: "End-to-end tests in Chrome, WebKit and Firefox, on desktop, mobile and reduced motion." },
] as const;

const motion = [
  {
    name: "Gated by media query",
    detail:
      "Every GSAP feature is built inside gsap.matchMedia(). Reduced motion gets none of it, touch gets no cursor or magnetic pull, and only desktop gets the pinned gallery.",
  },
  {
    name: "A CSS entrance",
    detail:
      "The homepage entrance is pure CSS, flagged by an inline script before first paint. It starts on the first frame and the sculpture stays the LCP element.",
  },
  {
    name: "Text split on the server",
    detail: "Headings render their lines and words as markup on the server, so no library rewrites React-owned DOM in the browser.",
  },
  {
    name: "Behaviour components",
    detail:
      "Scrub, reveal, statement and gallery motion animate their parent from a hidden span. Sections stay Server Components and no wrapper disturbs the grid.",
  },
  {
    name: "Reveals that stay accessible",
    detail: "One shared image reveal animates opacity, never visibility, so unrevealed links stay focusable and readable by screen readers.",
  },
  {
    name: "Native-first transitions",
    detail:
      "Page wipes hook into next/link’s onNavigate, so modified clicks, new tabs and back/forward behave natively. A failsafe always reveals the page.",
  },
] as const;

// Measured on the production build with `npm run test:e2e` and Lighthouse 13.5.0 (desktop preset).
// Re-measure and update the date before changing any of these.
const measuredOn = "25 October 2026";
const quality = [
  { value: "116", label: "Playwright runs passed, none failed" },
  { value: "100", label: "Lighthouse performance" },
  { value: "100", label: "Lighthouse accessibility" },
  { value: "100", label: "Lighthouse best practices" },
  { value: "100", label: "Lighthouse SEO" },
] as const;

export default function ColophonPage() {
  return (
    <>
      <section aria-labelledby="colophon-title" className="surface-ink relative isolate pt-10 pb-(--section-y) md:pt-16">
        <GridLines />
        <Container>
          <SectionLabel className="mb-8">Colophon</SectionLabel>
          <EditorialHeading as="h1" id="colophon-title" size="xl" lines={["About", "this build."]} />
          <div className="grid-editorial mt-12 gap-y-6 md:mt-16">
            <p className="text-statement col-span-4 md:col-span-6 md:col-start-3 lg:col-span-6 lg:col-start-7">
              {site.name} is a frontend portfolio project. The studio is a fictional concept.
            </p>
            <p className="text-body col-span-4 max-w-[52ch] text-muted md:col-span-5 md:col-start-3 lg:col-span-4 lg:col-start-7">
              It explores bold editorial design, kinetic typography and purposeful interaction. The work focuses on
              art-directed motion, a visible 12-column grid that the type and imagery deliberately break, responsive
              layouts recomposed for each screen size, and case studies that each keep their own identity inside one
              shared system. The four projects and their brands are concepts too. No clients, results or services are
              real.
            </p>

            <dl className="col-span-4 mt-6 border-b border-line md:col-span-6 md:col-start-3 lg:col-span-6 lg:col-start-7">
              {credits.map((credit) => (
                <div key={credit.label} className="grid grid-cols-[minmax(0,10rem)_1fr] items-center gap-x-4 border-t border-line py-3">
                  <dt className="text-meta text-muted">{credit.label}</dt>
                  <dd className="text-body min-w-0 break-words">
                    {credit.value === null ? (
                      <PendingBadge />
                    ) : credit.href ? (
                      <a href={credit.href} className="underline underline-offset-4 hover:text-lime" rel="noreferrer" target="_blank">
                        {credit.value}
                      </a>
                    ) : (
                      credit.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <section aria-labelledby="stack-title" className="surface-paper py-(--section-y)">
        <Container className="grid-editorial gap-y-12 md:gap-y-16">
          <SectionLabel className="col-span-4 md:col-span-8 lg:col-span-3 lg:pt-3">Stack</SectionLabel>
          <EditorialHeading id="stack-title" size="xl" lines={["Built with."]} className="col-span-4 md:col-span-8 lg:col-span-9" />

          <ul className="col-span-4 border-b border-tone md:col-span-8 lg:col-span-9 lg:col-start-4">
            {stack.map((tool) => (
              <li key={tool.name} className="grid-editorial items-baseline gap-y-2 border-t border-tone py-5 md:py-6 lg:grid-cols-9">
                <h3 className="text-display-sm col-span-4 md:col-span-3 lg:col-span-4">{tool.name}</h3>
                <p className="text-body col-span-4 max-w-[48ch] text-tone-muted md:col-span-5 lg:col-span-5">{tool.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="motion-title" className="surface-ink py-(--section-y)">
        <Container className="grid-editorial gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <SectionLabel className="mb-6">Motion architecture</SectionLabel>
            <EditorialHeading id="motion-title" size="lg" lines={["Every move", "has a fallback."]} />
          </div>

          <ol className="col-span-4 border-b border-line md:col-span-8 lg:col-span-10 lg:col-start-3 lg:grid lg:grid-cols-2 lg:gap-x-(--column-gap)">
            {motion.map((row, index) => (
              <li key={row.name} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-6 md:grid-cols-[4rem_1fr] md:py-8">
                <span className="text-meta pt-1 text-lime">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-display-sm">{row.name}</h3>
                <p className="text-body col-start-2 mt-3 max-w-[44ch] text-muted">{row.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="quality-title" className="surface-paper py-(--section-y)">
        <Container className="grid-editorial gap-y-12 md:gap-y-16">
          <SectionLabel className="col-span-4 md:col-span-8 lg:col-span-3 lg:pt-3">Quality</SectionLabel>
          <div className="col-span-4 md:col-span-8 lg:col-span-9">
            <EditorialHeading id="quality-title" size="xl" lines={["Measured,", "not claimed."]} />
            <p className="text-body mt-6 max-w-[52ch] text-tone-muted">
              Measured on {measuredOn} against the production build. The Playwright suite covers six projects in
              Chrome, WebKit and Firefox. Each test runs only on the device kinds it targets, so 52 runs were skipped by
              design. Lighthouse 13.5.0 gave the same desktop scores to the homepage and this page.
            </p>
          </div>

          <ul className="col-span-4 grid grid-cols-2 gap-x-(--column-gap) gap-y-10 md:col-span-8 md:grid-cols-5 lg:col-span-9 lg:col-start-4">
            {quality.map((stat) => (
              <li key={stat.label} className="border-t border-tone pt-4">
                <span className="text-display-md block">{stat.value}</span>
                <span className="text-meta mt-3 block text-tone-muted">{stat.label}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label="Build note" className="surface-ink border-t border-line py-12">
        <Container className="text-meta flex flex-wrap justify-between gap-4 text-muted">
          <span>{site.name}</span>
          <span>A frontend portfolio project</span>
        </Container>
      </section>
    </>
  );
}

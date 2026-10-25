import { pageMetadata } from "@/lib/metadata";
import { site } from "@/data/site";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { GridLines } from "@/components/ui/GridLines";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Start a project with OFFGRID / STUDIO. Tell us about the brand, the problem or the idea.",
  path: "/contact",
});

const briefChecklist = [
  "What you are making and who it is for",
  "Where it will live: screen, space, print or all three",
  "Timing, and any fixed dates",
  "What success looks like to you",
];

export default function ContactPage() {
  return (
    <>
      <section aria-labelledby="contact-title" className="surface-ink relative isolate pt-10 pb-16 md:pt-16 md:pb-24">
        <GridLines />
        <Container>
          <SectionLabel className="mb-8">Project inquiry</SectionLabel>
          <EditorialHeading as="h1" id="contact-title" size="xl" lines={["Let’s make", "something matter."]} />
          <p className="text-lede mt-10 max-w-[40ch] md:ml-[33.33%]">
            Got a brand that needs a voice, a launch that needs to land, or an idea that doesn’t fit a template? Tell us
            about it.
          </p>
        </Container>
      </section>

      <section aria-label="Inquiry form" className="surface-paper py-(--section-y)">
        <Container className="grid-editorial gap-y-14">
          <aside className="col-span-4 space-y-10 md:col-span-8 lg:col-span-4">
            <div className="border-l-4 border-signal bg-ink p-5 text-paper">
              <p className="text-meta text-signal">Demo form</p>
              <p className="text-body mt-2">
                This site has no inbox connected yet. The form checks your answers in the browser and shows you a
                summary. It does not send, save or store anything.
              </p>
            </div>

            <div>
              <h2 className="text-meta border-t border-tone pt-4">A good brief includes</h2>
              <ul className="text-body mt-4 space-y-2">
                {briefChecklist.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 bg-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-meta border-t border-tone pt-4">Prefer email</h2>
              <a href={`mailto:${site.email.address}`} className="text-lede mt-4 inline-flex min-h-11 items-center break-all underline underline-offset-4 hover:text-signal-strong">
                {site.email.address}
              </a>
              {site.email.isPlaceholder && (
                <p className="text-meta text-tone-muted">Placeholder address until the studio inbox is live</p>
              )}
            </div>
          </aside>

          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <InquiryForm />
          </div>
        </Container>
      </section>
    </>
  );
}

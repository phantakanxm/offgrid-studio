import { pageMetadata } from "@/lib/metadata";
import { brandMedia } from "@/data/media";
import { processSteps } from "@/data/services";
import { site } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { GridLines } from "@/components/ui/GridLines";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Services } from "@/components/home/Services";
import { TextScrub } from "@/components/motion/TextScrub";

export const metadata = pageMetadata({
  title: "Studio",
  description: "OFFGRID is an independent creative digital studio exploring the intersection of identity, technology, and culture.",
  path: "/studio",
  image: { url: "/og/studio.jpg", alt: "Long industrial studio with concrete walls and printed layouts in lime and orange." },
});

export default function StudioPage() {
  return (
    <>
      <section aria-labelledby="studio-title" className="surface-ink relative isolate pt-10 md:pt-16">
        <GridLines />
        <Container>
          <SectionLabel className="mb-8">Studio</SectionLabel>
          <EditorialHeading as="h1" id="studio-title" size="xl" lines={["Not here", "to fit in."]} />
          <div className="grid-editorial mt-12 gap-y-6 pb-16 md:mt-16 md:pb-24">
            <p className="text-statement col-span-4 md:col-span-6 md:col-start-3 lg:col-span-6 lg:col-start-7">
              OFFGRID is an independent creative digital studio exploring the intersection of identity, technology,
              and culture.
            </p>
            <p className="text-body col-span-4 max-w-[52ch] text-muted md:col-span-5 md:col-start-3 lg:col-span-4 lg:col-start-7">
              Strategy, image, interface and code sit in one room, so ideas move from sketch to screen without being
              watered down in hand-offs. We work with ambitious brands across fashion, music, industrial design,
              contemporary art and culture.
            </p>
          </div>
        </Container>
        <figure>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface sm:aspect-[3/2] lg:aspect-[21/9]">
            <AssetImage media={brandMedia.studioWorkspace} sizes="100vw" priority />
          </div>
          <Container as="figcaption" className="text-meta py-3 text-muted">
            The studio floor
          </Container>
        </figure>
      </section>

      <section aria-labelledby="philosophy-title" className="surface-paper py-(--section-y)">
        <Container className="grid-editorial gap-y-12 md:gap-y-16">
          <SectionLabel className="col-span-4 md:col-span-8 lg:col-span-3 lg:pt-3">Philosophy</SectionLabel>
          <EditorialHeading
            id="philosophy-title"
            size="xl"
            lines={["Break the grid.", "Keep the intention."]}
            splitWords
            className="col-span-4 md:col-span-8 lg:col-span-9"
          >
            <TextScrub />
          </EditorialHeading>

          <figure className="col-span-3 md:col-span-3 lg:col-span-3 lg:row-span-2">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              <AssetImage media={brandMedia.sculptureDetail} sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 34vw, 72vw" />
            </div>
            <figcaption className="text-meta mt-3 text-tone-muted">Form study, acid lime</figcaption>
          </figure>

          <div className="col-span-4 md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-5">
            <h3 className="text-display-sm border-t border-tone pt-4">Break the grid</h3>
            <p className="text-body mt-4 max-w-[44ch]">
              Experimentation is how we find work nobody has seen before. We push scale, type, image and motion past
              the comfortable defaults of a category, and we keep the ideas that make people stop.
            </p>
          </div>
          <div className="col-span-4 md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9">
            <h3 className="text-display-sm border-t border-tone pt-4">Keep the intention</h3>
            <p className="text-body mt-4 max-w-[44ch]">
              Every risk needs a reason. Under each experimental surface sits a disciplined structure, a grid, a system
              and a clear message, so the work stays usable, legible and true to the brand.
            </p>
          </div>
        </Container>
      </section>

      <Services label="Capabilities" />

      <section aria-labelledby="process-title" className="surface-ink py-(--section-y)">
        <Container className="grid-editorial gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <SectionLabel className="mb-6">Process</SectionLabel>
            <EditorialHeading id="process-title" size="lg" lines={["Four steps.", "No shortcuts."]} />
          </div>

          <figure className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-9 lg:row-span-2">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              <AssetImage media={brandMedia.studioProcess} sizes="(min-width: 64rem) 32vw, (min-width: 48rem) 50vw, 100vw" />
            </div>
            <figcaption className="text-meta mt-3 text-muted">Proofs, sketches and screens, side by side</figcaption>
          </figure>

          <ol className="col-span-4 border-b border-line md:col-span-8 lg:col-span-7 lg:row-start-2">
            {processSteps.map((step) => (
              <li key={step.number} className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-6 md:grid-cols-[4rem_1fr] md:py-8">
                <span className="text-meta pt-2 text-lime">{step.number}</span>
                <h3 className="text-display-md">{step.name}</h3>
                <p className="text-body col-start-2 mt-3 max-w-[44ch] text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-label="Studio principle" className="surface-ink border-t border-line py-12">
        <Container className="text-meta flex flex-wrap justify-between gap-4 text-muted">
          <span>{site.name}</span>
          <span>{site.philosophy}</span>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}

import { pageMetadata } from "@/lib/metadata";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { AssetImage } from "@/components/ui/AssetImage";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { GridLines } from "@/components/ui/GridLines";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactCTA } from "@/components/home/ContactCTA";
import { cn } from "@/lib/utils";
import { WorkGalleryMotion } from "@/components/motion/WorkGalleryMotion";

export const metadata = pageMetadata({
  title: "Selected work",
  description: "Four conceptual studio projects across fashion, music, product design and contemporary culture.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <section aria-labelledby="work-index-title" className="surface-ink relative isolate pt-10 pb-(--section-y) md:pt-16">
        <GridLines />
        <Container>
          <SectionLabel className="mb-8">Index</SectionLabel>
          <EditorialHeading as="h1" id="work-index-title" size="xxl">
            Selected work.
          </EditorialHeading>

          <div className="grid-editorial mt-12 gap-y-6 md:mt-16">
            <p className="text-lede col-span-4 md:col-span-5 md:col-start-4 lg:col-span-5 lg:col-start-7">
              Four projects across fashion, music, product and culture. Each one started with a brief that refused the
              obvious answer.
            </p>
            <p className="text-meta col-span-4 text-muted md:col-span-5 md:col-start-4 lg:col-span-5 lg:col-start-7">
              Self-initiated studio concepts. The brands are fictional.
            </p>
          </div>

          <ol className="mt-16 border-b border-line md:mt-24" aria-label="Project index">
            {projects.map((project) => (
              <li key={project.slug} className="border-t border-line">
                <TransitionLink
                  href={`/work/${project.slug}`}
                  className="group grid-editorial items-baseline gap-y-1 py-4 transition-colors hover:text-lime md:py-5"
                >
                  <span className="text-meta col-span-1 text-muted">{project.number}</span>
                  <span className="text-display-sm col-span-3 md:col-span-3 lg:col-span-4">
                    {project.name} / {project.discipline}
                  </span>
                  <span className="text-meta col-span-3 col-start-2 text-muted md:col-span-3 md:col-start-auto lg:col-span-5">
                    {project.categories.join(" / ")}
                  </span>
                  <span className="text-meta hidden justify-self-end md:block md:col-span-1 lg:col-span-2">
                    {project.year}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-label="Projects" className="surface-ink pb-(--section-y)">
        <WorkGalleryMotion />
        <Container data-gallery-track="" className="space-y-24 md:space-y-36">
          {projects.map((project, index) => {
            const flipped = index % 2 === 1;
            return (
              <article
                key={project.slug}
                id={project.slug}
                data-gallery-panel=""
                className="grid-editorial items-end gap-y-8"
                aria-labelledby={`${project.slug}-title`}
              >
                <TransitionLink
                  href={`/work/${project.slug}`}
                  tabIndex={-1}
                  aria-hidden
                  data-gallery-media=""
                  data-cursor="view"
                  className={cn(
                    "group relative col-span-4 block aspect-[4/5] bg-surface sm:aspect-[3/2] md:col-span-8 lg:col-span-8",
                    flipped && "lg:order-2 lg:col-start-5",
                  )}
                >
                  <div data-reveal-frame="" className="absolute inset-0 overflow-hidden">
                    <div data-reveal-inner="" className="absolute inset-0">
                      <AssetImage
                        media={project.hero}
                        decorative
                        sizes="(min-width: 64rem) 66vw, 100vw"
                        className="transition-[scale] duration-700 ease-(--ease-editorial) group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                </TransitionLink>
                <div
                  data-gallery-meta=""
                  className={cn("col-span-4 md:col-span-6 lg:col-span-4", flipped && "lg:order-1 lg:col-start-1 lg:row-start-1")}
                >
                  <div data-reveal-meta="">
                    <p className="text-meta text-muted">
                      {project.number} / {project.year}
                    </p>
                    <h2 id={`${project.slug}-title`} className="text-display-md mt-3">
                      {project.name}
                      <span className="block text-muted">/ {project.discipline}</span>
                    </h2>
                  </div>
                  <div data-reveal-meta="">
                    <p className="text-lede mt-6 max-w-[28ch]">{project.summary}</p>
                    <p className="text-meta mt-4 text-muted">{project.categories.join(" / ")}</p>
                    <TransitionLink
                      href={`/work/${project.slug}`}
                      data-cursor="view"
                      className="text-meta mt-8 inline-flex min-h-11 items-center gap-2 border-b border-current hover:text-lime"
                    >
                      View case study<span className="sr-only"> for {project.name} / {project.discipline}</span>
                      <ArrowUpRight aria-hidden className="size-4" />
                    </TransitionLink>
                  </div>
                </div>
              </article>
            );
          })}
        </Container>
        {/* Only displayed in the desktop horizontal mode, where it tracks progress through the gallery. */}
        <div data-gallery-hud="" aria-hidden className="container-editorial text-meta hidden items-center gap-6 text-muted">
          <span>Scroll or drag</span>
          <span className="relative h-px flex-1 bg-line">
            <span data-gallery-progress="" className="absolute inset-0 bg-lime" />
          </span>
          <span>{String(projects.length).padStart(2, "0")} projects</span>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}

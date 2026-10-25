import { projects } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard, type ProjectCardFrame } from "@/components/work/ProjectCard";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { TransitionLink } from "@/components/motion/TransitionLink";

// A staggered static composition: each slot owns its grid placement and frame.
const slots: readonly { className: string; frame: ProjectCardFrame; sizes: string }[] = [
  { className: "md:col-span-8 lg:col-span-7", frame: "landscape", sizes: "(min-width: 64rem) 58vw, 100vw" },
  { className: "md:col-span-4 lg:col-span-4 lg:col-start-9 lg:mt-[16vw]", frame: "portrait", sizes: "(min-width: 64rem) 32vw, (min-width: 48rem) 50vw, 100vw" },
  { className: "md:col-span-4 lg:col-span-4 lg:col-start-2 lg:-mt-[6vw]", frame: "portrait", sizes: "(min-width: 64rem) 32vw, (min-width: 48rem) 50vw, 100vw" },
  { className: "md:col-span-8 lg:col-span-6 lg:col-start-7 lg:mt-[10vw]", frame: "wide", sizes: "(min-width: 64rem) 50vw, 100vw" },
];

export function SelectedWork() {
  return (
    <section aria-labelledby="work-title" className="surface-ink py-(--section-y)" data-scroll-section="work">
      <Container>
        <div className="grid-editorial items-end gap-y-6">
          <div className="col-span-4 md:col-span-6 lg:col-span-8">
            <SectionLabel className="mb-6">Selected work</SectionLabel>
            <EditorialHeading id="work-title" size="lg" lines={["Four briefs.", "No safe answers."]} />
          </div>
          <TransitionLink
            href="/work"
            data-cursor="explore"
            className="text-meta col-span-4 inline-flex min-h-11 items-center underline underline-offset-[6px] hover:text-lime md:col-span-2 md:justify-self-end lg:col-span-4"
          >
            All projects ({String(projects.length).padStart(2, "0")})
          </TransitionLink>
        </div>

        <ol className="grid-editorial mt-14 gap-y-16 md:mt-20 md:gap-y-20 lg:gap-y-0">
          <MediaReveal />
          {projects.map((project, index) => {
            const slot = slots[index % slots.length];
            return (
              <li key={project.slug} className={`col-span-4 ${slot.className}`}>
                <ProjectCard project={project} frame={slot.frame} sizes={slot.sizes} headingLevel="h3" />
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

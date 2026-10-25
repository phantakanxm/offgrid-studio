import type { Project } from "@/data/projects";
import { AssetImage } from "@/components/ui/AssetImage";
import { Container } from "@/components/ui/Container";
import { GridLines } from "@/components/ui/GridLines";
import { cn } from "@/lib/utils";

export function ProjectHero({ project }: { project: Project }) {
  const { treatment } = project;
  const inset = treatment.hero === "inset";

  return (
    <section aria-labelledby="project-title" className="surface-ink relative isolate" data-scroll-section="project-hero">
      <GridLines />
      {/*
        The title takes the full row because long names (FREQUENCY) need it. The summary sits beside the
        shorter discipline line, and the facts run along one row, so the campaign image starts on the first screen.
      */}
      <Container className="grid-editorial gap-y-8 pt-10 pb-10 md:pt-14 md:pb-12">
        <h1 id="project-title" className="col-span-4 md:col-span-8 lg:col-span-12 lg:col-start-1 lg:row-start-1">
          <span className="text-display-xxl block">{project.name}</span>{" "}
          <span className="text-display-lg mt-2 block text-(--project-accent) md:pl-[12%]">
            / {project.discipline}
          </span>
        </h1>

        <p className="text-lede col-span-4 max-w-[30ch] md:col-span-5 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-end lg:pb-[0.4em]">
          {project.summary}
        </p>

        <dl className="text-meta col-span-4 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-4 md:col-span-8 md:grid-cols-4 lg:col-span-12">
          <div>
            <dt className="text-muted">Case study</dt>
            <dd>{project.number}</dd>
          </div>
          <div>
            <dt className="text-muted">Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div className="col-span-2 md:col-span-1">
            <dt className="text-muted">Discipline</dt>
            <dd>{project.categories.join(" / ")}</dd>
          </div>
          <div className="col-span-2 md:col-span-1">
            <dt className="text-muted">Type</dt>
            <dd>Studio concept</dd>
          </div>
        </dl>
      </Container>

      <div className={cn(inset && "container-editorial pb-(--section-y)")}>
        <div
          className={cn(
            "relative w-full overflow-hidden bg-surface",
            inset ? "aspect-[4/5] sm:aspect-[16/10]" : "aspect-[4/5] sm:aspect-[3/2] lg:aspect-[16/9]",
          )}
        >
          <AssetImage media={project.hero} sizes={inset ? "(min-width: 110rem) 1680px, 95vw" : "100vw"} priority />
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getNextProject, getProject, projects, projectTitle } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { NextProject } from "@/components/work/NextProject";
import { ProjectArtifact } from "@/components/work/ProjectArtifact";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { ProjectHero } from "@/components/work/ProjectHero";

const categoryList = new Intl.ListFormat("en", { type: "conjunction" });

// Unknown slugs fall through to notFound() below. `dynamicParams = false` would also 404, but
// Next 16.2 logs an "Internal: NoFallbackError" server error for every such request.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};

  return pageMetadata({
    title: projectTitle(project),
    description: `${project.summary} A conceptual project by OFFGRID / STUDIO in ${categoryList.format(project.categories.map((c) => c.toLowerCase()))}.`,
    path: `/work/${project.slug}`,
    image: { url: `/og/${project.slug}.jpg`, alt: project.hero.alt },
  });
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const title = projectTitle(project);

  return (
    <article style={{ "--project-accent": project.treatment.accent } as CSSProperties}>
      <ProjectHero project={project} />

      <section aria-labelledby="concept-title" className="surface-paper py-(--section-y)">
        <Container className="grid-editorial gap-y-12 md:gap-y-16">
          <SectionLabel className="col-span-4 md:col-span-8 lg:col-span-3 lg:pt-3">Concept</SectionLabel>
          <EditorialHeading id="concept-title" size="xl" className="col-span-4 md:col-span-8 lg:col-span-9">
            {project.concept}
          </EditorialHeading>

          <div className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-4">
            <h3 className="text-meta border-t border-tone pt-4">The challenge</h3>
            <p className="text-lede mt-5">{project.challenge}</p>
          </div>

          <div className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-9">
            <h3 className="text-meta border-t border-tone pt-4">Concept &amp; art direction</h3>
            <p className="text-lede mt-5">{project.artDirection}</p>
          </div>

          <div className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-4">
            <h3 className="text-meta border-t border-tone pt-4">Visual direction</h3>
            <ul className="text-body mt-5 space-y-1">
              {project.visualDirection.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-9">
            <h3 className="text-meta border-t border-tone pt-4">Palette</h3>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {project.palette.map((swatch) => (
                <li key={swatch.hex}>
                  <span aria-hidden className="block aspect-square border border-ink/15" style={{ backgroundColor: swatch.hex }} />
                  <span className="text-meta mt-2 block">{swatch.name}</span>
                  <span className="text-meta block text-tone-muted">{swatch.hex}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <ProjectGallery images={project.gallery} layout={project.treatment.gallery} title={title} />

      <ProjectArtifact artifact={project.treatment.artifact} />

      <section aria-labelledby="approach-title" className="surface-paper py-(--section-y)">
        <Container>
          <div className="grid-editorial gap-y-6">
            <SectionLabel className="col-span-4 md:col-span-8 lg:col-span-3 lg:pt-3">Design approach</SectionLabel>
            <EditorialHeading id="approach-title" size="lg" className="col-span-4 md:col-span-8 lg:col-span-9">
              How it comes together.
            </EditorialHeading>
          </div>
          <ul className="grid-editorial mt-14 gap-y-10 md:mt-20">
            {project.approach.map((point) => (
              <li key={point.title} className="col-span-4 border-t border-tone pt-5 md:col-span-4 lg:col-span-4">
                <h3 className="text-display-sm">{point.title}</h3>
                <p className="text-body mt-4 max-w-[38ch] text-tone-muted">{point.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="outcome-title" className="surface-ink py-(--section-y)">
        <Container className="grid-editorial gap-y-8">
          <h2 id="outcome-title" className="text-meta col-span-4 md:col-span-8 lg:col-span-3 lg:pt-3">
            Concept outcome
          </h2>
          <p className="text-statement col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-4">{project.outcome}</p>
        </Container>
      </section>

      <NextProject project={getNextProject(project.slug)} />
    </article>
  );
}

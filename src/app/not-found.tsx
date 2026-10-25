import { TransitionLink } from "@/components/motion/TransitionLink";
import { projects } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { GridLines } from "@/components/ui/GridLines";

export default function NotFound() {
  return (
    <section className="surface-ink relative isolate flex min-h-[calc(100svh-var(--header-h))] items-center py-20">
      <GridLines />
      <Container>
        <p className="text-meta text-muted">Error 404</p>
        <EditorialHeading as="h1" size="xxl" lines={["Off the", "grid."]} className="mt-6" />
        <p className="text-lede mt-8 max-w-[38ch]">
          This page doesn’t exist, or it has moved. The work is still here.
        </p>
        <ul className="text-meta mt-10 flex flex-wrap gap-x-8 gap-y-2">
          <li>
            <TransitionLink href="/" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-lime">
              Back home
            </TransitionLink>
          </li>
          {projects.map((project) => (
            <li key={project.slug}>
              <TransitionLink href={`/work/${project.slug}`} className="inline-flex min-h-11 items-center hover:text-lime">
                {project.number} {project.name}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

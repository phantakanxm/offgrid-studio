import { TransitionLink } from "@/components/motion/TransitionLink";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { AssetImage } from "@/components/ui/AssetImage";
import { Container } from "@/components/ui/Container";

export function NextProject({ project }: { project: Project }) {
  return (
    <nav aria-label="Next project" className="surface-ink border-t border-line">
      <TransitionLink href={`/work/${project.slug}`} className="group block py-14 md:py-20" data-cursor="view">
        <Container className="grid-editorial items-end gap-y-8">
          <div className="col-span-4 md:col-span-5 lg:col-span-8">
            <p className="text-meta text-muted">Next project / {project.number}</p>
            <p className="text-display-xl mt-4 transition-colors duration-300 group-hover:text-lime">
              {project.name}
            </p>
            <p className="text-meta mt-4 flex items-center gap-2">
              {project.categories.join(" / ")}
              <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </p>
          </div>
          <div className="relative col-span-4 aspect-[3/2] overflow-hidden bg-surface md:col-span-3 lg:col-span-4">
            <AssetImage
              media={project.hero}
              decorative
              sizes="(min-width: 64rem) 32vw, (min-width: 48rem) 38vw, 100vw"
              className="transition-transform duration-700 ease-(--ease-editorial) group-hover:scale-[1.04]"
            />
          </div>
        </Container>
      </TransitionLink>
    </nav>
  );
}

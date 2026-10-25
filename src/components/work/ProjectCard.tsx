import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { AssetImage } from "@/components/ui/AssetImage";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { cn } from "@/lib/utils";

export type ProjectCardFrame = "landscape" | "portrait" | "wide";

const frameClass: Record<ProjectCardFrame, string> = {
  landscape: "aspect-[16/10]",
  portrait: "aspect-[4/5]",
  wide: "aspect-[3/2]",
};

interface ProjectCardProps {
  project: Project;
  frame: ProjectCardFrame;
  sizes: string;
  headingLevel: "h2" | "h3";
}

export function ProjectCard({ project, frame, sizes, headingLevel: Heading }: ProjectCardProps) {
  return (
    <TransitionLink href={`/work/${project.slug}`} className="group block" data-cursor="view" data-reveal="">
      <div data-reveal-frame="" className={cn("relative overflow-hidden bg-surface", frameClass[frame])}>
        {/* The reveal scales this wrapper; hover and focus scale the image inside, so they never fight. */}
        <div data-reveal-inner="" className="absolute inset-0">
          <AssetImage
            media={project.hero}
            sizes={sizes}
            decorative
            className="transition-[scale,translate] duration-700 ease-(--ease-editorial) group-hover:translate-x-[1%] group-hover:scale-[1.05] group-focus-visible:scale-[1.05]"
          />
        </div>
        <span data-reveal-meta="" className="text-meta absolute top-3 left-3 bg-ink px-2 py-1 text-paper">
          {project.number}
        </span>
        <span
          aria-hidden
          className="absolute right-3 bottom-3 grid size-11 translate-y-2 place-items-center bg-lime text-ink opacity-0 transition-[opacity,translate] duration-300 ease-(--ease-editorial) group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
        >
          <ArrowUpRight className="size-5" strokeWidth={2.25} />
        </span>
      </div>
      <div data-reveal-meta="" className="mt-4 flex items-baseline justify-between gap-4 border-t border-tone pt-3">
        <Heading className="text-display-sm decoration-lime decoration-2 underline-offset-[0.15em] group-hover:underline group-focus-visible:underline">
          {project.name} <span className="text-tone-muted">/ {project.discipline}</span>
        </Heading>
        <span className="text-meta shrink-0 text-tone-muted">{project.year}</span>
      </div>
      <p data-reveal-meta="" className="text-meta mt-2 text-tone-muted">
        {project.categories.join(" / ")}
      </p>
    </TransitionLink>
  );
}

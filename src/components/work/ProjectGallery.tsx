import type { ReactNode } from "react";
import type { Media } from "@/data/media";
import type { ProjectTreatment } from "@/data/projects";
import { AssetImage } from "@/components/ui/AssetImage";
import { Container } from "@/components/ui/Container";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { cn } from "@/lib/utils";

type GalleryLayout = ProjectTreatment["gallery"];

interface FigureProps {
  media: Media;
  sizes: string;
  className?: string;
  /** Crop to this frame instead of showing the image at its native ratio. */
  frame?: string;
  captionClassName?: string;
}

function GalleryFigure({ media, sizes, className, frame, captionClassName }: FigureProps) {
  return (
    <figure data-reveal="" className={className}>
      <div data-reveal-frame="" className={cn("relative overflow-hidden bg-surface", frame)}>
        <div data-reveal-inner="" className={cn(frame && "absolute inset-0")}>
          <AssetImage media={media} mode={frame ? "cover" : "intrinsic"} sizes={sizes} />
        </div>
      </div>
      {media.caption && (
        <figcaption data-reveal-meta="" className={cn("text-meta mt-3 flex gap-3 text-muted", captionClassName)}>
          <span aria-hidden className="mt-[0.35em] size-1.5 shrink-0 bg-(--project-accent)" />
          {media.caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * One gallery, four compositions. Each project keeps the same parts and reveal; only the
 * arrangement follows its subject: a fashion diptych, a stage with an overlapping detail,
 * quiet product stills, and an architectural wide frame with an offset detail.
 */
const layouts: Record<GalleryLayout, (images: readonly [Media, Media]) => ReactNode> = {
  diptych: ([editorial, detail]) => (
    <div className="grid gap-y-10 md:grid-cols-2 md:gap-y-0">
      <GalleryFigure media={editorial} sizes="(min-width: 48rem) 50vw, 100vw" captionClassName="container-editorial md:pr-0" />
      <GalleryFigure media={detail} sizes="(min-width: 48rem) 50vw, 100vw" captionClassName="container-editorial md:pl-4" />
    </div>
  ),
  stage: ([wide, detail]) => (
    <>
      <GalleryFigure media={wide} sizes="100vw" captionClassName="container-editorial md:pr-[50%]" />
      <Container className="grid-editorial">
        <GalleryFigure
          media={detail}
          sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 40vw, 70vw"
          className="relative col-span-3 col-start-2 mt-10 md:col-span-3 md:col-start-6 md:-mt-[18vw] lg:col-span-3 lg:col-start-9 lg:-mt-[14vw]"
        />
      </Container>
    </>
  ),
  still: ([editorial, detail]) => (
    <Container className="grid-editorial items-start gap-y-16 md:py-[6vw]">
      <GalleryFigure media={editorial} sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 45vw, 80vw" className="col-span-3 md:col-span-4 lg:col-span-4 lg:col-start-2" />
      <GalleryFigure
        media={detail}
        sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 35vw, 65vw"
        className="col-span-3 col-start-2 md:col-span-3 md:col-start-6 md:mt-[22vw] lg:col-span-3 lg:col-start-9 lg:mt-[16vw]"
      />
    </Container>
  ),
  spatial: ([wide, detail]) => (
    <Container className="grid-editorial items-end gap-y-12">
      <GalleryFigure media={wide} sizes="(min-width: 110rem) 1680px, 95vw" className="col-span-4 md:col-span-8 lg:col-span-12" />
      <GalleryFigure
        media={detail}
        sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 40vw, 70vw"
        className="col-span-3 md:col-span-4 lg:col-span-4 lg:col-start-2"
      />
    </Container>
  ),
};

export function ProjectGallery({ images, layout, title }: { images: readonly [Media, Media]; layout: GalleryLayout; title: string }) {
  return (
    <section aria-label={`${title} gallery`} className="surface-ink py-(--section-y)" data-scroll-section="gallery" data-gallery-layout={layout}>
      <MediaReveal />
      {layouts[layout](images)}
    </section>
  );
}

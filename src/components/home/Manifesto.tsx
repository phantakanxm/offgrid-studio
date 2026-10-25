import { brandMedia } from "@/data/media";
import { site } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextScrub } from "@/components/motion/TextScrub";

export function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="surface-paper py-(--section-y)" data-scroll-section="manifesto">
      <Container className="grid-editorial gap-y-10 md:gap-y-14">
        <SectionLabel className="col-span-4 md:col-span-8 lg:col-span-3 lg:pt-3">Manifesto</SectionLabel>

        <EditorialHeading
          id="manifesto-title"
          size="xl"
          lines={["We make", "digital feel", "different."]}
          splitWords
          className="col-span-4 md:col-span-8 lg:col-span-9"
        >
          <TextScrub />
        </EditorialHeading>

        <figure className="col-span-2 md:col-span-3 lg:col-span-3 lg:row-span-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink">
            <AssetImage media={brandMedia.orangeObject} sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 34vw, 48vw" />
          </div>
          <figcaption className="text-meta mt-3 text-tone-muted">Study in signal orange</figcaption>
        </figure>

        <div className="col-span-4 space-y-8 md:col-span-5 md:col-start-4 lg:col-span-5 lg:col-start-7">
          <p className="text-lede">
            We believe the best digital experiences do more than look good. They challenge expectations, create
            connections, and leave a lasting impression.
          </p>
          <p className="text-meta border-t border-tone pt-4">{site.philosophy}</p>
        </div>
      </Container>
    </section>
  );
}

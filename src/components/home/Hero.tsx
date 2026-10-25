import { ArrowDown } from "lucide-react";
import { brandMedia } from "@/data/media";
import { AssetImage } from "@/components/ui/AssetImage";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { GridLines } from "@/components/ui/GridLines";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="surface-ink relative isolate flex min-h-[calc(100svh-var(--header-h))] flex-col overflow-hidden"
      data-scroll-section="hero"
    >
      <GridLines />
      <Container className="relative flex flex-1 flex-col pt-5 pb-6 md:pt-6 md:pb-8">
        <div className="grid-editorial">
          <p data-intro="meta-1" className="text-meta col-span-3 md:col-span-4">
            Design / Development / Motion
          </p>
        </div>

        {/* Sits behind the headline from tablet up so the type can cut through the sculpture. */}
        <div data-intro="media" className="relative -mx-(--gutter) mt-4 aspect-square mix-blend-lighten md:absolute md:right-0 md:bottom-[30%] md:mx-0 md:mt-0 md:aspect-[1672/941] md:w-[86%] lg:top-6 lg:bottom-auto lg:w-[66%]">
          <AssetImage media={brandMedia.heroSculpture} priority sizes="(min-width: 64rem) 66vw, (min-width: 48rem) 86vw, 100vw" className="mask-feather" />
        </div>

        <EditorialHeading
          as="h1"
          id="hero-title"
          data-intro="title"
          size="xxl"
          lines={["We don’t", "do ordinary."]}
          className="relative z-10 -mt-[0.35em] text-paper mix-blend-difference md:mt-auto md:pt-[28vw] lg:pt-[18vw]"
        />

        <span aria-hidden data-intro="rule" className="mt-6 block h-[3px] w-full bg-lime md:mt-8" />

        <div className="grid-editorial mt-auto items-end gap-y-6 pt-8 md:mt-10 md:pt-0">
          <p data-intro="meta-2" className="text-lede col-span-4 max-w-[34ch] md:col-span-5 lg:col-span-4">
            Independent digital studio creating identities, experiences, and interactions for brands that refuse to
            blend in.
          </p>
          <a
            data-intro="meta-3"
            href="#manifesto"
            className="text-meta col-span-4 inline-flex min-h-11 items-center gap-2 justify-self-start hover:text-lime md:col-span-3 md:col-start-6 md:justify-self-end lg:col-span-2 lg:col-start-11"
          >
            Scroll
            <ArrowDown aria-hidden className="size-4" />
          </a>
        </div>
      </Container>
    </section>
  );
}

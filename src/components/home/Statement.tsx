import { brandMedia } from "@/data/media";
import { site } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";
import { Container } from "@/components/ui/Container";
import { StatementMotion } from "@/components/motion/StatementMotion";

export function Statement() {
  return (
    <section
      aria-labelledby="statement-title"
      className="surface-ink relative isolate flex min-h-[78svh] items-center overflow-hidden py-(--section-y)"
      data-scroll-section="statement"
    >
      <StatementMotion />
      <div data-statement-bg="" className="absolute inset-0 -z-10">
        <AssetImage media={brandMedia.graphicTexture} sizes="100vw" />
      </div>
      {/* Starts collapsed (scaleY 0) so the static layout is unchanged; motion grows it into the CTA below. */}
      <div aria-hidden data-statement-band="" className="absolute inset-x-0 top-0 -bottom-px -z-10 origin-bottom bg-lime" style={{ transform: "scaleY(0)" }} />
      <Container>
        {/* Solid ink plates keep the type legible over the busy texture. */}
        <h2 id="statement-title" className="text-display-xl">
          <span data-statement-line="" className="block">
            <span className="inline-block bg-ink px-[0.12em] pt-[0.1em] pb-[0.02em]">Good design</span>
          </span>{" "}
          <span data-statement-line="" className="block md:pl-[16.66%]">
            <span className="inline-block bg-ink px-[0.12em] pt-[0.1em] pb-[0.02em]">isn’t quiet.</span>
          </span>
        </h2>
        <p className="text-meta mt-6 inline-block bg-lime px-3 py-2 text-ink md:ml-[16.66%]">{site.philosophy}</p>
      </Container>
    </section>
  );
}

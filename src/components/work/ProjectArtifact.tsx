import type { ComponentType } from "react";
import type { ProjectTreatment } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ModularMark } from "./artifacts/ModularMark";
import { RiftFracture } from "./artifacts/RiftFracture";
import { SingleLine } from "./artifacts/SingleLine";
import { TempoSculpture } from "./artifacts/TempoSculpture";

type ArtifactKind = ProjectTreatment["artifact"];

/** Each project's idea, built in code: same section frame, a different small piece inside. */
const artifacts: Record<ArtifactKind, { heading: string; caption: string; Artifact: ComponentType }> = {
  fracture: {
    heading: "Open the rift.",
    caption: "Concept. The fracture in the wordmark, opened by scroll, pointer or slider.",
    Artifact: RiftFracture,
  },
  tempo: {
    heading: "Change the tempo.",
    caption: "Concept. One ribbon language, reshaped by tempo, as the key visual family could flex.",
    Artifact: TempoSculpture,
  },
  line: {
    heading: "One line, one light.",
    caption: "Concept. The lamp as a single continuous line, with its specifications in the margins.",
    Artifact: SingleLine,
  },
  modular: {
    heading: "Flex the mark.",
    caption: "Concept. The frame and the arc cropped, rotated and scaled inside one tile.",
    Artifact: ModularMark,
  },
};

export function ProjectArtifact({ artifact }: { artifact: ArtifactKind }) {
  const { heading, caption, Artifact } = artifacts[artifact];
  return (
    <section aria-labelledby="artifact-title" className="surface-ink pb-(--section-y)" data-scroll-section="artifact" data-artifact={artifact}>
      <Container className="border-t border-line pt-6 md:pt-8">
        <div className="grid-editorial gap-y-6">
          <SectionLabel className="col-span-4 md:col-span-8 lg:col-span-3 lg:pt-3">In the browser</SectionLabel>
          <EditorialHeading id="artifact-title" size="lg" className="col-span-4 md:col-span-8 lg:col-span-9">
            {heading}
          </EditorialHeading>
        </div>
        <figure className="mt-14 md:mt-20">
          <Artifact />
          <figcaption className="text-meta mt-8 flex gap-3 text-muted">
            <span aria-hidden className="mt-[0.35em] size-1.5 shrink-0 bg-(--project-accent)" />
            {caption}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

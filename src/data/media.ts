export interface Media {
  src: `/images/${string}.webp`;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position used when the image is cropped to fill a frame. */
  focus?: string;
  caption?: string;
}

export const brandMedia = {
  heroSculpture: {
    src: "/images/offgrid/hero-sculpture.webp",
    alt: "Acid-lime ribbon sculpture twisting into a loop on a black studio floor.",
    width: 1672,
    height: 941,
  },
  sculptureDetail: {
    src: "/images/offgrid/sculpture-detail.webp",
    alt: "Close crop of interlocking acid-lime ribbon forms with a matte, grainy surface.",
    width: 1122,
    height: 1402,
  },
  studioWorkspace: {
    src: "/images/offgrid/studio-workspace.webp",
    alt: "Long industrial studio with concrete walls, black worktables and printed layouts in lime and orange.",
    width: 1536,
    height: 1024,
  },
  studioProcess: {
    src: "/images/offgrid/studio-process.webp",
    alt: "Sunlit desk covered with print proofs, sketches and a laptop showing a black-and-white layout.",
    width: 1122,
    height: 1402,
  },
  graphicTexture: {
    src: "/images/offgrid/graphic-texture.webp",
    alt: "",
    width: 1672,
    height: 941,
  },
  orangeObject: {
    src: "/images/offgrid/orange-object.webp",
    alt: "Angular signal-orange ribbon sculpture folded into sharp planes against black.",
    width: 1122,
    height: 1402,
  },
} as const satisfies Record<string, Media>;

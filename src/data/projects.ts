import type { Media } from "./media";

export const projectSlugs = ["rift", "frequency", "mono", "signal"] as const;
export type ProjectSlug = (typeof projectSlugs)[number];

export interface Swatch {
  name: string;
  hex: `#${string}`;
}

export interface ApproachPoint {
  title: string;
  body: string;
}

/**
 * How a case study varies within the shared template. The accent is a text-safe tint of the
 * project palette (at least 4.5:1 on ink) used for the discipline line and small markers.
 */
export interface ProjectTreatment {
  accent: `#${string}`;
  /** "bleed" runs the hero image edge to edge; "inset" frames it with the page margins. */
  hero: "bleed" | "inset";
  /** diptych: full-bleed pair. stage: full-bleed wide frame with an overlapping detail.
   *  still: two small frames with generous space. spatial: wide frame with an offset detail. */
  gallery: "diptych" | "stage" | "still" | "spatial";
  /** The code-built piece that demonstrates the project idea in the browser. fracture: the RIFT
   *  wordmark split open. tempo: a ribbon reshaped by BPM. line: the lamp drawn as one line.
   *  modular: the frame and arc cropped, rotated and scaled. */
  artifact: "fracture" | "tempo" | "line" | "modular";
}

export interface Project {
  slug: ProjectSlug;
  number: string;
  name: string;
  discipline: string;
  categories: readonly string[];
  year: number;
  summary: string;
  concept: string;
  visualDirection: readonly string[];
  challenge: string;
  artDirection: string;
  approach: readonly ApproachPoint[];
  outcome: string;
  palette: readonly Swatch[];
  hero: Media;
  /** A wide or editorial frame first, then a close detail. */
  gallery: readonly [Media, Media];
  treatment: ProjectTreatment;
}

export const projects: readonly Project[] = [
  {
    slug: "rift",
    number: "001",
    treatment: { accent: "#F0402C", hero: "bleed", gallery: "diptych", artifact: "fracture" },
    name: "Rift",
    discipline: "Apparel",
    categories: ["Fashion", "Brand Identity", "Digital"],
    year: 2026,
    summary: "Streetwear for a generation that refuses to fit in.",
    concept: "Made to disrupt.",
    visualDirection: [
      "Avant-garde streetwear",
      "Brutalist architecture",
      "Black technical fashion",
      "Signal-red accents",
    ],
    challenge:
      "Streetwear is saturated with logo drops and recycled hype. RIFT needed to read as architecture rather than merchandise: severe, considered and impossible to mistake for anyone else.",
    artDirection:
      "We shot the collection against raw concrete and let brutalist volumes do the work of a set. Black technical layers absorb the light, and a single slab of signal red cuts through every frame as the label’s only accent.",
    approach: [
      {
        title: "Identity",
        body: "A condensed wordmark built around one deliberate fracture in the letterforms. The rift itself becomes the logo.",
      },
      {
        title: "Campaign",
        body: "Hard light, long shadows and architectural framing. Models are placed like objects in space, never posed like advertising.",
      },
      {
        title: "Digital",
        body: "A product-first storefront concept with an uncompromising black interface, oversized type and red reserved for the moments that matter.",
      },
    ],
    outcome:
      "An identity system, campaign art direction and digital flagship concept that give RIFT a voice as rigid as the buildings it was shot in, built to scale from hangtag to billboard.",
    palette: [
      { name: "Technical Black", hex: "#0E0E0E" },
      { name: "Signal Red", hex: "#D62718" },
      { name: "Raw Concrete", hex: "#7D7A75" },
    ],
    hero: {
      src: "/images/projects/rift/hero.webp",
      alt: "Model in an oversized black technical jacket and wide trousers standing in a concrete corridor lit by a red wall.",
      width: 1672,
      height: 941,
      focus: "64% 50%",
    },
    gallery: [
      {
        src: "/images/projects/rift/editorial.webp",
        alt: "Low-angle portrait of a model in a black hooded jacket against raw concrete and a red-lit wall.",
        width: 1122,
        height: 1402,
        caption: "Campaign. Concrete as set, red as signal.",
      },
      {
        src: "/images/projects/rift/detail.webp",
        alt: "Close crop of a matte black technical jacket with drawcords, storm flap and hood.",
        width: 1122,
        height: 1402,
        caption: "Detail. Technical layers that absorb the light.",
      },
    ],
  },
  {
    slug: "frequency",
    number: "002",
    treatment: { accent: "#A56BFF", hero: "bleed", gallery: "stage", artifact: "tempo" },
    name: "Frequency",
    discipline: "Festival",
    categories: ["Music", "Art Direction", "Motion"],
    year: 2026,
    summary: "Sound without boundaries.",
    concept: "Sound without boundaries.",
    visualDirection: [
      "Sculptural sound waves",
      "Electric violet",
      "Acid lime",
      "Signal orange",
      "Immersive electronic music culture",
    ],
    challenge:
      "Electronic music festivals tend to look the same: lasers, line-ups, logos. FREQUENCY wanted an identity that felt like the sound itself, fluid and physical, impossible to pin to a single poster.",
    artDirection:
      "We turned sound into sculpture. Glass-like ribbons of violet, lime and orange loop and fold like waveforms caught mid-air, carrying through from key visual to stage design to motion.",
    approach: [
      {
        title: "Key visual",
        body: "A family of rendered sound sculptures, each shaped by a different tempo, replaces the conventional headliner poster.",
      },
      {
        title: "Stage",
        body: "The sculpture scales up into a central stage concept, so the brand becomes something the crowd stands inside rather than looks at.",
      },
      {
        title: "Motion",
        body: "Looping waveform animation gives every screen, from ticket page to LED wall, the same living pulse.",
      },
    ],
    outcome:
      "An art direction system built to move. One sculptural language flexes across print, screens and physical space, giving FREQUENCY a signature that never depends on a static logo lock-up.",
    palette: [
      { name: "Electric Violet", hex: "#8C3BFF" },
      { name: "Acid Lime", hex: "#D9FF43" },
      { name: "Signal Orange", hex: "#FF5A36" },
      { name: "Void", hex: "#07080D" },
    ],
    hero: {
      src: "/images/projects/frequency/hero.webp",
      alt: "Translucent ribbon sculpture glowing violet, lime and orange, looping above a reflective black floor.",
      width: 1672,
      height: 941,
      focus: "55% 50%",
    },
    gallery: [
      {
        src: "/images/projects/frequency/live.webp",
        alt: "Packed arena facing a giant looping light sculpture on stage, with lime laser beams cutting through violet haze.",
        width: 1536,
        height: 1024,
        caption: "Stage concept. The key visual at architectural scale.",
      },
      {
        src: "/images/projects/frequency/detail.webp",
        alt: "Close view of glass-like ribbons twisting in violet, orange and lime light.",
        width: 1122,
        height: 1402,
        caption: "Detail. A waveform caught mid-air.",
      },
    ],
  },
  {
    slug: "mono",
    number: "003",
    treatment: { accent: "#B4B6B8", hero: "inset", gallery: "still", artifact: "line" },
    name: "Mono",
    discipline: "Objects",
    categories: ["Product", "Art Direction", "Digital"],
    year: 2026,
    summary: "Form follows feeling.",
    concept: "Form follows feeling.",
    visualDirection: [
      "Sculptural industrial product design",
      "Brushed aluminium",
      "Graphite environments",
      "Warm-white lighting",
    ],
    challenge:
      "MONO designs lighting reduced to a single continuous gesture. The objects needed to be presented with the same restraint, letting material and light carry the story without slipping into sterile catalogue photography.",
    artDirection:
      "Brushed aluminium against graphite concrete, lit by one warm-white source. Every image is composed like a still life: one object, one shadow, one line of light.",
    approach: [
      {
        title: "Product imagery",
        body: "Low, raking light reveals the grain of the metal and the curve of each bend, so the craftsmanship is visible rather than described.",
      },
      {
        title: "Identity",
        body: "A quiet wordmark and a strict grid echo the single-line construction of the objects themselves.",
      },
      {
        title: "Digital",
        body: "A slow, image-led catalogue concept where each object gets a full screen and specifications sit quietly in the margins.",
      },
    ],
    outcome:
      "A product art direction and digital catalogue concept that treats every lamp as sculpture: calm, tactile and precise enough to let the objects speak for themselves.",
    palette: [
      { name: "Graphite", hex: "#2B2B2A" },
      { name: "Brushed Aluminium", hex: "#B4B6B8" },
      { name: "Warm White", hex: "#F4E7D0" },
      { name: "Concrete", hex: "#6E6A63" },
    ],
    hero: {
      src: "/images/projects/mono/hero.webp",
      alt: "Curved brushed-aluminium desk lamp on a dark stone plinth, casting a warm glow in a graphite room.",
      width: 1672,
      height: 941,
      focus: "70% 50%",
    },
    gallery: [
      {
        src: "/images/projects/mono/editorial.webp",
        alt: "Brushed-aluminium lamp bent from a single strip, lit by warm sunlight against a concrete wall.",
        width: 1122,
        height: 1402,
        caption: "Still life. One object, one shadow, one line of light.",
      },
      {
        src: "/images/projects/mono/detail.webp",
        alt: "Close detail of the lamp’s brushed metal bend and its warm-white light strip.",
        width: 1122,
        height: 1402,
        caption: "Detail. The grain of the metal, the curve of the bend.",
      },
    ],
  },
  {
    slug: "signal",
    number: "004",
    treatment: { accent: "#F04B22", hero: "bleed", gallery: "spatial", artifact: "modular" },
    name: "Signal",
    discipline: "Culture",
    categories: ["Culture", "Identity", "Experience"],
    year: 2026,
    summary: "Culture is a signal.",
    concept: "Beyond the frame.",
    visualDirection: [
      "Contemporary art installation",
      "Cobalt blue",
      "Vermilion orange",
      "Architectural exhibition photography",
    ],
    challenge:
      "SIGNAL is a contemporary art programme built around large-scale installation. Its identity had to hold its own beside monumental work without competing with it, and travel beyond the gallery walls.",
    artDirection:
      "Cobalt frames and a vermilion arc became the programme’s visual vocabulary: two primary forms in conversation, documented in bright architectural photography that keeps people in the frame for scale.",
    approach: [
      {
        title: "Identity",
        body: "A modular mark drawn from the frame and the arc, flexible enough to crop, rotate and scale across every touchpoint.",
      },
      {
        title: "Exhibition",
        body: "Wayfinding and wall graphics use the same two colours at architectural scale, so the identity becomes part of the space.",
      },
      {
        title: "Experience",
        body: "A digital programme guide that mirrors the gallery walk, moving visitors from overview to detail at their own pace.",
      },
    ],
    outcome:
      "An identity and exhibition system that frames the work instead of decorating it. Bold enough to read from across a hall, quiet enough to let the art lead.",
    palette: [
      { name: "Cobalt", hex: "#1E4FD6" },
      { name: "Vermilion", hex: "#F04B22" },
      { name: "Gallery White", hex: "#EEEAE3" },
      { name: "Polished Concrete", hex: "#A7A29A" },
    ],
    hero: {
      src: "/images/projects/signal/hero.webp",
      alt: "Cobalt-blue rectangular frames and a vermilion ring installed in a bright white gallery with a polished floor.",
      width: 1672,
      height: 941,
      focus: "60% 50%",
    },
    gallery: [
      {
        src: "/images/projects/signal/exhibition.webp",
        alt: "Visitors walking around the cobalt and vermilion installation in a tall, sunlit gallery.",
        width: 1536,
        height: 1024,
        caption: "Exhibition. People in the frame for scale.",
      },
      {
        src: "/images/projects/signal/detail.webp",
        alt: "Close view of a vermilion arc passing in front of a cobalt pillar.",
        width: 1122,
        height: 1402,
        caption: "Detail. Two primary forms in conversation.",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: ProjectSlug): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

export function projectTitle(project: Project): string {
  return `${project.name} / ${project.discipline}`;
}

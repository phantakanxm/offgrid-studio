export interface SocialLink {
  label: string;
  /** null until the studio supplies a real profile URL. */
  href: string | null;
}

/** The person who designed and built this portfolio piece. Each field is null until they supply it. */
export interface Author {
  name: string | null;
  portfolioUrl: string | null;
  repositoryUrl: string | null;
}

const author: Author = { name: null, portfolioUrl: null, repositoryUrl: null };

export const site = {
  name: "OFFGRID / STUDIO",
  wordmark: "OFFGRID",
  tagline: "We don’t do ordinary.",
  philosophy: "Break the grid. Keep the intention.",
  description:
    "Independent digital studio creating identities, experiences, and interactions for brands that refuse to blend in.",
  /** Set NEXT_PUBLIC_SITE_URL in production. Canonical URLs are only emitted when it exists. */
  productionUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || null,
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000",
  /** Reserved .example domain: a placeholder until a real inbox exists. */
  email: { address: "hello@offgrid.example", isPlaceholder: true },
  socials: [
    { label: "Instagram", href: null },
    { label: "LinkedIn", href: null },
    { label: "Are.na", href: null },
  ] satisfies SocialLink[],
  author,
} as const;

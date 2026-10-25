import type { Metadata } from "next";
import { site } from "@/data/site";

interface PageMetadataInput {
  /** Omit for the homepage, which uses the full studio title. */
  title?: string;
  description: string;
  path: `/${string}`;
  image?: { url: `/og/${string}.jpg`; alt: string };
}

const defaultImage = { url: "/og/offgrid.jpg", alt: "Acid-lime ribbon sculpture twisting on a black studio floor." } as const;

export const homeTitle = `${site.name}: ${site.tagline}`;

/**
 * Per-page title, description, Open Graph and Twitter cards. Open Graph fields do not inherit the
 * page title in Next, so every page builds them here instead of falling back to the layout's.
 */
export function pageMetadata({ title, description, path, image = defaultImage }: PageMetadataInput): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : homeTitle;
  const images = [{ ...image, width: 1200, height: 630 }];
  return {
    title: title ?? { absolute: homeTitle },
    description,
    alternates: site.productionUrl ? { canonical: path } : undefined,
    openGraph: { type: "website", siteName: site.name, url: path, title: fullTitle, description, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image.url] },
  };
}

import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/work", ...projects.map((project) => `/work/${project.slug}`), "/studio", "/contact", "/colophon"];
  return paths.map((path) => ({ url: `${site.url}${path === "/" ? "" : path}` }));
}

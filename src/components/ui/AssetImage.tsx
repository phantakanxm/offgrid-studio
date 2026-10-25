import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { Media } from "@/data/media";
import { cn } from "@/lib/utils";

interface AssetImageProps {
  media: Media;
  sizes: string;
  /** "cover" fills a positioned parent and crops around media.focus; "intrinsic" keeps the native aspect ratio. */
  mode?: "cover" | "intrinsic";
  /** The above-the-fold hero: fetched eagerly at high priority. It is already in the server HTML. */
  priority?: boolean;
  /** Use inside links whose text already names the subject. */
  decorative?: boolean;
  className?: string;
}

// Pages are statically generated, so this runs at build time against the real public folder.
function assetExists(src: string) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

export function AssetImage({ media, sizes, mode = "cover", priority = false, decorative = false, className }: AssetImageProps) {
  const alt = decorative ? "" : media.alt;

  if (!assetExists(media.src)) {
    return <MissingAsset media={media} mode={mode} className={className} />;
  }

  if (mode === "intrinsic") {
    return (
      <Image
        src={media.src}
        alt={alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        className={cn("h-auto w-full", className)}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={alt}
      fill
      sizes={sizes}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      className={cn("object-cover", className)}
      style={{ objectPosition: media.focus ?? "50% 50%" }}
    />
  );
}

function MissingAsset({ media, mode, className }: Pick<AssetImageProps, "media" | "mode" | "className">) {
  return (
    <div
      role="img"
      aria-label={`Image not available: ${media.alt || media.src}`}
      className={cn(
        "flex flex-col justify-end gap-1 border border-dashed border-current bg-surface p-4 text-paper",
        mode === "cover" ? "absolute inset-0" : "w-full",
        className,
      )}
      style={mode === "intrinsic" ? { aspectRatio: `${media.width} / ${media.height}` } : undefined}
    >
      <span className="text-meta text-signal">Missing asset</span>
      <span className="text-meta break-all text-muted">{media.src}</span>
    </div>
  );
}

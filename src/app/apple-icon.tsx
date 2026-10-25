import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same loader as icon.tsx: TTF for Satori, subset to the glyphs drawn, fetched at build time.
async function loadSpaceGrotesk(text: string) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&text=${text}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Space Grotesk 700 could not be loaded for the apple icon");
  return (await fetch(url)).arrayBuffer();
}

// iOS rounds the corners itself, so the lime runs edge to edge.
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#D9FF43",
          color: "#111111",
          fontFamily: "Space Grotesk",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        OG
      </div>
    ),
    { ...size, fonts: [{ name: "Space Grotesk", data: await loadSpaceGrotesk("OG"), weight: 700, style: "normal" }] },
  );
}

import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Satori needs TTF/OTF, which Google Fonts serves to clients without a browser user agent.
// `text` subsets the file to the glyphs drawn. Runs once at build time; the icon is static.
async function loadSpaceGrotesk(text: string) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&text=${text}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Space Grotesk 700 could not be loaded for the app icon");
  return (await fetch(url)).arrayBuffer();
}

export default async function Icon() {
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
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        O
      </div>
    ),
    { ...size, fonts: [{ name: "Space Grotesk", data: await loadSpaceGrotesk("O"), weight: 700, style: "normal" }] },
  );
}

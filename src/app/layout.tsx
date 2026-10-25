import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { site } from "@/data/site";
import { homeTitle } from "@/lib/metadata";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { PageTransition } from "@/components/motion/PageTransition";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-space-grotesk" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

// Defaults for routes without their own metadata (the 404 page). Pages use pageMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: homeTitle, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, images: [{ url: "/og/offgrid.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
};

// Runs before first paint on a full load of the homepage with motion allowed. It starts the CSS
// entrance in globals.css, which therefore plays from the first frame instead of waiting for
// hydration, and clears the flag once the sequence has finished. Client-side visits never set it.
const introScript = `try{if(location.pathname==="/"&&matchMedia("(prefers-reduced-motion: no-preference)").matches){var d=document.documentElement;d.dataset.intro="play";setTimeout(function(){delete d.dataset.intro},2600)}}catch(e){}`;

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The intro script adds data-intro to <html> before React hydrates.
    <html lang="en" className={`${spaceGrotesk.variable} ${geist.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="surface-ink font-sans">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="pt-(--header-h) outline-none">
          {children}
        </main>
        <Footer />
        <PageTransition />
        <CustomCursor />
        <MotionRuntime />
      </body>
    </html>
  );
}

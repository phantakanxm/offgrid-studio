import { site } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Services } from "@/components/home/Services";
import { Statement } from "@/components/home/Statement";

export const metadata = pageMetadata({ description: site.description, path: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <SelectedWork />
      <Services />
      <Statement />
      <ContactCTA />
    </>
  );
}

import { Container } from "@/components/ui/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { EditorialHeading } from "@/components/ui/EditorialHeading";

export function ContactCTA() {
  return (
    <section aria-labelledby="cta-title" className="surface-lime py-(--section-y)" data-scroll-section="contact-cta">
      <Container className="grid-editorial gap-y-10 md:gap-y-14">
        <EditorialHeading
          id="cta-title"
          size="lg"
          lines={["Got something weird?", "Let’s make it real."]}
          className="col-span-4 md:col-span-8 lg:col-span-11"
        />
        <p className="text-lede col-span-4 max-w-[36ch] md:col-span-4 lg:col-span-4">
          Tell us about the brand, the problem, or the strange idea you can’t shake. We’ll tell you how we would
          approach it.
        </p>
        <div className="col-span-4 self-end md:col-span-4 md:justify-self-end lg:col-span-4 lg:col-start-9">
          <CtaLink href="/contact" className="w-full md:w-auto">
            Start a project
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}

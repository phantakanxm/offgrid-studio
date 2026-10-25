import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { projectTypeParam } from "@/lib/inquiry";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TransitionLink } from "@/components/motion/TransitionLink";

export function Services({ label = "Services" }: { label?: string }) {
  return (
    <section aria-labelledby="services-title" className="surface-paper py-(--section-y)" data-scroll-section="services">
      <Container>
        <div className="grid-editorial gap-y-6">
          <SectionLabel className="col-span-4 md:col-span-8 lg:col-span-3 lg:pt-3">{label}</SectionLabel>
          <EditorialHeading id="services-title" size="xl" className="col-span-4 md:col-span-8 lg:col-span-9">
            What we do.
          </EditorialHeading>
        </div>

        <ol className="mt-14 border-b border-tone md:mt-20">
          {services.map((service) => (
            <li key={service.number} className="border-t border-tone">
              {/* Each row starts an inquiry with the service preselected. A lime fill sweeps in on hover and focus. */}
              <TransitionLink
                href={`/contact?${projectTypeParam}=${encodeURIComponent(service.projectType)}`}
                className="group grid-editorial relative isolate items-baseline gap-y-3 py-6 pr-10 md:pr-12 [--focus:var(--ink)] before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-lime before:transition-[scale] before:duration-500 before:ease-(--ease-editorial) hover:before:scale-x-100 focus-visible:before:scale-x-100 md:py-9"
              >
                <span className="text-meta col-span-1 transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink">
                  {service.number}
                </span>
                <h3 className="text-display-md col-span-3 transition-[translate] duration-500 ease-(--ease-editorial) group-hover:translate-x-[0.25em] group-focus-visible:translate-x-[0.25em] md:col-span-4 lg:col-span-6">
                  {service.name}
                </h3>
                <p className="text-body col-span-3 col-start-2 max-w-[40ch] text-tone-muted md:col-span-3 md:col-start-6 lg:col-span-4 lg:col-start-9">
                  {service.description}
                  <span className="sr-only"> Start a {service.name} inquiry.</span>
                </p>
                <ArrowUpRight
                  aria-hidden
                  strokeWidth={2.25}
                  className="absolute top-6 right-0 size-6 -translate-x-2 translate-y-2 opacity-0 transition-[opacity,translate] duration-300 ease-(--ease-editorial) group-hover:translate-0 group-hover:opacity-100 group-focus-visible:translate-0 group-focus-visible:opacity-100 md:top-9 [@media(hover:none)]:translate-0 [@media(hover:none)]:opacity-60"
                />
              </TransitionLink>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

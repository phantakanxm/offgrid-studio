"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EditorialHeading } from "@/components/ui/EditorialHeading";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="surface-ink flex min-h-[calc(100svh-var(--header-h))] items-center py-20">
      <Container>
        <p className="text-meta text-muted">Something went wrong</p>
        <EditorialHeading as="h1" size="xl" className="mt-6">
          This page didn’t load.
        </EditorialHeading>
        <p className="text-lede mt-8 max-w-[40ch]">Try loading it again. If it keeps happening, head back to the homepage.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="text-meta min-h-12 bg-lime px-5 text-ink hover:bg-signal">
            Try again
          </button>
          <Link href="/" className="text-meta inline-flex min-h-12 items-center px-5 underline underline-offset-4 hover:text-lime">
            Back home
          </Link>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  budgetRanges,
  inquirySchema,
  parseProjectType,
  projectTypeParam,
  projectTypes,
  type Inquiry,
  type InquiryInput,
} from "@/lib/inquiry";
import { useMagnetic } from "@/components/motion/useMagnetic";
import { cn } from "@/lib/utils";

const emptyInquiry: InquiryInput = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  description: "",
};

const controlClass =
  "text-lede w-full rounded-none border-0 border-b border-ink/40 bg-transparent px-0 py-3 text-ink placeholder:text-muted-strong/70 transition-colors hover:border-ink focus:border-ink aria-invalid:border-signal-strong";

export function InquiryForm() {
  // Lives only in component state: nothing is sent, persisted or logged.
  const [checked, setChecked] = useState<Inquiry | null>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const submitRef = useMagnetic<HTMLButtonElement>({ pull: 10, labelPull: 4, dependencies: [checked] });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput, unknown, Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: emptyInquiry,
  });

  useEffect(() => {
    if (checked) confirmationRef.current?.focus();
  }, [checked]);

  // Service rows link here with ?type=…; read once on mount so the page itself stays static.
  useEffect(() => {
    const preselected = parseProjectType(new URLSearchParams(window.location.search).get(projectTypeParam));
    if (preselected) setValue("projectType", preselected);
  }, [setValue]);

  if (checked) {
    return (
      <div className="border border-ink p-6 md:p-10" role="status">
        <p className="text-meta mb-6 inline-block bg-signal px-2 py-1 text-ink">Demo only. Not sent</p>
        <h2 ref={confirmationRef} tabIndex={-1} className="text-display-md">
          Inquiry checked.
        </h2>
        <p className="text-body mt-4 max-w-[52ch]">
          Everything you entered is valid. Because this site has no inbox connected yet, nothing was sent, saved or
          stored. Your details stayed in this browser tab and disappear when you clear the form or leave the page.
        </p>

        <dl className="mt-8 grid gap-x-6 gap-y-4 border-t border-ink pt-6 sm:grid-cols-[10rem_1fr]">
          <SummaryRow label="Name">{checked.name}</SummaryRow>
          <SummaryRow label="Email">{checked.email}</SummaryRow>
          {checked.company && <SummaryRow label="Company / brand">{checked.company}</SummaryRow>}
          <SummaryRow label="Project type">{checked.projectType}</SummaryRow>
          {checked.budget && <SummaryRow label="Budget range">{checked.budget}</SummaryRow>}
          <SummaryRow label="Description">
            <span className="whitespace-pre-line">{checked.description}</span>
          </SummaryRow>
        </dl>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setChecked(null)}
            className="text-meta min-h-12 border border-ink px-5 transition-colors hover:bg-ink hover:text-paper"
          >
            Edit inquiry
          </button>
          <button
            type="button"
            onClick={() => {
              reset(emptyInquiry);
              setChecked(null);
            }}
            className="text-meta min-h-12 px-5 underline underline-offset-4 hover:text-signal"
          >
            Clear form
          </button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(setChecked)} className="space-y-10" aria-describedby="inquiry-demo-note">
      <div className="grid gap-10 md:grid-cols-2 md:gap-x-8">
        <Field label="Name" error={errors.name?.message}>
          {(props) => <input {...props} {...register("name")} type="text" autoComplete="name" className={controlClass} />}
        </Field>
        <Field label="Email" error={errors.email?.message}>
          {(props) => (
            <input {...props} {...register("email")} type="email" autoComplete="email" inputMode="email" className={controlClass} />
          )}
        </Field>
      </div>

      <Field label="Company / brand" optional error={errors.company?.message}>
        {(props) => <input {...props} {...register("company")} type="text" autoComplete="organization" className={controlClass} />}
      </Field>

      <div className="grid gap-10 md:grid-cols-2 md:gap-x-8">
        <Field label="Project type" error={errors.projectType?.message}>
          {(props) => (
            <SelectFrame>
              <select {...props} {...register("projectType")} className={cn(controlClass, "cursor-pointer appearance-none pr-8")}>
                <option value="">
                  Choose one
                </option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </SelectFrame>
          )}
        </Field>
        <Field label="Budget range" optional error={errors.budget?.message}>
          {(props) => (
            <SelectFrame>
              <select {...props} {...register("budget")} className={cn(controlClass, "cursor-pointer appearance-none pr-8")}>
                <option value="">Not specified</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </SelectFrame>
          )}
        </Field>
      </div>

      <Field label="Project description" hint="What are you making, who is it for, and what does success look like?" error={errors.description?.message}>
        {(props) => <textarea {...props} {...register("description")} rows={6} className={cn(controlClass, "resize-y")} />}
      </Field>

      <div className="flex flex-col gap-4 border-t border-ink pt-8 md:flex-row md:items-center md:justify-between">
        <p id="inquiry-demo-note" className="text-meta max-w-[46ch] text-muted-strong">
          Demo form. Checking validates your answers in the browser. Nothing is sent or stored.
        </p>
        <button
          ref={submitRef}
          type="submit"
          disabled={isSubmitting}
          className="text-display-sm group inline-flex min-h-16 items-center justify-between gap-6 bg-ink px-6 py-5 text-lime transition-colors hover:bg-signal hover:text-ink disabled:opacity-60"
        >
          <span data-magnetic-label="" className="inline-flex items-center gap-6">
            Check inquiry
            <ArrowUpRight aria-hidden className="size-[1.1em]" strokeWidth={2.25} />
          </span>
        </button>
      </div>
    </form>
  );
}

interface ControlProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
}

interface FieldProps {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: (props: ControlProps) => ReactNode;
}

function Field({ label, optional, hint, error, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="text-meta flex items-baseline justify-between gap-4">
        <span>{label}</span>
        {optional && <span className="text-muted-strong">Optional</span>}
      </label>
      {hint && (
        <p id={hintId} className="text-body mt-1 text-sm text-muted-strong">
          {hint}
        </p>
      )}
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {error && (
        <p id={errorId} className="text-body mt-2 text-sm font-medium text-signal-strong">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-0 size-5 -translate-y-1/2" />
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-meta text-muted-strong">{label}</dt>
      <dd className="text-body break-words">{children}</dd>
    </>
  );
}

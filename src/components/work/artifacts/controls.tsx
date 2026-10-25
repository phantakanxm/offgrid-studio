"use client";

import { useCallback, useId, useRef } from "react";
import { gsap, motionQuery, useGSAP } from "@/components/motion/gsap";
import { cn } from "@/lib/utils";

/** Shared pill look for the artifacts' buttons and radio options; pressed and checked fill with the project accent. */
export const pillClass =
  "text-meta inline-flex min-h-11 items-center justify-center border border-line px-4 aria-pressed:border-transparent aria-pressed:bg-(--project-accent) aria-pressed:text-ink";

/**
 * Tweens on motion-enabled devices and sets instantly otherwise, so every control works the same
 * with reduced motion and only the transition between states disappears.
 */
export function useMotionTween() {
  const allowed = useRef(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(motionQuery.any, () => {
      allowed.current = true;
      return () => {
        allowed.current = false;
      };
    });
    return () => mm.revert();
  });

  return useCallback((target: gsap.TweenTarget, vars: gsap.TweenVars) => {
    if (allowed.current) gsap.to(target, { duration: 0.8, ease: "power3.inOut", overwrite: "auto", ...vars });
    else gsap.set(target, vars);
  }, []);
}

interface ChoiceGroupProps<T extends string | number> {
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** A native radio group drawn as pills: arrow keys move the selection, as in any radio group. */
export function ChoiceGroup<T extends string | number>({ legend, options, value, onChange, className }: ChoiceGroupProps<T>) {
  const name = useId();
  return (
    <fieldset className={className}>
      <legend className="text-meta text-muted">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                pillClass,
                "cursor-pointer peer-checked:border-transparent peer-checked:bg-(--project-accent) peer-checked:text-ink",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-(--focus)",
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface RangeFieldProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  /** The visible readout, also announced as the slider's value text. */
  format: (value: number) => string;
  onChange: (value: number) => void;
  className?: string;
}

export function RangeField({ label, min, max, step, value, format, onChange, className }: RangeFieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <div className="text-meta flex justify-between gap-4">
        <label htmlFor={id} className="text-muted">
          {label}
        </label>
        <span aria-hidden>{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 block h-11 w-full cursor-pointer accent-(--project-accent)"
      />
    </div>
  );
}

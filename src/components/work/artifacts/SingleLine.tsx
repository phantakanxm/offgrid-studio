"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, motionQuery, useGSAP } from "@/components/motion/gsap";
import { pillClass, useMotionTween } from "./controls";

// One continuous stroke: around the plinth, up the stem, over the bend and down into the head.
const lampLine = "M230 520H100V560H560V520H230V230C230 110 320 60 400 70C480 80 520 140 520 220V300";

const callouts = [
  { title: "Arm", body: "Brushed aluminium, bent from a single strip", marker: { left: "26%", top: "10%" } },
  { title: "Head", body: "Warm-white light strip", marker: { left: "86%", top: "40%" } },
  { title: "Base", body: "Dark stone plinth", marker: { left: "6%", top: "82%" } },
] as const;

export function SingleLine() {
  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<SVGGElement>(null);
  const [lit, setLit] = useState(true);
  const tween = useMotionTween();

  // The line draws itself as the stage scrolls into view; without motion it is simply drawn.
  useGSAP(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const mm = gsap.matchMedia();
    mm.add(motionQuery.any, () => {
      gsap.fromTo(
        "[data-lamp-line]",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: stage, start: "top 85%", end: "center 60%", scrub: 0.6 } },
      );
      gsap.fromTo(
        "[data-callout]",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out", scrollTrigger: { trigger: stage, start: "center 60%", toggleActions: "play none none reverse" } },
      );
    }, stage.parentElement ?? stage);
    return () => mm.revert();
  });

  useEffect(() => {
    tween(glowRef.current, { opacity: lit ? 1 : 0, duration: 0.7, ease: "power2.inOut" });
  }, [lit, tween]);

  return (
    <div className="grid-editorial gap-y-10">
      <div ref={stageRef} className="relative col-span-4 md:col-span-6 md:col-start-2 lg:col-span-6 lg:col-start-4">
        <svg
          viewBox="0 0 640 600"
          role="img"
          aria-label="A desk lamp drawn as one continuous line: plinth, stem, bend and head."
          className="block h-auto w-full"
          fill="none"
        >
          <defs>
            <linearGradient id="mono-light" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F4E7D0" stopOpacity="0.3" />
              <stop offset="1" stopColor="#F4E7D0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g ref={glowRef} data-lamp-glow="">
            <polygon points="508,300 532,300 590,520 450,520" fill="url(#mono-light)" />
            <ellipse cx="520" cy="520" rx="90" ry="7" fill="#F4E7D0" fillOpacity="0.35" />
            <line x1="520" y1="236" x2="520" y2="300" stroke="#F4E7D0" strokeWidth="9" strokeLinecap="round" />
          </g>
          <path
            data-lamp-line=""
            d={lampLine}
            pathLength={1}
            strokeDasharray="1"
            className="stroke-(--project-accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {callouts.map((callout, index) => (
          <span
            key={callout.title}
            aria-hidden
            data-callout=""
            className="text-meta absolute flex size-6 items-center justify-center border border-(--project-accent) bg-ink"
            style={callout.marker}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <ol className="col-span-4 space-y-5 md:col-span-4 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:self-end">
        {callouts.map((callout, index) => (
          <li key={callout.title} data-callout="" className="text-meta flex gap-3 border-t border-line pt-3">
            <span className="text-(--project-accent)">{String(index + 1).padStart(2, "0")}</span>
            <span>
              {callout.title}
              <span className="block text-muted normal-case">{callout.body}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="col-span-4 md:col-span-4 lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:self-end">
        <p className="text-meta text-muted">One warm-white source</p>
        <button type="button" aria-pressed={lit} onClick={() => setLit(!lit)} className={`${pillClass} mt-3`}>
          Light
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { ChoiceGroup, RangeField, pillClass, useMotionTween } from "./controls";

type Crop = "whole" | "edge" | "corner";

/** Where the mark sits in the tile, in viewBox units: centred, bleeding off one edge, or into a corner. */
const crops: Record<Crop, { label: string; x: number; y: number }> = {
  whole: { label: "Whole", x: 0, y: 0 },
  edge: { label: "Edge", x: 150, y: 0 },
  corner: { label: "Corner", x: 130, y: 130 },
};
const cropOptions = (Object.keys(crops) as Crop[]).map((value) => ({ value, label: crops[value].label }));

export function ModularMark() {
  const markRef = useRef<SVGGElement>(null);
  const [crop, setCrop] = useState<Crop>("whole");
  // Quarter turns keep counting up, so every press rotates the same way instead of unwinding at 360°.
  const [turns, setTurns] = useState(0);
  const [scale, setScale] = useState(1);
  const tween = useMotionTween();

  // Set once: passing svgOrigin with every change makes GSAP re-compensate x and y for the new origin.
  useGSAP(() => {
    gsap.set(markRef.current, { svgOrigin: "200 200" });
  });

  useEffect(() => {
    const { x, y } = crops[crop];
    tween(markRef.current, { x, y, rotation: turns * 90, scale });
  }, [crop, turns, scale, tween]);

  const angle = (turns % 4) * 90;

  return (
    <div className="grid-editorial gap-y-10">
      <div className="col-span-4 md:col-span-5 lg:col-span-6">
        <svg
          viewBox="0 0 400 400"
          role="img"
          aria-label="The SIGNAL mark, a cobalt frame and a vermilion arc, placed in a square tile."
          data-mark-state={`${crop} ${angle} ${scale}`}
          className="block aspect-square h-auto w-full bg-[#EEEAE3]"
        >
          <g ref={markRef} data-mark="" fill="none" strokeWidth="32">
            <rect x="80" y="60" width="140" height="270" stroke="#1E4FD6" />
            <path d="M140 300A100 100 0 0 1 340 300" stroke="#F04B22" />
          </g>
        </svg>
      </div>

      <div className="col-span-4 space-y-8 md:col-span-3 lg:col-span-4 lg:col-start-8 lg:self-end">
        <ChoiceGroup legend="Crop" options={cropOptions} value={crop} onChange={setCrop} />

        <div>
          <p className="text-meta text-muted">Rotate</p>
          <div className="mt-3 flex items-center gap-4">
            <button type="button" onClick={() => setTurns(turns + 1)} className={pillClass}>
              Rotate 90°
            </button>
            <output className="text-meta">
              <span className="sr-only">Rotation </span>
              {angle}°
            </output>
          </div>
        </div>

        <RangeField label="Scale" min={1} max={2.5} step={0.25} value={scale} format={(value) => `${Math.round(value * 100)}%`} onChange={setScale} />
      </div>
    </div>
  );
}

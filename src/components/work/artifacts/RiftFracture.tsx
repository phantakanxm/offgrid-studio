"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ScrollTrigger, gsap, motionQuery, useGSAP } from "@/components/motion/gsap";
import { RangeField, useMotionTween } from "./controls";

/** The break runs from 57% across the top edge to 43% across the bottom. */
const breakTop = 57;
const breakBottom = 43;
const resting = 50;

// --rift is the opening from 0 (sealed) to 1. Each side of the break recedes by up to 4.5% of the
// width and the halves slip vertically against each other, so the cut reads as a fracture.
const leftHalf = `polygon(0 0, calc(${breakTop}% - var(--rift) * 4.5%) 0, calc(${breakBottom}% - var(--rift) * 4.5%) 100%, 0 100%)`;
const rightHalf = `polygon(calc(${breakTop}% + var(--rift) * 4.5%) 0, 100% 0, 100% 100%, calc(${breakBottom}% + var(--rift) * 4.5%) 100%)`;
const gap = `polygon(calc(${breakTop}% - var(--rift) * 4.5%) 0, calc(${breakTop}% + var(--rift) * 4.5%) 0, calc(${breakBottom}% + var(--rift) * 4.5%) 100%, calc(${breakBottom}% - var(--rift) * 4.5%) 100%)`;

function Wordmark() {
  return (
    <svg viewBox="0 0 1000 420" className="absolute inset-0 size-full" aria-hidden>
      <text
        x="500"
        y="372"
        textAnchor="middle"
        textLength="700"
        lengthAdjust="spacingAndGlyphs"
        fontSize="470"
        fontWeight="700"
        fill="currentColor"
        style={{ fontFamily: "var(--font-display)" }}
      >
        RIFT
      </text>
    </svg>
  );
}

export function RiftFracture() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(resting);
  // Scroll drives the rift until someone takes the slider; after that the slider and pointer own it.
  const sliderTaken = useRef(false);
  const tween = useMotionTween();

  useGSAP(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const mm = gsap.matchMedia();

    // Opens as the stage reaches the middle of the screen and closes again as it leaves. No pin.
    mm.add(motionQuery.any, () => {
      ScrollTrigger.create({
        trigger: stage,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (!sliderTaken.current) setOpening(Math.round(Math.sin(self.progress * Math.PI) * 100));
        },
      });
    });

    // The pointer pulls the rift open as it nears the break.
    mm.add(motionQuery.finePointer, () => {
      const onMove = (event: PointerEvent) => {
        const box = stage.getBoundingClientRect();
        const y = (event.clientY - box.top) / box.height;
        const breakX = (breakTop + (breakBottom - breakTop) * y) / 100;
        const distance = Math.abs((event.clientX - box.left) / box.width - breakX);
        setOpening(Math.round(Math.max(0, 1 - distance / 0.3) * 100));
      };
      stage.addEventListener("pointermove", onMove);
      return () => stage.removeEventListener("pointermove", onMove);
    });

    return () => mm.revert();
  });

  useEffect(() => {
    if (stageRef.current) tween(stageRef.current, { "--rift": opening / 100, duration: 0.6, ease: "power3.out" });
  }, [opening, tween]);

  return (
    <div>
      <div
        ref={stageRef}
        role="img"
        aria-label="The RIFT wordmark, cut by one diagonal fracture that opens onto signal red."
        data-rift-stage=""
        className="relative aspect-[1000/420] overflow-hidden border border-line bg-[#0E0E0E] text-paper"
        style={{ "--rift": resting / 100 } as CSSProperties}
      >
        <div className="absolute inset-0 bg-(--project-accent)" style={{ clipPath: gap }} />
        <div className="absolute inset-0" style={{ clipPath: leftHalf, transform: "translateY(calc(var(--rift) * -3%))" }}>
          <Wordmark />
        </div>
        <div className="absolute inset-0" style={{ clipPath: rightHalf, transform: "translateY(calc(var(--rift) * 3%))" }}>
          <Wordmark />
        </div>
      </div>

      <RangeField
        label="Fracture"
        min={0}
        max={100}
        step={1}
        value={opening}
        format={(value) => `${value}% open`}
        onChange={(value) => {
          sliderTaken.current = true;
          setOpening(value);
        }}
        className="mt-6 md:max-w-sm"
      />
    </div>
  );
}

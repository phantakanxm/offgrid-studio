"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, gsap, motionQuery, useGSAP } from "@/components/motion/gsap";
import { ChoiceGroup, pillClass } from "./controls";

const tempos = [90, 120, 140, 174] as const;
type Tempo = (typeof tempos)[number];
const tempoOptions = tempos.map((bpm) => ({ value: bpm, label: String(bpm) }));

interface Shape {
  cycles: number;
  amplitude: number;
}

/** Slow tempos swell in long, deep waves; fast ones tighten into shallow ripples. */
function shapeFor(bpm: Tempo): Shape {
  return { cycles: bpm / 40, amplitude: 150 - (bpm - 90) * 0.9 };
}

const width = 1200;
const height = 480;
const samples = 96;
const ribbons = [
  { color: "#8C3BFF", offset: 0 },
  { color: "#D9FF43", offset: 2.1 },
  { color: "#FF5A36", offset: 4.2 },
] as const;
// Each ribbon is five strands; their spacing follows a slow twist so the band folds like a ribbon.
const strands = [-2, -1, 0, 1, 2] as const;

function strandPath({ cycles, amplitude }: Shape, phase: number, offset: number, strand: number) {
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const taper = Math.sin(Math.PI * t) ** 0.9;
    const twist = Math.cos(Math.PI * cycles * t + offset + phase);
    const y = height / 2 + taper * (amplitude * Math.sin(2 * Math.PI * cycles * t + phase + offset) + strand * 14 * twist);
    d += `${i ? "L" : "M"}${(t * width).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

const initialTempo: Tempo = 120;
const initialPaths = ribbons.map((ribbon) => strands.map((strand) => strandPath(shapeFor(initialTempo), 0, ribbon.offset, strand)));
/** One trip of the wave per bar of four beats. */
const barSeconds = (bpm: number) => (60 / bpm) * 4;

function drawRibbons(svg: SVGSVGElement | null, shape: Shape, phase: number) {
  svg?.querySelectorAll("path").forEach((path, index) => {
    const ribbon = ribbons[Math.floor(index / strands.length)];
    path.setAttribute("d", strandPath(shape, phase, ribbon.offset, strands[index % strands.length]));
  });
}

export function TempoSculpture() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tempo, setTempo] = useState<Tempo>(initialTempo);
  const [paused, setPaused] = useState(false);
  const [animated, setAnimated] = useState(false);
  const shape = useRef<Shape>(shapeFor(initialTempo));
  const phase = useRef({ value: 0 });
  const loop = useRef<gsap.core.Tween | null>(null);

  const pausedByUser = useRef(false);
  const draw = () => drawRibbons(svgRef.current, shape.current, phase.current.value);

  useGSAP(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const mm = gsap.matchMedia();
    mm.add(motionQuery.any, () => {
      setAnimated(true);
      const tween = gsap.to(phase.current, { value: Math.PI * 2, duration: barSeconds(initialTempo), ease: "none", repeat: -1, paused: true, onUpdate: draw });
      loop.current = tween;
      // The loop only runs while the sculpture is on screen and nobody has paused it.
      ScrollTrigger.create({ trigger: svg, start: "top bottom", end: "bottom top", onToggle: (self) => tween.paused(!self.isActive || pausedByUser.current) });
      return () => {
        loop.current = null;
        phase.current.value = 0;
        setAnimated(false);
        setPaused(false);
        pausedByUser.current = false;
        draw();
      };
    });
    return () => mm.revert();
  });

  useEffect(() => {
    const next = shapeFor(tempo);
    const svg = svgRef.current;
    if (!loop.current) {
      shape.current = next;
      drawRibbons(svg, next, phase.current.value);
      return;
    }
    gsap.to(shape.current, { ...next, duration: 0.9, ease: "power3.inOut", overwrite: true, onUpdate: () => drawRibbons(svg, shape.current, phase.current.value) });
    gsap.to(loop.current, { timeScale: tempo / initialTempo, duration: 0.9, ease: "power2.inOut", overwrite: true });
  }, [tempo]);

  const togglePause = () => {
    pausedByUser.current = !paused;
    loop.current?.paused(!paused);
    setPaused(!paused);
  };

  return (
    <div>
      <div className="relative overflow-hidden border border-line bg-[#07080D]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Three ribbons in violet, lime and orange, shaped by a tempo of ${tempo} BPM.`}
          data-tempo={tempo}
          className="block h-auto w-full"
          fill="none"
          strokeLinecap="round"
        >
          {ribbons.map((ribbon, r) =>
            strands.map((strand, s) => (
              <path key={`${r}-${s}`} d={initialPaths[r][s]} stroke={ribbon.color} strokeWidth={strand === 0 ? 3 : 1.5} strokeOpacity={1 - Math.abs(strand) * 0.28} />
            )),
          )}
        </svg>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <ChoiceGroup legend="Tempo (BPM)" options={tempoOptions} value={tempo} onChange={setTempo} />
        {animated && (
          <button type="button" aria-pressed={paused} onClick={togglePause} className={pillClass}>
            Pause motion
          </button>
        )}
      </div>
    </div>
  );
}

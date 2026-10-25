import type { ProjectType } from "@/lib/inquiry";

export interface Service {
  number: string;
  name: string;
  description: string;
  /** Preselected in the contact form when the visitor starts from this service. */
  projectType: ProjectType;
}

export const services: readonly Service[] = [
  {
    number: "01",
    name: "Creative Direction",
    projectType: "Creative Direction",
    description:
      "Concepts, campaigns and visual worlds that give a brand a point of view, and the conviction to hold it.",
  },
  {
    number: "02",
    name: "Brand Identity",
    projectType: "Brand Identity",
    description:
      "Names, marks, type and systems built to be recognised instantly and to flex without falling apart.",
  },
  {
    number: "03",
    name: "Digital Experiences",
    projectType: "Digital Experience",
    description:
      "Websites and digital products designed and engineered in-house, where editorial craft meets solid frontend.",
  },
  {
    number: "04",
    name: "Motion & Interaction",
    projectType: "Motion & Interaction",
    description:
      "Movement with a purpose: transitions, micro-interactions and motion languages that make interfaces feel alive.",
  },
];

export interface ProcessStep {
  number: string;
  name: string;
  description: string;
}

export const processSteps: readonly ProcessStep[] = [
  {
    number: "01",
    name: "Discover",
    description:
      "We listen first. The brand, the audience, the culture around it, and what everyone else is already doing.",
  },
  {
    number: "02",
    name: "Challenge",
    description:
      "We question the brief, the category and our own first ideas until we find the angle worth committing to.",
  },
  {
    number: "03",
    name: "Create",
    description:
      "Concepts become identities, images, interfaces and motion, built together so every part speaks the same language.",
  },
  {
    number: "04",
    name: "Refine",
    description:
      "We edit hard. Details are tightened, systems are tested, and everything unnecessary is taken away.",
  },
];

import { z } from "zod";

export const projectTypes = [
  "Creative Direction",
  "Brand Identity",
  "Digital Experience",
  "Motion & Interaction",
  "Not sure yet",
] as const;

export type ProjectType = (typeof projectTypes)[number];

export const projectTypeParam = "type";

export function parseProjectType(value: string | null): ProjectType | null {
  return projectTypes.find((type) => type === value) ?? null;
}

export const budgetRanges = ["Under $25k", "$25k – $50k", "$50k – $100k", "$100k+", "Prefer not to say"] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.email("Enter an email address like name@studio.com."),
  company: z.string().trim().max(120, "Keep this under 120 characters."),
  // The select starts on an empty choice; the pipe rejects it and narrows the output to a real type.
  projectType: z.union([z.literal(""), z.enum(projectTypes)]).pipe(z.enum(projectTypes, { error: "Choose the kind of project." })),
  budget: z.union([z.enum(budgetRanges), z.literal("")]),
  description: z
    .string()
    .trim()
    .min(30, "Tell us a bit more. At least 30 characters helps us understand the brief.")
    .max(2000, "Keep the description under 2,000 characters."),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

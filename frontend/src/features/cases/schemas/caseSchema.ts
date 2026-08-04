import { z } from "zod";

export const caseSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters"),

    description: z.string(),

    status: z.enum([
        "OPEN",
        "IN_PROGRESS",
        "ON_HOLD",
        "RESOLVED",
        "CLOSED",
    ]),

    priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
    ]),

    due_date: z.string().optional(),
});

export type CaseFormValues = z.infer<
    typeof caseSchema
>;
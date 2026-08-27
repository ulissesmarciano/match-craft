import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { analyzeMatchTask, atsCheckTask, improveSummaryTask, tailorResumeTask } from "./ai-tasks.server";

const jobInput = z.object({
  resumeText: z.string().min(1),
  jobTitle: z.string(),
  company: z.string(),
  jobDescription: z.string().min(1),
});

export const analyzeMatch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => jobInput.parse(data))
  .handler(async ({ data }) => analyzeMatchTask(data));

export const atsCheck = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ resumeText: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => atsCheckTask(data.resumeText));

export const improveSummary = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ summary: z.string(), resumeText: z.string(), targetRole: z.string() }).parse(data),
  )
  .handler(async ({ data }) => improveSummaryTask(data));

export const tailorResume = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        resumeJson: z.string().min(1),
        jobTitle: z.string(),
        company: z.string(),
        jobDescription: z.string().min(1),
      })
      .parse(data),
  )
  .handler(async ({ data }) => tailorResumeTask(data));

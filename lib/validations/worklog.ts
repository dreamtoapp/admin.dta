import { z } from "zod";

export const createWorkLogSchema = z.object({
  title: z.string().min(3, "Title is required and must be at least 3 characters.").max(200, "Title must be less than 200 characters."),
  summary: z.string().min(5, "Summary is required and must be at least 5 characters.").max(1000, "Summary must be less than 1000 characters."),
  timeSpentMin: z
    .number({ invalid_type_error: "Time must be a number" })
    .min(1, "Time spent is required and must be at least 1 minute.")
    .max(1440, "Time cannot exceed 1440 minutes per day."),
});

export type CreateWorkLogInput = z.infer<typeof createWorkLogSchema>;



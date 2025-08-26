import { z } from "zod";

export const createAgentSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(50, {
      message: "Title must be less than 50 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(200, {
      message: "Description must be less than 200 characters.",
    }),
  prompt: z
    .string()
    .min(20, {
      message: "Prompt must be at least 20 characters.",
    })
    .max(1000, {
      message: "Prompt must be less than 1000 characters.",
    }),
  tag: z
    .string()
    .min(2, {
      message: "Tag must be at least 2 characters.",
    })
    .max(30, {
      message: "Tag must be less than 30 characters.",
    }),
  isPrivate: z.boolean(),
});

export type CreateAgentFormData = z.infer<typeof createAgentSchema>;

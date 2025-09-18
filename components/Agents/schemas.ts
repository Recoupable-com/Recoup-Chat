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
    .max(10000, {
      message: "Prompt must be less than 10,000 characters.",
    }),
  tags: z.array(z.string()),
  isPrivate: z.boolean(),
});

export type CreateAgentFormData = z.infer<typeof createAgentSchema>;

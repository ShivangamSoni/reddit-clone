import { z } from "zod";

export const PostValidator = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 Characters" })
        .max(128, { message: "Title can be at most 128 Characters" }),
    subredditId: z.string(),
    content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;

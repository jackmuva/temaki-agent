import * as z from "zod";

export const PromptInputSchema = z.object({
	prompt: z.string(),
});

export type PromptInput = z.infer<typeof PromptInputSchema>

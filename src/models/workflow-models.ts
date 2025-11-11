import * as z from "zod";

export const OutboundTriggerSchema = z.object({
	email: z.string(),
});

export type OutboundTrigger = z.infer<typeof OutboundTriggerSchema>

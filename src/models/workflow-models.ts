import * as z from "zod";

export const OutboundTriggerSchema = z.object({
	email: z.string().email(),
});

export type OutboundTrigger = z.infer<typeof OutboundTriggerSchema>

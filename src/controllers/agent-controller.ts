import { Router, Request, Response, NextFunction } from 'express';
import { OutboundTrigger, OutboundTriggerSchema } from '../models/workflow-models';
import config from '../config/config';
import { triggerOutboundWorkflow } from '../service/outbound/outbound-workflow';

export const testOutboundAgent = async (res: Response) => {
	const request = await fetch(`${config.baseUrl}/${config.port}/api/agent/trigger`, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: "jack@postman.com",
		}),
	});

	const response = await request.json();
	res.status(200).json(response);
}

export const triggerOutboundAgent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const trigger: OutboundTrigger = OutboundTriggerSchema.parse(req.body);
		await triggerOutboundWorkflow(trigger);
		res.status(201).json({ message: "processing" });
	} catch (error) {
		next(error);
	}
}

const outboundAgentRouter = Router();

outboundAgentRouter.post('/trigger', triggerOutboundAgent);
outboundAgentRouter.get('/test', testOutboundAgent);

export default outboundAgentRouter;

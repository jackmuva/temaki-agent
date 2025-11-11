import { Router, Request, Response, NextFunction } from 'express';
import { PromptInput, PromptInputSchema } from '../models/workflow-models';
import config from '../config/config';

export const testAgent = async (res: Response) => {
	const request = await fetch(`${config.baseUrl}/${config.port}/api/agent/trigger`, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			prompt: "hi",
		}),
	});

	const response = await request.json();
	res.status(200).json(response);
}

export const triggerAgent = (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(req.body);
		const promptInput: PromptInput = PromptInputSchema.parse(req.body);
		res.status(201).json(promptInput);
	} catch (error) {
		next(error);
	}
}

const agentRouter = Router();

agentRouter.post('/trigger', triggerAgent);
agentRouter.get('/test', testAgent);

export default agentRouter;

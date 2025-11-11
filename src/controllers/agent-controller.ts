import { Request, Response, NextFunction } from 'express';

export const readPrompt = (req: Request, res: Response, next: NextFunction) => {
	try {
		const { prompt } = req.body;
		res.status(201).json({ prompt });
	} catch (error) {
		next(error);
	}
}

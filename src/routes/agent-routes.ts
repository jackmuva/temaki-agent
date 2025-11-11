import { Router } from "express";
import { readPrompt } from "../controllers/agent-controller";

const agentRouter = Router();

agentRouter.get('/', readPrompt);

export default agentRouter;

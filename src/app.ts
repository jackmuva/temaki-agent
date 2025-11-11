import express from 'express';
import agentRouter from './controllers/agent-controller';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(express.json());

app.use('/api/agent', agentRouter);

app.use(errorHandler);

export default app;

import express from 'express';
import agentRouter from './routes/agent-routes';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(express.json());

app.use('/api/agent', agentRouter);

app.use(errorHandler);

export default app;

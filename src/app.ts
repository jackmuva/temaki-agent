import express from 'express';
import { errorHandler } from './middleware/error-handler';
import outboundAgentRouter from './controllers/agent-controller';

const app = express();

app.use(express.json());

app.use('/api/agent/outbound', outboundAgentRouter);

app.use(errorHandler);

export default app;

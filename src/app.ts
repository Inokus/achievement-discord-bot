import express from 'express';
import sprints from './modules/sprints/controller';

const app = express();

app.use(express.json());

app.use('/sprints', sprints);

export default app;

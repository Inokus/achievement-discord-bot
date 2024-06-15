import express from 'express';
import sprints from './modules/sprints/controller';
import templates from './modules/templates/controller';

const app = express();

app.use(express.json());

app.use('/sprints', sprints);
app.use('/templates', templates);

export default app;

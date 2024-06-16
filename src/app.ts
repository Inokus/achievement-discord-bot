import express from 'express';
import sprints from './modules/sprints/controller';
import templates from './modules/templates/controller';
import messages from './modules/messages/controller';

const app = express();

app.use(express.json());

app.use('/sprints', sprints);
app.use('/templates', templates);
app.use('/messages', messages);

export default app;

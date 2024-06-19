import express from 'express';
import jsonErrorHandler from './middleware/jsonErrors';
import sprints from './modules/sprints/controller';
import templates from './modules/templates/controller';
import messages from './modules/messages/controller';
import type { Database } from './database';
import type { DiscordClientType as DiscordClient } from './modules/discord';
import type { GiphyClientType as GiphyClient } from './modules/giphy';

export default function createApp(
  db: Database,
  discord: DiscordClient,
  giphy: GiphyClient
) {
  const app = express();

  app.use(express.json());

  app.use('/sprints', sprints(db));
  app.use('/templates', templates(db));
  app.use('/messages', messages(db, discord, giphy));

  app.use(jsonErrorHandler);

  return app;
}

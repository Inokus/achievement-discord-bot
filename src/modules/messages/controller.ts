/* eslint-disable no-console */
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import buildSprintsRepository from '../sprints/repository';
import buildTemplatesRepository from '../templates/repository';
import * as schema from './schema';
import { jsonRoute } from '@/utils/middleware';
import Conflict from '@/utils/errors/Conflict';
import NotFound from '@/utils/errors/NotFound';
import type { Database } from '@/database';
import type { DiscordClientType as DiscordClient } from '../discord';
import type { GiphyClientType as GiphyClient } from '../giphy';

export default (db: Database, discord: DiscordClient, giphy: GiphyClient) => {
  const messages = buildRepository(db);
  const sprints = buildSprintsRepository(db);
  const templates = buildTemplatesRepository(db);
  const router = Router();

  router
    .route('/')
    .get(
      jsonRoute(async (req) => {
        const { username, sprint } = req.query;

        // get a list of all congratulatory messages for a specific user
        if (username) {
          const username = schema.parseUsername(req.query.username);
          const records = await messages.findAllByField('username', username);

          if (records.length === 0) {
            throw new NotFound('User not found.');
          }

          return records;
        }
        // get a list of all congratulatory messages for a specific sprint
        if (sprint) {
          const sprintCode = schema.parseSprintCode(req.query.sprint);
          const sprint = await sprints.findByField('code', sprintCode);

          if (!sprint) {
            throw new NotFound('Sprint not found.');
          }

          return messages.findAllByField('sprintId', sprint.id);
        }

        // get a list of all congratulatory messages
        return messages.findAll();
      })
    )
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseRequest(req.body);

        const { username, sprintCode } = body;

        const user = await discord.getUserByUsername(username);

        if (!user) {
          throw new NotFound('User not found.');
        }

        const sprint = await sprints.findByField('code', sprintCode);

        if (!sprint) {
          throw new NotFound('Sprint not found.');
        }

        const record = await messages.findByUsernameAndSprint(
          username,
          sprint.id
        );

        if (record) {
          throw new Conflict('User has already finished this sprint.');
        }

        const allTemplates = await templates.findAll();

        if (allTemplates.length === 0) {
          throw new NotFound('No templates found.');
        }

        const randomIndex = Math.floor(Math.random() * allTemplates.length);
        const template = allTemplates[randomIndex];

        const message = schema.parseInsertable({
          username: username,
          sprintId: sprint.id,
          templateId: template.id,
        });

        let gifUrl = '';

        try {
          gifUrl = await giphy.getRandomGif('congratulations');
        } catch {
          console.error('Could not retrieve data from GIPHY.');
        }

        try {
          discord.sendAccomplishment(
            `${user} has just completed ${sprint.title}!\n${template.content}`,
            gifUrl
          );
        } catch {
          console.error('Could not send Discord message.');
        }

        return messages.create(message);
      }, StatusCodes.CREATED)
    );

  return router;
};

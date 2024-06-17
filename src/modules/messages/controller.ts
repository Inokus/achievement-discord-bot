/* eslint-disable no-console */
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as messages from './repository';
import { findByField as findSprintByField } from '../sprints/repository';
import { findAll as findAllTemplates } from '../templates/repository';
import * as schema from './schema';
import { jsonRoute } from '@/utils/middleware';
import Conflict from '@/utils/errors/Conflict';
import NotFound from '@/utils/errors/NotFound';
import discordClient from '../discord';
import giphyClient from '../giphy';

const router = Router();

router
  .route('/')
  .get(
    jsonRoute(async (req) => {
      // get a list of all congratulatory messages for a specific user
      if (req.query.username) {
        const username = schema.parseUsername(req.query.username);
        const records = await messages.findAllByField('username', username);

        if (records.length === 0) {
          throw new NotFound('User not found.');
        }

        return records;
      }
      // get a list of all congratulatory messages for a specific sprint
      if (req.query.sprint) {
        const sprintCode = schema.parseSprintCode(req.query.sprint);
        const sprint = await findSprintByField('code', sprintCode);

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

      const user = await discordClient.getUserByUsername(body.username);

      if (!user) {
        throw new NotFound('User not found.');
      }

      const sprint = await findSprintByField('code', body.sprintCode);

      if (!sprint) {
        throw new NotFound('Sprint not found.');
      }

      const record = await messages.findByUsernameAndSprint(
        body.username,
        sprint.id
      );

      if (record) {
        throw new Conflict('User has already finished this sprint.');
      }

      const templates = await findAllTemplates();

      if (templates.length === 0) {
        throw new NotFound('No templates found.');
      }

      const randomIndex = Math.floor(Math.random() * templates.length);
      const template = templates[randomIndex];

      const message = schema.parseInsertable({
        username: body.username,
        sprintId: sprint.id,
        templateId: template.id,
      });

      let gifUrl;

      try {
        gifUrl = await giphyClient.getRandomGif('congratulations');
      } catch {
        console.error('Could not retrieve data from GIPHY.');
      }

      try {
        discordClient.sendAccomplishment(
          `${user} has just completed ${sprint.title}!\n${template.content}`,
          gifUrl
        );
      } catch {
        console.error('Could not send Discord message.');
      }

      return messages.create(message);
    }, StatusCodes.CREATED)
  );

export default router;

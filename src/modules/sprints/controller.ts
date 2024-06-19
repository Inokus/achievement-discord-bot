import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import buildRepository from './repository';
import * as schema from './schema';
import { jsonRoute } from '@/utils/middleware';
import NotFound from '@/utils/errors/NotFound';
import type { Database } from '@/database';

export default (db: Database) => {
  const sprints = buildRepository(db);
  const router = Router();

  router
    .route('/')
    .get(jsonRoute(sprints.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return sprints.create(body);
      }, StatusCodes.CREATED)
    );

  router
    .route('/:id')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await sprints.findByField('id', id);

        if (!record) {
          throw new NotFound('Sprint not found.');
        }

        return record;
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const bodyPatch = schema.parsePartial(req.body);
        const record = await sprints.update(id, bodyPatch);

        if (!record) {
          throw new NotFound('Sprint not found.');
        }

        return record;
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const record = await sprints.remove(id);

        if (!record) {
          throw new NotFound('Sprint not found.');
        }

        return record;
      })
    );

  return router;
};

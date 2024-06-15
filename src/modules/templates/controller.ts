import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as templates from './repository';
import * as schema from './schema';
import { jsonRoute } from '@/utils/middleware';
import NotFound from '@/utils/errors/NotFound';

const router = Router();

router
  .route('/')
  .get(jsonRoute(templates.findAll))
  .post(
    jsonRoute(async (req) => {
      const body = schema.parseInsertable(req.body);

      return templates.create(body);
    }, StatusCodes.CREATED)
  );

router
  .route('/:id')
  .get(
    jsonRoute(async (req) => {
      const id = schema.parseId(req.params.id);
      const record = await templates.findById(id);

      if (!record) {
        throw new NotFound('Template not found.');
      }

      return record;
    })
  )
  .patch(
    jsonRoute(async (req) => {
      const id = schema.parseId(req.params.id);
      const bodyPatch = schema.parsePartial(req.body);
      const record = await templates.update(id, bodyPatch);

      if (!record) {
        throw new NotFound('Template not found.');
      }

      return record;
    })
  )
  .delete(
    jsonRoute(async (req) => {
      const id = schema.parseId(req.params.id);
      const record = await templates.remove(id);

      if (!record) {
        throw new NotFound('Template not found.');
      }

      return record;
    })
  );

export default router;

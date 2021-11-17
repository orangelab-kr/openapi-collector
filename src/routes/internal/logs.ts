import { Router } from 'express';
import { Log, RESULT, Wrapper } from '../..';
import {
  InternalPermissionMiddleware,
  PERMISSION,
} from '../../middlewares/internal';

export function getInternalLogsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    InternalPermissionMiddleware(PERMISSION.COLLECTOR_LOG_LIST),
    Wrapper(async (req) => {
      const { logs, total } = await Log.getLogs(req.query);
      throw RESULT.SUCCESS({ details: { logs, total } });
    })
  );

  router.get(
    '/:logId',
    InternalPermissionMiddleware(PERMISSION.COLLECTOR_LOG_VIEW),
    Wrapper(async (req) => {
      const { log } = req.internal;
      throw RESULT.SUCCESS({ details: { log } });
    })
  );

  return router;
}

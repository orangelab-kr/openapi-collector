import { Router } from 'express';
import { getInternalLogsRouter } from '.';
import { getInternalUsersRouter } from './users';

export * from './logs';
export * from './users';

export function getInternalRouter(): Router {
  const router = Router();

  router.use('/logs', getInternalLogsRouter());
  router.use('/users', getInternalUsersRouter());

  return router;
}

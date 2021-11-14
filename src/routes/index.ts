import { Router } from 'express';
import {
  clusterInfo,
  getAuthRouter,
  getKickboardsRouter,
  getRegionsRouter,
  RESULT,
  UserMiddleware,
  Wrapper,
} from '..';

export * from './auth';
export * from './kickboards';
export * from './regions';

export function getRouter(): Router {
  const router = Router();

  router.use('/auth', getAuthRouter());
  router.use('/kickboards', UserMiddleware(), getKickboardsRouter());
  router.use('/regions', UserMiddleware(), getRegionsRouter());

  router.get(
    '/',
    Wrapper(async () => {
      throw RESULT.SUCCESS({ details: clusterInfo });
    })
  );

  return router;
}

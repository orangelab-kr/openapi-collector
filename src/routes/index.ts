import { Router } from 'express';
import {
  clusterInfo,
  getAuthRouter,
  getFranchisesRouter,
  getInternalRouter,
  getKickboardsRouter,
  getRegionsRouter,
  InternalMiddleware,
  RESULT,
  UserMiddleware,
  Wrapper,
} from '..';

export * from './auth';
export * from './franchises';
export * from './internal';
export * from './kickboards';
export * from './regions';

export function getRouter(): Router {
  const router = Router();

  router.use('/auth', getAuthRouter());
  router.use('/kickboards', UserMiddleware(), getKickboardsRouter());
  router.use('/regions', UserMiddleware(), getRegionsRouter());
  router.use('/franchises', UserMiddleware(), getFranchisesRouter());
  router.use('/internal', InternalMiddleware(), getInternalRouter());

  router.get(
    '/',
    Wrapper(async () => {
      throw RESULT.SUCCESS({ details: clusterInfo });
    })
  );

  return router;
}

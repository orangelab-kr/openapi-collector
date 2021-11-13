import { Router } from 'express';
import { clusterInfo, getAuthRouter, RESULT, Wrapper } from '..';

export * from './auth';

export function getRouter(): Router {
  const router = Router();

  router.use('/auth', getAuthRouter());

  router.get(
    '/',
    Wrapper(async () => {
      throw RESULT.SUCCESS({ details: clusterInfo });
    })
  );

  return router;
}

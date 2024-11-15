import { Router } from 'express';
import { clusterInfo, RESULT, Wrapper } from '..';

export function getRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async () => {
      throw RESULT.SUCCESS({ details: clusterInfo });
    })
  );

  return router;
}

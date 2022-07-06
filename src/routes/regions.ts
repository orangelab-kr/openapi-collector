import { Router } from 'express';
import { Region, RESULT, Wrapper } from '..';

export function getRegionsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async () => {
      const regions = await Region.getRegions();
      throw RESULT.SUCCESS({ details: { regions } });
    })
  );

  return router;
}

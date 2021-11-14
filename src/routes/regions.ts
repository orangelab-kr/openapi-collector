import { Router } from 'express';
import { Region, RESULT, Wrapper } from '..';

export function getRegionsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async (req) => {
      const regions = await Region.getAllRegions(req.query);
      throw RESULT.SUCCESS({ details: { regions } });
    })
  );

  return router;
}

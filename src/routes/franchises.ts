import { Router } from 'express';
import { Franchise, RESULT, Wrapper } from '..';

export function getFranchisesRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async () => {
      const franchises = await Franchise.getFranchises();
      throw RESULT.SUCCESS({ details: { franchises } });
    })
  );

  return router;
}

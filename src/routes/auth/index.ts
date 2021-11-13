import { Router } from 'express';
import { Prelogin, RESULT, User, UserMiddleware, Wrapper } from '../..';

export function getAuthRouter(): Router {
  const router = Router();

  router.get(
    '/',
    UserMiddleware(),
    Wrapper(async (req) => {
      const { user } = req.loggined;
      throw RESULT.SUCCESS({ details: { user } });
    })
  );

  router.get(
    '/prelogin',
    Wrapper(async (req) => {
      const platform = req.headers['user-agent'];
      const user = await Prelogin.loginWithPrelogin(req.query);
      const { sessionId } = await User.createSession(user, platform);
      throw RESULT.SUCCESS({ details: { sessionId, user } });
    })
  );

  return router;
}

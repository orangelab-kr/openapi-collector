import { Router } from 'express';
import { Phone, Prelogin, RESULT, User, UserMiddleware, Wrapper } from '../..';

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

  router.get(
    '/login',
    Wrapper(async (req) => {
      const platform = req.headers['user-agent'];
      const { phoneNo } = await Phone.getPhoneOrThrow(req.query);
      const user = await User.getUserByPhoneOrThrow(phoneNo);
      const { sessionId } = await User.createSession(user, platform);
      await Phone.revokePhone(phoneNo);
      throw RESULT.SUCCESS({ details: { sessionId, user } });
    })
  );

  router.get(
    '/phone',
    Wrapper(async (req) => {
      await Phone.sendVerify(req.query);
      throw RESULT.SUCCESS();
    })
  );

  router.post(
    '/phone',
    Wrapper(async (req) => {
      const { phoneId } = await Phone.verifyPhone(req.body);
      throw RESULT.SUCCESS({ details: { phoneId } });
    })
  );

  return router;
}

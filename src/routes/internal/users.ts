import { Router } from 'express';
import {
  InternalPermissionMiddleware,
  InternalUserMiddleware,
  PERMISSION,
  RESULT,
  User,
  Wrapper,
} from '../..';

export function getInternalUsersRouter(): Router {
  const router = Router();

  router.get(
    '/',
    InternalPermissionMiddleware(PERMISSION.COLLECTOR_USER_LIST),
    Wrapper(async (req) => {
      const { users, total } = await User.getUsers(req.query);
      throw RESULT.SUCCESS({ details: { users, total } });
    })
  );

  router.post(
    '/',
    InternalPermissionMiddleware(PERMISSION.COLLECTOR_USER_CREATE),
    Wrapper(async (req) => {
      const user = await User.createUser(req.body);
      throw RESULT.SUCCESS({ details: { user } });
    })
  );

  router.get(
    '/:userId',
    InternalPermissionMiddleware(PERMISSION.COLLECTOR_USER_VIEW),
    InternalUserMiddleware(),
    Wrapper(async (req) => {
      const { user } = req.internal;
      throw RESULT.SUCCESS({ details: { user } });
    })
  );

  router.post(
    '/:userId',
    InternalPermissionMiddleware(PERMISSION.COLLECTOR_USER_MODIFY),
    InternalUserMiddleware(),
    Wrapper(async (req) => {
      const { body, internal } = req;
      const user = await User.modifyUser(internal.user, body);
      throw RESULT.SUCCESS({ details: { user } });
    })
  );

  router.delete(
    '/:userId',
    InternalPermissionMiddleware(PERMISSION.COLLECTOR_USER_DELETE),
    InternalUserMiddleware(),
    Wrapper(async (req) => {
      await User.deleteUser(req.internal.user);
      throw RESULT.SUCCESS();
    })
  );

  return router;
}

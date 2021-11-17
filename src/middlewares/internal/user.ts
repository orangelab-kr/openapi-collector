import { WrapperCallback, RESULT, User, Wrapper } from '../..';

export function InternalUserMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const { userId } = req.params;
    if (!userId) throw RESULT.CANNOT_FIND_USER();
    req.internal.user = await User.getUserOrThrow(userId);

    next();
  });
}

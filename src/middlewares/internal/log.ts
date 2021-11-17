import { Log, RESULT, Wrapper, WrapperCallback } from '../..';

export function InternalLogMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const { logId } = req.params;
    if (!logId) throw RESULT.CANNOT_FIND_LOG();
    req.internal.log = await Log.getLogOrThrow(logId);

    next();
  });
}

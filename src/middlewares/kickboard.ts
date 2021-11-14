import { InternalClient, RESULT, Wrapper, WrapperCallback } from '..';

export function KickboardMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const { kickboardCode } = req.params;
    if (typeof kickboardCode !== 'string') throw RESULT.CANNOT_FIND_KICKBOARD();
    req.kickboard = await InternalClient.getKickboard().getKickboard(
      kickboardCode
    );

    next();
  });
}

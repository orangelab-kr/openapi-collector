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

export function KickboardDetailsMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const { kickboardCode } = req.params;
    if (typeof kickboardCode !== 'string') throw RESULT.CANNOT_FIND_KICKBOARD();
    req.kickboardDetails = await InternalClient.getKickboard()
      .instance.get(`/kickboards/${kickboardCode}`)
      .then(({ data }) => data.kickboard);

    next();
  });
}

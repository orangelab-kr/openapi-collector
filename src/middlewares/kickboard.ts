import { InternalClient, RESULT, Wrapper, WrapperCallback } from '..';

export function KickboardMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const {
      params: { kickboardCode },
      loggined: { user },
    } = req;

    if (!user || typeof kickboardCode !== 'string') {
      throw RESULT.CANNOT_FIND_KICKBOARD();
    }

    const kickboard = await InternalClient.getKickboard().getKickboard(
      kickboardCode
    );

    const { franchiseId } = kickboard;
    const franchiseIds = user.franchises.map(({ franchiseId }) => franchiseId);
    if (!franchiseIds.includes(franchiseId)) {
      throw RESULT.CANNOT_FIND_KICKBOARD();
    }

    req.kickboard = kickboard;
    next();
  });
}

export function KickboardDetailsMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const {
      params: { kickboardCode },
      loggined: { user },
    } = req;

    if (!user || typeof kickboardCode !== 'string') {
      throw RESULT.CANNOT_FIND_KICKBOARD();
    }

    const kickboard = await InternalClient.getKickboard()
      .instance.get(`/kickboards/${kickboardCode}`)
      .then(({ data }) => data.kickboard);

    const { franchiseId } = kickboard;
    const franchiseIds = user.franchises.map(({ franchiseId }) => franchiseId);
    if (!franchiseIds.includes(franchiseId)) {
      throw RESULT.CANNOT_FIND_KICKBOARD();
    }

    req.kickboardDetails = kickboard;
    next();
  });
}

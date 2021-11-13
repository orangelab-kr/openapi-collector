import { WrapperCallback, RESULT, User, Wrapper } from '..';

export function UserMiddleware(): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) throw RESULT.REQUIRED_LOGIN();
    const sessionId = authorization.substr(7);
    const user = await User.getUserBySessionId(sessionId);
    if (!req.loggined) req.loggined = <any>{};
    req.loggined.sessionId = sessionId;
    req.loggined.user = user;

    next();
  });
}

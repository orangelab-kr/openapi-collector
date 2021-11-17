import { RESULT, Wrapper, WrapperCallback } from '../..';

export enum PERMISSION {
  COLLECTOR_USER_LIST,
  COLLECTOR_USER_VIEW,
  COLLECTOR_USER_CREATE,
  COLLECTOR_USER_MODIFY,
  COLLECTOR_USER_DELETE,

  COLLECTOR_LOG_LIST,
  COLLECTOR_LOG_VIEW,
}

export function InternalPermissionMiddleware(
  permission: PERMISSION
): WrapperCallback {
  return Wrapper(async (req, res, next) => {
    if (!req.internal.prs[permission]) {
      throw RESULT.PERMISSION_DENIED({ args: [PERMISSION[permission]] });
    }

    next();
  });
}

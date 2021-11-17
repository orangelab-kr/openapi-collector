import { WrapperResult, WrapperResultLazyProps } from '.';

export function $_$(
  opcode: number,
  statusCode: number,
  message?: string,
  reportable?: boolean
): (props?: WrapperResultLazyProps) => WrapperResult {
  return (lazyOptions: WrapperResultLazyProps = {}) =>
    new WrapperResult({
      opcode,
      statusCode,
      message,
      reportable,
      ...lazyOptions,
    });
}

export const RESULT = {
  /** SAME ERRORS  */
  SUCCESS: $_$(0, 200),
  REQUIRED_ACCESS_KEY: $_$(-901, 401, 'REQUIRED_ACCESS_KEY'),
  EXPIRED_ACCESS_KEY: $_$(-902, 401, 'EXPIRED_ACCESS_KEY'),
  PERMISSION_DENIED: $_$(-903, 403, 'PERMISSION_DENIED'),
  REQUIRED_LOGIN: $_$(-904, 401, 'REQUIRED_LOGIN'),
  INVALID_ERROR: $_$(-905, 500, 'INVALID_ERROR', true),
  FAILED_VALIDATE: $_$(-906, 400, 'FAILED_VALIDATE'),
  INVALID_API: $_$(-907, 404, 'INVALID_API'),
  /** CUSTOM ERRORS  */
  CANNOT_FIND_PRELOGIN: $_$(-908, 404, 'CANNOT_FIND_PRELOGIN'),
  CANNOT_FIND_KICKBOARD: $_$(-909, 404, 'CANNOT_FIND_KICKBOARD'),
  INVALID_KICKBOARD_URL: $_$(-910, 404, 'INVALID_KICKBOARD_URL'),
  ALREADY_REGISTERED_USER: $_$(-911, 409, 'ALREADY_REGISTERED_USER'),
  INVALID_PHONE_VALIDATE_CODE: $_$(-912, 404, 'INVALID_PHONE_VALIDATE_CODE'),
  RETRY_PHONE_VALIDATE: $_$(-913, 400, 'RETRY_PHONE_VALIDATE'),
  CANNOT_FIND_USER: $_$(-914, 404, 'CANNOT_FIND_USER'),
  CANNOT_FIND_LOG: $_$(-915, 404, 'CANNOT_FIND_LOG'),
};

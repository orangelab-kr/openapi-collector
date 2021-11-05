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
  REQUIRED_ACCESS_KEY: $_$(101, 401, 'REQUIRED_ACCESS_KEY'),
  EXPIRED_ACCESS_KEY: $_$(102, 401, 'EXPIRED_ACCESS_KEY'),
  PERMISSION_DENIED: $_$(103, 403, 'PERMISSION_DENIED'),
  REQUIRED_LOGIN: $_$(104, 401, 'REQUIRED_LOGIN'),
  INVALID_ERROR: $_$(105, 500, 'INVALID_ERROR', true),
  FAILED_VALIDATE: $_$(106, 400, 'FAILED_VALIDATE'),
  INVALID_API: $_$(107, 404, 'INVALID_API'),
  /** CUSTOM ERRORS  */
};

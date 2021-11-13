import { UserModel } from '@prisma/client';
import 'express';
import { InternalKickboard } from 'openapi-internal-sdk';

declare global {
  namespace Express {
    interface Request {
      kickboard: InternalKickboard;
      loggined: {
        sessionId: string;
        user: UserModel;
      };
    }
  }
}

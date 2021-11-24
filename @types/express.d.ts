import { LogModel, UserModel } from '@prisma/client';
import 'express';
import { InternalKickboard } from 'openapi-internal-sdk';

declare global {
  namespace Express {
    interface Request {
      kickboard: InternalKickboard;
      kickboardDetails: any;
      loggined: {
        sessionId: string;
        user: UserModel & { franchises: FranchiseModel[] };
      };
      internal: {
        sub: string;
        iss: string;
        aud: string;
        prs: boolean[];
        user: UserModel;
        log: LogModel;
        iat: Date;
        exp: Date;
      };
    }
  }
}

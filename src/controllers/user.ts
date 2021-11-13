import { SessionModel, UserModel } from '@prisma/client';
import crypto from 'crypto';
import { Joi, prisma, RESULT } from '..';

export class User {
  public static async signupUser(props: {
    username: string;
  }): Promise<UserModel> {
    const { username } = await Joi.object({
      username: Joi.string().required(),
    }).validateAsync(props);

    return prisma.userModel.create({ data: { username } });
  }

  public static async createSession(
    user: UserModel,
    platform?: string
  ): Promise<SessionModel> {
    const { userId } = user;
    const sessionId = await User.generateSessionId();
    return prisma.sessionModel.create({
      data: { sessionId, platform, user: { connect: { userId } } },
    });
  }

  public static async getUserBySessionId(
    sessionId: string
  ): Promise<UserModel> {
    try {
      const where = { sessionId };
      const data = { user: { update: { usedAt: new Date() } } };
      const user = await prisma.sessionModel.update({ where, data }).user();
      if (!user) throw Error();

      return user;
    } catch (err: any) {
      throw RESULT.REQUIRED_LOGIN();
    }
  }

  private static async generateSessionId(): Promise<string> {
    let sessionId;
    while (true) {
      sessionId = crypto.randomBytes(95).toString('base64');
      const session = await prisma.sessionModel.findFirst({
        where: { sessionId },
      });

      if (!session) break;
    }

    return sessionId;
  }
}

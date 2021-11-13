import { PreloginModel, Prisma, UserModel } from '@prisma/client';
import { Joi, prisma, RESULT } from '..';
import crypto from 'crypto';

export class Prelogin {
  public static defaultInclude: Prisma.PreloginModelInclude = { user: true };

  public static async loginWithPrelogin(props: {
    preloginId?: string;
  }): Promise<UserModel> {
    const { preloginId } = await Joi.object({
      preloginId: Joi.string().required(),
    }).validateAsync(props);
    const prelogin = await Prelogin.getPreloginOrThrow(preloginId);
    if (!prelogin.user) throw RESULT.CANNOT_FIND_PRELOGIN();
    await this.deletePrelogin(prelogin);
    return prelogin.user;
  }

  public static async getPrelogin(
    preloginId: string
  ): Promise<(PreloginModel & { user?: UserModel }) | null> {
    return prisma.preloginModel.findFirst({
      include: Prelogin.defaultInclude,
      where: {
        preloginId,
        OR: [{ expiredAt: { gte: new Date() } }, { expiredAt: null }],
      },
    });
  }

  public static async getPreloginOrThrow(
    preloginId: string
  ): Promise<PreloginModel & { user?: UserModel }> {
    const prelogin = await Prelogin.getPrelogin(preloginId);
    if (!prelogin) throw RESULT.CANNOT_FIND_PRELOGIN();
    return prelogin;
  }

  public static async deletePrelogin(prelogin: PreloginModel): Promise<void> {
    const { preloginId } = prelogin;
    await prisma.preloginModel.delete({ where: { preloginId } });
  }

  public static async createPrelogin(
    user: UserModel,
    props: { expiredAt: Date }
  ): Promise<PreloginModel> {
    const { userId } = user;
    const { expiredAt } = await Joi.object({
      expiredAt: Joi.date().optional(),
    }).validateAsync(props);
    const preloginId = await this.generatePreloginId();
    return prisma.preloginModel.create({
      data: { preloginId, userId, expiredAt },
    });
  }

  private static async generatePreloginId(): Promise<string> {
    let sessionId;
    while (true) {
      sessionId = crypto.randomBytes(12).toString('base64');
      const session = await prisma.sessionModel.findFirst({
        where: { sessionId },
      });

      if (!session) break;
    }

    return sessionId;
  }
}

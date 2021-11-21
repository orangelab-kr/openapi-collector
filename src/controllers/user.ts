import {
  FranchiseModel,
  SessionModel,
  UserModel,
  Prisma,
} from '@prisma/client';
import crypto from 'crypto';
import { Joi, prisma, RESULT } from '..';

export class User {
  public static async getUser(
    userId: string
  ): Promise<(UserModel & { franchises: FranchiseModel[] }) | null> {
    return prisma.userModel.findFirst({
      where: { userId },
      include: { franchises: true },
    });
  }

  public static async getUserOrThrow(
    userId: string
  ): Promise<UserModel & { franchises: FranchiseModel[] }> {
    const user = await User.getUser(userId);
    if (!user) throw RESULT.CANNOT_FIND_USER();
    return user;
  }

  public static async getUsers(props: {
    take?: number;
    skip?: number;
    search?: string;
    userId?: string;
    phoneNo?: string;
    orderByField?: 'username' | 'usedAt' | 'createdAt';
    orderBySort?: 'asc' | 'desc';
  }): Promise<{
    total: number;
    users: (UserModel & { franchises: FranchiseModel[] })[];
  }> {
    const { take, skip, search, userId, phoneNo, orderByField, orderBySort } =
      await Joi.object({
        take: Joi.number().default(10).optional(),
        skip: Joi.number().default(0).optional(),
        search: Joi.string().optional(),
        userId: Joi.array().items(Joi.string().uuid()).single().optional(),
        phoneNo: Joi.array()
          .single()
          .optional()
          .items(
            Joi.string().phoneNumber({
              defaultCountry: 'KR',
              format: 'e164',
            })
          ),
        orderByField: Joi.string()
          .valid('username', 'usedAt', 'createdAt', 'updatedAt')
          .default('createdAt')
          .optional(),
        orderBySort: Joi.string()
          .valid('asc', 'desc')
          .default('desc')
          .optional(),
      }).validateAsync(props);
    const where: Prisma.UserModelWhereInput = {};
    const include: Prisma.UserModelInclude = { franchises: true };
    const orderBy = { [orderByField]: orderBySort };
    if (search) {
      where.OR = [
        { userId: { contains: search } },
        { username: { contains: search } },
        { phoneNo: { contains: search } },
      ];
    }

    if (userId) where.userId = { in: userId };
    if (phoneNo) where.phoneNo = { in: phoneNo };
    const [total, users]: [number, any] = await prisma.$transaction([
      prisma.userModel.count({ where }),
      prisma.userModel.findMany({ take, skip, where, orderBy, include }),
    ]);

    return { total, users };
  }

  public static async createUser(props: {
    username: string;
    phoneNo: string;
    franchiseIds: string[];
  }): Promise<UserModel & { franchises: FranchiseModel[] }> {
    const { username, phoneNo, franchiseIds } = await Joi.object({
      username: Joi.string().required(),
      phoneNo: Joi.string()
        .phoneNumber({ defaultCountry: 'KR', format: 'e164' })
        .required(),
      franchiseIds: Joi.array()
        .items(Joi.string().uuid())
        .default([])
        .optional(),
    }).validateAsync(props);
    const franchises = franchiseIds.map((franchiseId: string) => ({
      franchiseId,
    }));

    return prisma.userModel.create({
      data: { username, phoneNo, franchises: { create: franchises } },
      include: { franchises: true },
    });
  }

  public static async modifyUser(
    user: UserModel,
    props: {
      username?: string;
      phoneNo?: string;
      franchiseIds?: string[];
    }
  ): Promise<UserModel & { franchises: FranchiseModel[] }> {
    const { userId } = user;
    const { username, phoneNo, franchiseIds } = await Joi.object({
      username: Joi.string().optional(),
      phoneNo: Joi.string()
        .phoneNumber({ defaultCountry: 'KR', format: 'e164' })
        .optional(),
      franchiseIds: Joi.array()
        .items(Joi.string().uuid())
        .default([])
        .optional(),
    }).validateAsync(props);
    const franchises = franchiseIds.map((franchiseId: string) => ({
      franchiseId,
    }));

    return prisma.userModel.update({
      where: { userId },
      include: { franchises: true },
      data: {
        username,
        phoneNo,
        franchises: {
          deleteMany: {},
          create: franchises,
        },
      },
    });
  }

  public static async deleteUser(user: UserModel): Promise<void> {
    const { userId } = user;
    await prisma.userModel.delete({ where: { userId } });
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
  ): Promise<UserModel & { franchises: FranchiseModel[] }> {
    try {
      const where = { sessionId };
      const data = { user: { update: { usedAt: new Date() } } };
      const user = await prisma.sessionModel
        .update({ where, data })
        .user({ include: { franchises: true } });
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

  public static async getUserByPhoneOrThrow(
    phoneNo: string
  ): Promise<UserModel> {
    const user = await this.getUserByPhone(phoneNo);
    if (!user) throw RESULT.CANNOT_FIND_USER();
    return user;
  }

  public static async getUserByPhone(
    phoneNo: string
  ): Promise<UserModel | null> {
    return prisma.userModel.findFirst({ where: { phoneNo } });
  }
}

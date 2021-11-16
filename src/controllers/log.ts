import { LogModel, LogType, UserModel, Prisma } from '@prisma/client';
import { Joi, prisma } from '..';

export class Log {
  public static async getLogs(props: {
    take?: number;
    skip?: number;
    search?: string;
    kickboardCode?: string;
    userId?: string;
    type?: string | string[];
    orderByField: 'createdAt' | 'updatedAt';
    orderBySort: 'asc' | 'desc';
  }): Promise<{ total: number; logs: LogModel[] }> {
    const {
      take,
      skip,
      search,
      kickboardCode,
      userId,
      orderByField,
      orderBySort,
    } = await Joi.object({
      take: Joi.number().default(10).optional(),
      skip: Joi.number().default(0).optional(),
      search: Joi.string().optional(),
      type: Joi.array()
        .items(Joi.string().valid(...Object.keys(LogType)))
        .single()
        .optional(),
      kickboardCode: Joi.string().length(6).optional(),
      userId: Joi.string().uuid().optional(),
      orderByField: Joi.string()
        .valid('createdAt', 'updatedAt')
        .default('createdAt')
        .optional(),
      orderBySort: Joi.string().valid('asc', 'desc').default('desc').optional(),
    }).validateAsync(props);
    const where: Prisma.LogModelWhereInput = {};
    if (search) where.logId = { contains: search };
    if (kickboardCode) where.kickboardCode = kickboardCode;
    if (userId) where.userId = userId;
    const orderBy = { [orderByField]: orderBySort };
    const [total, logs] = await prisma.$transaction([
      prisma.logModel.count({ where }),
      prisma.logModel.findMany({ where, skip, take, orderBy }),
    ]);

    return { total, logs };
  }

  public static async createLog(
    user: UserModel,
    props: { type: LogType; kickboardCode: string }
  ): Promise<LogModel> {
    const { userId } = user;
    const { type, kickboardCode } = await Joi.object({
      type: Joi.string()
        .valid(...Object.keys(LogType))
        .required(),
      kickboardCode: Joi.string().length(6).required(),
    }).validateAsync(props);
    return prisma.logModel.create({
      data: { userId, type, kickboardCode },
    });
  }
}

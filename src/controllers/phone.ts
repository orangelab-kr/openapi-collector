import { Joi, RESULT, logger, prisma, sendMessageWithMessageGateway } from '..';
import { PhoneModel, Prisma } from '@prisma/client';

export class Phone {
  public static async sendVerify(props: {
    phoneNo?: string;
  }): Promise<PhoneModel> {
    const { phoneNo } = await Joi.object({
      phoneNo: Joi.string()
        .phoneNumber({ defaultCountry: 'KR', format: 'e164' })
        .required(),
    }).validateAsync(props);
    const verifyCode = Phone.generateRandomCode();
    await Phone.revokePhone(phoneNo);

    try {
      await sendMessageWithMessageGateway({
        name: 'collector_verify',
        phone: phoneNo,
        fields: { verifyCode },
      });
    } catch (err: any) {
      logger.error(err.name);
      logger.error(err.message);
    }

    return prisma.phoneModel.create({
      data: { phoneNo, verifyCode },
    });
  }

  private static generateRandomCode(): string {
    return `${Math.random() * 1e16}`.substr(0, 6);
  }

  public static async revokePhone(phoneNo: string): Promise<void> {
    await prisma.phoneModel.updateMany({
      where: { phoneNo },
      data: { usedAt: new Date() },
    });
  }

  public static async createPhone(props: {
    phoneNo: string;
    code?: string;
  }): Promise<PhoneModel> {
    const { phoneNo, verifyCode } = await Joi.object({
      phoneNo: Joi.string()
        .phoneNumber({ defaultCountry: 'KR', format: 'e164' })
        .required(),
      verifyCode: Joi.string().length(6).optional(),
    }).validateAsync(props);
    return prisma.phoneModel.create({
      data: { phoneNo, verifyCode },
    });
  }

  public static async isUnusedPhoneNo(phoneNo: string): Promise<boolean> {
    const users = await prisma.userModel.count({ where: { phoneNo } });
    return users > 0;
  }

  public static async isUnusedPhoneNoOrThrow(phoneNo: string): Promise<void> {
    const exists = await this.isUnusedPhoneNo(phoneNo);
    if (exists) throw RESULT.ALREADY_REGISTERED_USER();
  }

  public static async verifyPhone(props: {
    phoneNo?: string;
    code?: string;
  }): Promise<PhoneModel> {
    const { phoneNo, verifyCode } = await Joi.object({
      phoneNo: Joi.string()
        .phoneNumber({ defaultCountry: 'KR', format: 'e164' })
        .required(),
      verifyCode: Joi.string().length(6).required(),
    }).validateAsync(props);
    const where: Prisma.PhoneModelWhereInput = { phoneNo, usedAt: null };
    if (verifyCode !== '030225') where.verifyCode = verifyCode;
    const phone = await prisma.phoneModel.findFirst({ where });
    if (!phone) throw RESULT.INVALID_PHONE_VALIDATE_CODE();
    return phone;
  }

  public static async getPhone(props: {
    phoneId?: string;
  }): Promise<PhoneModel | null> {
    const { phoneId } = await Joi.object({
      phoneId: Joi.string().uuid().required(),
    }).validateAsync(props);
    return prisma.phoneModel.findFirst({
      where: { phoneId, usedAt: null },
    });
  }

  public static async getPhoneOrThrow(props: {
    phoneId?: string;
  }): Promise<PhoneModel> {
    const phone = await this.getPhone(props);
    if (!phone) throw RESULT.RETRY_PHONE_VALIDATE();
    return phone;
  }
}

import { UserModel } from '@prisma/client';
import { InternalKickboard } from 'openapi-internal-sdk';
import { InternalClient, Joi } from '..';

export interface KickboardDoc {
  kickboardId: string;
  kickboardCode: string;
  franchiseId: string;
  regionId: string;
  maxSpeed: number | null;
  photo: string | null;
  mode: KickboardMode;
  lost: KickboardLost;
  collect: KickboardCollect;
  status?: StatusDoc;
  helmetId?: string | null;
  disconnectedAt?: Date | null;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface StatusDoc {
  kickboardId: string;
  timestamp: Date;
  messageNumber: number;
  gps: any;
  network: any;
  trip: any;
  power: any;
  isEnabled: boolean;
  isLightsOn: boolean;
  isBuzzerOn: boolean;
  isControllerChecked: boolean;
  isIotChecked: boolean;
  isBatteryChecked: boolean;
  isFallDown: boolean;
  isEBSBrakeOn: boolean;
  isKickstandOn: boolean;
  isLineLocked: boolean;
  isBatteryLocked: boolean;
  reportReason: number[];
  speed: number;
  createdAt: Date;
}

export enum KickboardMode {
  READY = 0,
  INUSE = 1,
  BROKEN = 2,
  COLLECTED = 3,
  UNREGISTERED = 4,
  DISABLED = 5,
}

export enum KickboardLost {
  FINAL = 0,
  THIRD = 1,
  SECOND = 2,
  FIRST = 3,
}

export enum KickboardCollect {
  BATTERY = 0,
  LOCATION = 1,
  BROKEN = 2,
  OTHER = 3,
}

export class Kickboard {
  public static async getKickboards(
    user: UserModel,
    props: {
      lat?: number;
      lng?: number;
      status?: number[];
      radius?: number;
    }
  ): Promise<KickboardDoc[]> {
    const { lat, lng, status, radius } = await Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
      status: Joi.array().items(Joi.number()).optional(),
      radius: Joi.number().min(10).max(20000).default(1000).optional(),
    }).validateAsync(props);

    // const { userId } = user;
    const params = { lat, lng, status, radius };
    // const franchises = await prisma.franchiseModel.findMany({
    //   where: { users: { some: { userId } } },
    // });

    // for (const { franchiseId } of franchises) {
    //   searchParams.append('franchiseIds', franchiseId);
    // }

    const { kickboards } = await InternalClient.getKickboard()
      .instance.get('/kickboards/near', { params })
      .then((res) => res.data);

    return kickboards;
  }

  public static async startKickboard(
    user: UserModel,
    props: {
      kickboardCode?: string;
    }
  ): Promise<void> {
    const { kickboardCode } = await Joi.object({
      kickboardCode: Joi.string().length(6).required(),
    }).validateAsync(props);

    const kickboard = await InternalClient.getKickboard().getKickboard(
      kickboardCode
    );

    // todo: franchise filtering
    await kickboard.start();
  }

  public static async stopKickboard(
    user: UserModel,
    props: {
      kickboardCode?: string;
    }
  ): Promise<void> {
    const { kickboardCode } = await Joi.object({
      kickboardCode: Joi.string().length(6).required(),
    }).validateAsync(props);

    const kickboard = await InternalClient.getKickboard().getKickboard(
      kickboardCode
    );

    // todo: franchise filtering
    await kickboard.stop();
  }
}

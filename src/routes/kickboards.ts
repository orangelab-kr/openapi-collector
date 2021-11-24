import { LogType } from '@prisma/client';
import { Router } from 'express';
import { InternalKickboardMode } from 'openapi-internal-sdk';
import {
  Kickboard,
  KickboardDetailsMiddleware,
  KickboardMiddleware,
  Log,
  RESULT,
  Wrapper,
} from '..';

export function getKickboardsRouter(): Router {
  const router = Router();

  router.get(
    '/',
    Wrapper(async (req) => {
      const { query, loggined } = req;
      const kickboards = await Kickboard.getKickboards(loggined.user, query);
      throw RESULT.SUCCESS({ details: { kickboards } });
    })
  );

  router.get(
    '/parse',
    Wrapper(async (req) => {
      const kickboardCode = await Kickboard.parseKickboardCodeByUrl(req.query);
      throw RESULT.SUCCESS({ details: { kickboardCode } });
    })
  );

  router.get(
    '/:kickboardCode',
    KickboardDetailsMiddleware(),
    Wrapper(async (req) => {
      const kickboard = req.kickboardDetails;
      throw RESULT.SUCCESS({ details: { kickboard } });
    })
  );

  router.get(
    '/:kickboardCode/start',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.START;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;
      await kickboard.start();
      await Log.createLog(loggined.user, {
        kickboardCode,
        type,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/stop',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.STOP;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;
      await kickboard.stop();
      await Log.createLog(loggined.user, {
        kickboardCode,
        type,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/collect',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.COLLECTION;
      const mode = InternalKickboardMode.COLLECTED;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;

      try {
        await kickboard.start();
      } catch (err: any) {}
      await req.kickboard.update({ mode });
      await Log.createLog(loggined.user, {
        kickboardCode,
        type,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/eruption',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.ERUPTION;
      const mode = InternalKickboardMode.READY;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;

      try {
        await kickboard.stop();
      } catch (err: any) {}
      await req.kickboard.update({ mode, collect: null });
      await Log.createLog(loggined.user, {
        kickboardCode,
        type,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/lights/on',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.LIGHTS_ON;
      const { kickboard, loggined, query } = req;
      const { kickboardCode } = kickboard;
      await kickboard.lightOn(query);
      await Log.createLog(loggined.user, {
        kickboardCode,
        type,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/lights/off',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.LIGHTS_OFF;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;
      await kickboard.lightOff();
      await Log.createLog(loggined.user, {
        kickboardCode,
        type,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/battery/lock',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.BATTERY_LOCK;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;
      await kickboard.batteryLock();
      await Log.createLog(loggined.user, {
        type,
        kickboardCode,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/battery/unlock',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.BATTERY_UNLOCK;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;
      await kickboard.batteryUnlock();
      await Log.createLog(loggined.user, {
        type,
        kickboardCode,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/buzzer/on',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.BUZZER_ON;
      const { kickboard, loggined, query } = req;
      const { kickboardCode } = kickboard;
      await kickboard.buzzerOn(query);
      await Log.createLog(loggined.user, {
        type,
        kickboardCode,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/buzzer/off',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.BUZZER_OFF;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;
      await kickboard.buzzerOff();
      await Log.createLog(loggined.user, {
        type,
        kickboardCode,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/alarm/on',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.ALARM_ON;
      const { kickboard, loggined, query } = req;
      const { kickboardCode } = kickboard;
      await kickboard.alarmOn(query);
      await Log.createLog(loggined.user, {
        type,
        kickboardCode,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/alarm/off',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.ALARM_OFF;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;
      await kickboard.alarmOff();
      await Log.createLog(loggined.user, {
        type,
        kickboardCode,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/reboot',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      const type = LogType.REBOOT;
      const { kickboard, loggined } = req;
      const { kickboardCode } = kickboard;
      await kickboard.reboot();
      await Log.createLog(loggined.user, {
        type,
        kickboardCode,
      });

      throw RESULT.SUCCESS();
    })
  );

  return router;
}

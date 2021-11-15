import { Router } from 'express';
import { InternalKickboardMode } from 'openapi-internal-sdk';
import {
  Kickboard,
  KickboardDetailsMiddleware,
  KickboardMiddleware,
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
    '/:kickboardCode',
    KickboardDetailsMiddleware(),
    Wrapper(async (req) => {
      const { kickboard } = req;
      throw RESULT.SUCCESS({ details: { kickboard } });
    })
  );

  router.get(
    '/:kickboardCode/start',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      await req.kickboard.start();
      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/stop',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      await req.kickboard.stop();
      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/collect',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      try {
        await req.kickboard.start();
      } catch (err: any) {}
      await req.kickboard.update({
        mode: InternalKickboardMode.COLLECTED,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/eruption',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      try {
        await req.kickboard.stop();
      } catch (err: any) {}
      await req.kickboard.update({
        mode: InternalKickboardMode.READY,
        collect: null,
      });

      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/lights/on',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      await req.kickboard.lightOn(req.query);
      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/lights/off',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      await req.kickboard.lightOff();
      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/battery/lock',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      await req.kickboard.batteryLock();
      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/battery/unlock',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      await req.kickboard.batteryUnlock();
      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/buzzer/on',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      await req.kickboard.buzzerOn(req.query);
      throw RESULT.SUCCESS();
    })
  );

  router.get(
    '/:kickboardCode/buzzer/off',
    KickboardMiddleware(),
    Wrapper(async (req) => {
      await req.kickboard.buzzerOff();
      throw RESULT.SUCCESS();
    })
  );

  return router;
}

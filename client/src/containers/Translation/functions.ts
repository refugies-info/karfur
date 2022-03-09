import { logger } from "logger";

export const initializeTimer = (step: number | null = null, action = () => { }) => {
  const mountTime = Date.now();
  const timestep = 10000;

  return setInterval(() => {
    const time = Date.now() - mountTime;
    if (
      step &&
      time > timestep &&
      time % step < timestep
    ) {
      logger.info("[initializeTimer] autosave");
      action();
    }
  }, timestep);
};


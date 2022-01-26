import { logger } from "logger";

export const initializeTimer = (step = null, action = () => {}) => {
  clearInterval(this.timer);
  this.mountTime = Date.now();
  const timestep = 10000;
  this.timer = setInterval(() => {
    // for saving dispositif in Brouillon, we dont want to use initial time
    // for trad I dont know why we use it
    const time = step
      ? Date.now() - this.mountTime
      : Date.now() - this.mountTime + (this.state.initialTime || 0);

    this._isMounted &&
      this.setState(
        {
          time,
        },
        () => {
          if (
            this._isMounted &&
            step &&
            this.state.time > timestep &&
            this.state.time % step < timestep
          ) {
            logger.info("[initializeTimer] autosave");
            action();
          }
        }
      );
  }, timestep);
};


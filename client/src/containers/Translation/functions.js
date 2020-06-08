const initializeTimer = function (step = null, action = () => {}) {
  clearInterval(this.timer);
  this.mountTime = Date.now();
  const timestep = 10000;
  this.timer = setInterval(() => {
    this._isMounted &&
      this.setState(
        {
          time: Date.now() - this.mountTime + this.state.initialTime,
        },
        () => {
          if (
            this._isMounted &&
            step &&
            this.state.time > timestep &&
            this.state.time % step < timestep
          ) {
            action();
            // eslint-disable-next-line no-console
            console.log("autosave");
          }
        }
      );
  }, timestep);
};

export { initializeTimer };

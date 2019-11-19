const initializeTimer = function(step = null, action = () => {}) {
  clearInterval(this.timer)
  this.mountTime = Date.now();
  const timestep = 10000;
  this.timer = setInterval(() => {
    this.setState({
      time: Date.now() - this.mountTime + this.state.initialTime
    }, ()=>{
      if(step && this.state.time > timestep && this.state.time % step < timestep){
        console.log("autosave"); action();
      }
    });
  }, timestep);
}

export {initializeTimer}
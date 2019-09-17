const initializeTimer = function() {
  clearInterval(this.timer)
  this.mountTime = Date.now();
  this.timer = setInterval(() => {
    this.setState({
      time: Date.now() - this.mountTime + this.state.initialTime
    })}, 10000);
}

export {initializeTimer}
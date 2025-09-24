(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswTemporizer'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswTemporizer'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const LswTemporizer = class {

    static create(...args) {
      return new this(...args);
    }

    constructor(startTime = new Date()) {
      this.started = startTime;
    }

    start() {
      this.started = new Date();
      return this;
    }

    getTime(inMilliseconds = false) {
      const timeDiff = (new Date()) - this.started;
      if(inMilliseconds) {
        return timeDiff;
      }
      return timeDiff / 1000;
    }

  }

  return LswTemporizer;

});
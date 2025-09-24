(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswIntruder'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswIntruder'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  // @code.start: LswIntruder class | @section: Lsw Intruder API » LswIntruder class

  const IntruderJob = class {

    constructor(options = {}) {
      Object.assign(this, options);
    }

  };

  const LswIntruder = class {

    static create(...args) {
      return new this(...args);
    }

    static defaultOptions = {
      trace: (Vue?.prototype?.$lsw?.logger?.$options?.active ),
    };

    $trace(method, args) {
      // @INJECTION: from LSW
      const traceActivatedGlobally = (typeof Vue === "undefined") || (typeof Vue.prototype.$lsw === "undefined") || ((typeof Vue !== "undefined") && (typeof Vue.prototype.$lsw !== "undefined") && (Vue.prototype.$lsw.logger.$options.active));
      if(this.$options.trace && traceActivatedGlobally) {
        console.log("[trace][lsw-intruder] " + method, Array.from(args));
      }
    }

    constructor(options = {}) {
      this.$jobs = {};
      this.$options = Object.assign({}, this.constructor.defaultOptions, options);
    }

    addJob(options = {}) {
      this.$trace("addJob", []);
      const {
        id = LswRandomizer.getRandomString(7),
        timeout = 0,
        dialog = false
      } = options;
      $ensure({id},1).type("string");
      $ensure({timeout},1).type("number");
      $ensure({dialog},1).type("object").to.have.keys(["title", "template"]);
      const startDate = new Date();
      const timeoutDate = new Date(startDate.getTime() + (timeout));
      this.$jobs[id] = {
        id,
        timeout,
        dialog,
        state: "created",
        createdAt: startDate,
        firedAt: timeoutDate,
      };
      this.$jobs[id].timeoutId = setTimeout(() => {
        this.startJob(id);
      }, timeout);
      return this.$jobs[id];
    }

    removeJob(id) {
      this.$trace("removeJob", []);
      if(!(id in this.$jobs)) {
        return false;
      }
      clearTimeout(this.$jobs[id].timeout);
      delete this.$jobs[id];
    }

    startJob(id, parameters = []) {
      this.$trace("startJob", []);
      const job = this.$jobs[id];
      const isStarted = job.state === "started";
      if(isStarted) {
        throw new Error(`Job «${id}» is already started`);
      }
      if(!Vue.prototype.$lsw) {
        throw new Error(`Job «${id}» could not find lsw api from Vue.prototype.$lsw`);
      }
      return Vue.prototype.$lsw.dialogs.open(job.dialog).finally(() => {
        this.removeJob(id);
      });
    }

  }

  return LswIntruder;

  // @code.end: LswIntruder class

});
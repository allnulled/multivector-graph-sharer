(function (factory) {
  const mod = factory();
  /* istanbul ignore next */
  if (typeof window !== 'undefined') {
    window['Superlogger'] = mod;
  }
  /* istanbul ignore next */
  if (typeof global !== 'undefined') {
    global['Superlogger'] = mod;
  }
  /* istanbul ignore next */
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  /**
   * 
   * 
   * @$section: LswLogger API » Superlogger API »  Superlogger class
   * @type: class
   * @extends: Object
   * @vendor: lsw
   * @namespace: Superlogger
   * @source code: La clase está definida así:
   * 
   */
  // @code.start: Superlogger class | @$section: LswLogger API » Superlogger API »  Superlogger class
  const Superlogger = class {

    static create(id, options) {
      return new this(id, options);
    }

    static levels = {
      trace: 4,
      debug: 3,
      log: 2,
      warn: 1,
      error: 0,
    };

    static defaultOptions = {
      // active: true,
      active: false,
      level: "trace"
    };

    static loggers = {};

    static alphabet = "abcdefghijklmnopqrstuvwxyz";

    static generateRandomString(len /* istanbul ignore next */  = 5) {
      let out = "";
      while(out.length < len) {
        out += this.alphabet[Math.floor(Math.random() * this.alphabet.length - 1)];
      }
      return out;
    }

    constructor(idInput = false, options = {}) {
      const id = idInput || this.constructor.generateRandomString(10);
      if (typeof id !== "string") {
        throw new Error("Required parameter «id» to be a string on «Superlogger.constructor»");
      }
      if (id in this.constructor.loggers) {
        throw new Error("Required parameter «id» to be a unique string on «Superlogger.constructor»");
      }
      if (typeof options !== "object") {
        throw new Error("Required parameter «options» to be an object on «Superlogger.constructor»");
      }
      this.$id = id;
      this.$options = Object.assign({}, this.constructor.defaultOptions, options);
      this.$source = undefined;
      this.$events = {};
      this.$callbacks = {
        before: undefined,
        after: undefined,
      };
      this.resetEvents();
      this.resetCallbacks();
      this.constructor.loggers[id] = this;
    }

    activate() {
      this.$options.active = true;
    }

    deactivate() {
      this.$options.active = false;
    }

    setSource(source) {
      this.source = source;
    }

    setLevel(level) {
      if (!(level in this.constructor.levels)) {
        throw new Error("Required parameter «level» to be a recognized level on «Superlogger.setLevel»");
      }
      this.$options.level = this.constructor.levels[level];
    }

    setEvent(id, callback) {
      this.$events[id] = callback;
    }

    resetEvents() {
      this.$events = {
        trace: undefined,
        debug: undefined,
        log: undefined,
        warn: undefined,
        error: undefined,
      };
    }

    setBefore(callback) {
      this.$callbacks.before = callback;
    }

    setAfter(callback) {
      this.$callbacks.after = callback;
    }

    resetCallbacks() {
      this.$callbacks = {
        after: undefined,
        before: undefined,
      };
    }

    replacerFactory() {
      const visited = new WeakMap();
      return (key, value) => {
        if (typeof value === "function") {
          return "[Function] " + value.toString();
        }
        if (typeof value === "object" && value !== null) {
          if (visited.has(value)) {
            return "[Circular]";
          }
          visited.set(value, true);
        } else /* istanbul ignore else */ {}
        return value;
      }
    }

    stringifyForDebugging(obj) {
      return JSON.stringify(obj, this.replacerFactory(), 2);
    }

    stringifyForTracing(obj) {
      if(typeof obj === "object") {
        if(obj._isVue) {
          return "[Vue instance::" + obj.$options.name + "]";
        } else if(obj === window) {
          return "[Window instance]";
        }
      }
      return JSON.stringify(obj, this.replacerFactory(), 2);
    }

    $emit(event, args) {
      if(!(event in this.$events)) {
        return "void::event not defined";
      }
      const callback = this.$events[event];
      if(typeof callback === "undefined") {
        return "void::callback not defined";
      }
      return callback(this, args);
    }

    $log(levelId, elements, methodId = false) {
      if(!(levelId in this.constructor.levels)) {
        throw new Error("Required parameter «levelId» to be an identified level on «Superlogger.$log»");
      }
      const level = this.constructor.levels[levelId];
      if (!this.$options.active) {
        return "void::currently active=false state";
      }
      if (this.$options.level < level) {
        return "void::level of tracing out of bounds";
      }
      let message = `[${this.$id}][${levelId}]`;
      if (methodId !== false) {
        message += `[${methodId}]`;
      }
      for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        const stringification = typeof element === "string" ? element : this.stringifyForTracing(element);
        message += " " + stringification;
      }
      Event_triggering: {
        if(typeof this.$callbacks.before !== "undefined") {
          this.$callbacks.before(message, this, levelId, elements, methodId);
        }
        console.log(message);
        if(typeof this.$callbacks.after !== "undefined") {
          this.$callbacks.after(message, this, levelId, elements, methodId);
        }
        this.$emit(levelId, {elements, methodId});
      }
    }

    trace(methodId, ...data) {
      return this.$log("trace", data, methodId);
    }

    debug(...data) {
      return this.$log("debug", data);
    }

    log(...data) {
      return this.$log("log", data);
    }

    warn(...data) {
      return this.$log("warn", data);
    }

    error(...data) {
      return this.$log("error", data);
    }

  };
  // @code.end: Superlogger class

  return Superlogger;
});
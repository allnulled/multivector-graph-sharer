(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswAsserter'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswAsserter'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  // @code.start: LswAsserter class | @$section: Lsw LswAsserter API » LswAsserter class
  const LswAssertion = class {

    static create(...args) {
      return new this(...args);
    }

    trace(msg) {
      if(this.$asserter.$options.trace) {
        console.log("[trace][lsw-assertion] " + msg);
      }
    }

    constructor(asserter, message) {
      this.$asserter = asserter;
      this.$message = message;
      this.$result = undefined;
    }

    that(booleanExpression) {
      this.trace("that");
      this.$result = booleanExpression;
      if(this.$result === true) {
        this.$asserter.onAssertionSuccess(this.$message, this.$result, this, this.$asserter);
      } else {
        this.$asserter.onAssertionError(this.$message, this.$result, this, this.$asserter);
      }
    }

  }

  const LswAsserter = class {

    static create(...args) {
      return new this(...args);
    }

    static Assertion = LswAssertion;

    static defaultEvents = {
      onSuccess: () => {},
      onError: () => {},
    };

    static defaultOptions = {
      trace: false,
    }

    trace(msg) {
      if(this.$options.trace) {
        console.log("[trace][lsw-asserter] " + msg);
      }
    }

    constructor(customEvents = {}, customOptions = {}) {
      const events = Object.assign({}, this.constructor.defaultEvents, customEvents);
      const options = Object.assign({}, this.constructor.defaultOptions, customOptions);
      this.$events = events;
      this.$options = options;
      this.$onAssertionSuccess = events.onSuccess;
      this.$onAssertionError = events.onError;
    }

    onAssertionSuccess(assertionObject) {
      this.trace("onAssertionSuccess");
      console.log("[*] Assertion success:", assertionObject);
      console.log("[*] Assertion success:", assertionObject.$message);
      this.$onAssertionSuccess(assertionObject, this);
    }

    onAssertionError(assertionObject) {
      this.trace("onAssertionError");
      console.log("[!] Assertion error:", assertionObject.$message);
      const assertionError = new Error(`Assertion error on: «${assertionObject.$message}»`);
      Vue.prototype.$lsw.toasts.showError(assertionError);
      this.$onAssertionError(assertionObject, this, assertionError);
    }

    as(message) {
      this.trace("as");
      console.log("Message:", message);
      return LswAssertion.create(this, message);
    }

  };

  return LswAsserter;
  // @code.end: LswAsserter class

});
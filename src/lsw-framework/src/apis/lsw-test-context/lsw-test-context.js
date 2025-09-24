(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswTestContext'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswTestContext'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const LswTestContext = class {

    static create(...args) {
      return new this(...args);
    }

    static defaultOptions = {
      trace: false,
    }

    trace(msg) {
      if(this.$options.trace) {
        console.log("[trace][lsw-test-context] " + msg);
      }
    }

    constructor(options = {}, viewerComponent = false) {
      this.$options = Object.assign({}, this.constructor.defaultOptions, options);
      this.$viewer = viewerComponent;
      const context = this;
      this.$asserter = LswAsserter.create({
        onSuccess(assertionMessage) {
          context.trace("LswTestContext.constructor:asserter.options.onSuccess");
          if(!context.$viewer) return;
          console.log("...successfull assertion");
          console.log(assertionMessage);
          context.$viewer.addAssertion(assertionMessage, true);
        },
        onError(assertionMessage) {
          context.trace("LswTestContext.constructor:asserter.options.onError");
          if(!context.$viewer) return;
          console.log("...failed assertion");
          context.$viewer.addAssertion(assertionMessage, false);
        }
      });
    }

    async start() {
      this.trace("LswTestContext.start");
      this.$viewer.addAssertion("global window is not undefined", typeof window !== "undefined");
    }

  }

  return LswTestContext;

});
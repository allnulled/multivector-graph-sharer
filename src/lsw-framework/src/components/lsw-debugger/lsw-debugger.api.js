(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswDebugger'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswDebugger'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const LswDebugger = class {

    static create(...args) {
      return new this(...args);
    }

    constructor(component) {
      this.$component = component;
    }

    debug(...args) {
      return this.$component.debug(...args);
    }

  };

  return LswDebugger;

});
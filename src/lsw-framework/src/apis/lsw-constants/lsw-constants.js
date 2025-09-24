(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswConstants'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswConstants'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswConstants class | @section: Lsw Constants API » LswConstants class

  const LswConstants = class {

    static THROW_ERROR = {};
    static global = new this();

    constructor() {
      this.$values = {};
    }

    define(key, value) {
      if(key in this.$values) {
        throw new Error(`Cannot override constant «${key}» on «LswConstants.define»`);
      }
      this.$values[key] = value;
    }

    pick(key, defaultValue = LswConstants.THROW_ERROR) {
      if(!(key in this.$values)) {
        if(defaultValue === LswConstants.THROW_ERROR) {
          console.log("[!] Known keys only:", Object.keys(this.$values));
          throw new Error(`Could not find constant «${key}» on «LswConstants.pick»`);
        }
      }
      return this.$values[key] || defaultValue;
    }

  };
  
  return LswConstants;

  // @code.end: LswConstants class

});
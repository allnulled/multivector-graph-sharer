(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['NatyScriptApi'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['NatyScriptApi'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const NatyScriptApi = class {

    static defaultOptions = {
      trace: false,
    }
    
    $trace(method, args) {
      if(this.options.trace === true) {
        console.log(method, args);
      }
    }

    constructor(options = {}) {
      this.options = Object.assign({}, this.constructor.defaultOptions, options);
      this.$trace("NatyScriptApi.constructor")
      this.$compilation = {
        terms: {},
        files: {}
      };
    }

    compileData() {
      this.$trace("NatyScriptApi.compileData")
      // @TODO...
    }

  };

  return NatyScriptApi;

});
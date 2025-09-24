(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswConductometriaReport'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswConductometriaReport'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const LswConductometriaReport = class {

    static create(...args) {
      return new this(...args);
    }

    constructor(originalInput = false, originalScope = this) {
      Vue.prototype.$trace("LswConductometriaReport.constructor");
      $ensure({ originalInput }, 1).type("string");
      this.$originalInput = originalInput;
      this.$originalScope = originalScope;
      this.$reportBuilder = false;
      this.result = false;
      this.$resetReportState();
    }

    async buildReport() {
      Vue.prototype.$trace("LswConductometriaReport.buildReport");
      await this.$resetReportState();
      await this.$rebuildCallback();
      await this.$rebuildReport();
      return this.result;
    }

    async $resetReportState() {
      Vue.prototype.$trace("LswConductometriaReport.$resetReportState");
      this.result = false;
    }

    async $rebuildCallback() {
      Vue.prototype.$trace("LswConductometriaReport.$rebuildCallback");
      this.$reportBuilder = LswUtils.createAsyncFunction(this.$originalInput);
    }

    async $rebuildReport() {
      Vue.prototype.$trace("LswConductometriaReport.$rebuildReport");
      this.result = await this.$reportBuilder(this.$originalScope);
    }

  };

  return LswConductometriaReport;

});
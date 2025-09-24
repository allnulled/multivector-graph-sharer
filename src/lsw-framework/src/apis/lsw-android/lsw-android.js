(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswAndroid'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswAndroid'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const LswAndroid = class {

    static handleError(error) {
      Vue.prototype.$lsw.toasts.showError(error);
    }

    static async evalFile(filepath) {
      Vue.prototype.$trace("LswAndroid.evalFile");
      if(typeof cordova === "undefined") {
        throw new Error("Required cordova api on «LswAndroid.evalFile»");
      }
      const fileContents = await Vue.prototype.$lsw.fs.read_file(filepath);
      return await this.eval(fileContents);
    }

    static async eval(callbackOrCode) {
      Vue.prototype.$trace("LswAndroid.eval");
      if(typeof cordova === "undefined") {
        throw new Error("Required cordova api on «LswAndroid.eval»");
      }
      const fileContents = (typeof callbackOrCode === "function") ? `(${callbackOrCode.toString()})()` : callbackOrCode;
      try {
        await LswLazyLoads.loadBabel();
        const es6code = fileContents;
        const es5code = Babel.transform(es6code, {
          presets: []
        }).code;
        Vue.prototype.$lsw.toasts.send({
          title: "Evaluating android/rhino:",
          text: es5code,
        });
        cordova.plugins.Rhinobridge.evaluate(es5code);
        Vue.prototype.$lsw.toasts.send({
          title: "Android eval ok",
          text: "It terminated normally",
        });
      } catch (error) {
        this.handleError(error);
      }
    }

  }

  return LswAndroid;

});
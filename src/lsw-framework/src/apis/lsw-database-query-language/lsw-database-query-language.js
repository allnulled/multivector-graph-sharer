(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswDatabaseQueryLanguage'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswDatabaseQueryLanguage'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  const LswDatabaseQueryLanguage = class {

    static parser = BrowsieScript;

    static toJavaScript(browsieScriptCode) {
      try {
        const ast = this.parser.parse(browsieScriptCode);
        console.log(ast);
        let js = "";
        js += "";
        js = ast;
        console.log(js);
        return js;
      } catch (error) {
        console.log("[!] Error on «LswDatabaseQueryLanguage.toJavaScript» when parsing input");
        console.log(error);
        throw error;
      }
    }

  }
  
  return LswDatabaseQueryLanguage;

});
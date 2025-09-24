(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswClassRegister'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswClassRegister'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  /**
   * 
   * 
   * @$section: Lsw ClassRegister API » LswClassRegister class

   * @type: class
   * @extends: Object
   * @vendor: lsw
   * @namespace: LswClassRegister
   * @source code: La clase está definida así:
   * 
   */
  // @code.start: LswClassRegister class | @$section: Lsw ClassRegister API » LswClassRegister class
  class LswClassRegister {

    constructor() {
      this.$classes = {};
    }

    register(id, classDefinition, forceOverwrite = false) {
      $ensure({id},1).type("string");
      $ensure({classDefinition},1).type("function");
      if(!forceOverwrite) {
        $ensure({$classes:this.$classes},1).to.not.have.key(id);
      }
      this.$classes[id] = classDefinition;
    }

    unregister(id, silenceError = false) {
      if(!silenceError) {
        $ensure({$classes:this.$classes},1).to.have.key(id);
      }
      delete this.$classes[id];
    }

    instantiate(id, ...args) {
      $ensure({id},1).type("string");
      $ensure({$classes:this.$classes},1).to.have.key(id);
      const clazz = this.$classes[id];
      const objeto = new clazz(...args);
      return objeto;
    }

    async initialize(id, ...args) {
      $ensure({id},1).type("string");
      $ensure({$classes:this.$classes},1).to.have.key(id);
      const clazz = this.$classes[id];
      const objeto = new clazz(...args);
      if(typeof objeto.initialize === "function") {
        await objeto.initialize();
      }
      return objeto;
    }

  }
  // @code.end: LswClassRegister class

  window.$lswClassRegistry = new LswClassRegister();

  return LswClassRegister;
});
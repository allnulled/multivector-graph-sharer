(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswVue2'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswVue2'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  /**
   * 
   * 
   * @$section: Lsw Vue2 API » LswVue2 class
   * @type: class
   * @extends: Object
   * @vendor: lsw
   * @namespace: LswVue2
   * @source code: La clase está definida así:
   * 
   */
  // @code.start: LswVue2 class | @section: Lsw Vue2 API » LswVue2 class
  const LswVue2 = class {

    static getClosestParent(component, filterCallback) {
      $ensure(component).type("object");
      $ensure(filterCallback).type("function");
      let parentOf = component;
      do {
        parentOf = parentOf.$parent;
        const isValid = filterCallback(parentOf);
        if (isValid) {
          return parentOf;
        }
      } while (typeof parentOf !== "undefined");
      return undefined;
    }

    static extendComponent(baseComponent = {}) {
      const extendedComponent = Object.assign({}, baseComponent);
      extendedComponent.props = Object.assign({}, baseComponent.props || {});
      extendedComponent.methods = Object.assign({}, baseComponent.methods || {});
      extendedComponent.watch = Object.assign({}, baseComponent.watch || {});
      extendedComponent.computed = Object.assign({}, baseComponent.computed || {});
      return extendedComponent;
    }

  }
  // @code.end: LswVue2 class

  return LswVue2;

});
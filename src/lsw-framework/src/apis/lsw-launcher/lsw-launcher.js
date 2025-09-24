(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswLauncher'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswLauncher'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  // @code.start: LswLauncher class | @section: Lsw Launcher API » LswLauncher class

  class LswLauncher {

    static openDialog(template, title = "Diálogo del launcher", otros = {}) {
      return Vue.prototype.$lsw.dialogs.open({
        title,
        template: `<div class="pad_1">${template}</div>`,
        ...otros
      });
    }

    programs = {};

    register(id, name, callback) {
      $ensure({ id },1).type("string");
      $ensure({ name },1).type("string");
      $ensure({ callback },1).type("function");
      this.programs[id] = { id, name, callback };
    }

    unregister(id) {
      delete this.programs[id];
    }

    start(app, ...args) {
      const isKnown = app in this.programs;
      if(!isKnown) {
        return Vue.prototype.$lsw.toasts.showError(new Error(`The app «${app}» is not known by the launcher on «LswLauncher.start»`));
      }
      const appMetadata = this.programs[app];
      appMetadata.callback.call(this, appMetadata, ...args);
    }

  };

  LswLauncher.global = new LswLauncher();

  return LswLauncher;

  // @code.end: LswLauncher class

});
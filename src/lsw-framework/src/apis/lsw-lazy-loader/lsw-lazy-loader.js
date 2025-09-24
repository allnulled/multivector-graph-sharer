(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswLazyLoader'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswLazyLoader'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswLazyLoader class | @section: Lsw LazyLoader API » LswLazyLoader class

  const $defaultScope = {};

  const UnsolvedLazyLoadModule = class {

    static create(...args) {
      return new this(...args);
    }

  };

  const LswLazyLoader = class {

    static UnsolvedLazyLoadModule = UnsolvedLazyLoadModule;

    static global = new this();

    constructor() {
      this.$loads = {};
      this.$alias = {};
    }

    register(options = {}) {
      const url = options.url;
      this.$loads[url] = Object.assign({}, {
        alias: false,
        scope: $defaultScope,
        getter: options.getter || Vue.prototype.$noop,
        confirmer: options.confirmer || Vue.prototype.$noop,
        confirmation: true,
        once: false,
        onceDone: false,
      }, options);
      if (this.$loads[url].alias) {
        this.$alias[this.$loads[url].alias] = url;
      }
    }

    $solveAlias(urlOrAlias) {
      const hasAlias = urlOrAlias in this.$alias;
      if (hasAlias) {
        return this.$alias[urlOrAlias];
      }
      return urlOrAlias;
    }

    $softRegister(url, options = {}) {
      if (!this.hasLoaded(url)) {
        this.register(url, options);
      }
    }

    hasLoaded(url) {
      return url in this.$loads;
    }

    $loadLocally(url) {
      const options = this.$loads[url] || {};
      const _getter = options.getter || Vue.prototype.$noop;
      const _confirmer = options.confirmer || Vue.prototype.$noop;
      const _confirmation = options.confirmation || Vue.prototype.$noop;
      const _once = options.once || false;
      const _onceDone = options.onceDone || false;
      const currentGetterValue = (() => {
        try {
          return _getter();
        } catch (error) {
          return undefined;
        }
      })();
      Kick_by_getter: {
        const hasGetterOk = typeof currentGetterValue !== "undefined";
        if (hasGetterOk) {
          return currentGetterValue;
        }
      }
      Kick_by_confirmer: {
        const currentConfirmerValue = _confirmer();
        const hasConfirmerOk = currentConfirmerValue === true;
        if (hasConfirmerOk) {
          return _confirmation;
        }
      }
      Kick_by_once_flag: {
        if(_once) {
          if(_onceDone) {
            return;
          }
        }
      }
      this.$loads[url].onceDone = true;
      return this.constructor.UnsolvedLazyLoadModule.create(url);
    }

    loadScriptAsync(url) {
      const value = this.$loadLocally(url);
      if (!(value instanceof this.constructor.UnsolvedLazyLoadModule)) {
        return value;
      }
      this.$softRegister(url, {});
      const options = this.$loads[url];
      const _scope = options.scope || $defaultScope;
      return importer.scriptAsync(url, _scope);
    }

    loadScriptSrc(url) {
      const value = this.$loadLocally(url);
      if (!(value instanceof this.constructor.UnsolvedLazyLoadModule)) {
        return value;
      }
      this.$softRegister(url, {});
      const options = this.$loads[url];
      const _scope = options.scope || $defaultScope;
      return importer.scriptSrc(url, _scope);
    }

    loadScriptSrcModule(url) {
      const value = this.$loadLocally(url);
      if (!(value instanceof this.constructor.UnsolvedLazyLoadModule)) {
        return value;
      }
      this.$softRegister(url, {});
      const options = this.$loads[url];
      const _scope = options.scope || $defaultScope;
      return importer.scriptSrcModule(url, _scope);
    }

    loadLinkStylesheet(url) {
      const value = this.$loadLocally(url);
      if (!(value instanceof this.constructor.UnsolvedLazyLoadModule)) {
        return value;
      }
      this.$softRegister(url, {});
      const options = this.$loads[url];
      const _scope = options.scope || $defaultScope;
      return importer.linkStylesheet(url);
    }

    load(aliasOrUrl) {
      const url = this.$solveAlias(aliasOrUrl);
      const value = this.$loadLocally(url);
      if (!(value instanceof this.constructor.UnsolvedLazyLoadModule)) {
        return value;
      }
      this.$softRegister(url, {});
      const options = this.$loads[url];
      const _scope = options.scope || $defaultScope;
      const _type = options.type || "scriptSrc";
      if (!(_type in importer)) {
        throw new Error(`Required «type» from «${url}» options to be a known method for $importer on «LswLazyLoader.load»`);
      }
      return importer[_type](url, _scope);
    }

  };

  return LswLazyLoader;

  // @code.end: LswLazyLoader class

});
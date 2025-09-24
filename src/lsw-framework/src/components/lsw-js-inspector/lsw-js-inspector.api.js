(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswJsInspector'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswJsInspector'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  const LswJsInspector = class {

    static async initializeFully() {
      await LswLazyLoads.loadBeautifier();
    }

    static keysFrom(obj) {
      return Object.getOwnPropertyNames(obj);
    }

    static getDefaultOptions() {
      return {
        seen: [],
        level: 0,
        maxLevel: 1,
        maxKeys: 20,
      }
    };

    static $stringifyObject(obj, options, seen) {
      Vue.prototype.$trace("LswJsInspector.$stringifyObject");
      let js = "";
      js += "{";
      let allKeys = undefined;
      let exceedsKeys = undefined;
      Check_max_keys: {
        allKeys = Object.getOwnPropertyNames(obj);
        const maxKeys = options.maxKeys;
        exceedsKeys = allKeys.length > maxKeys;
      }
      let i = -1;
      for (let key in obj) {
        i++;
        if (i !== 0) {
          js += ",";
        }
        const it = obj[key];
        js += JSON.stringify(key);
        js += ":";
        if (exceedsKeys) {
          js += JSON.stringify("::" + typeof (it));
        } else {
          js += this.stringify(it, options, seen);
        }
      }
      js += "}";
      return js;
    }

    static $stringifyArray(arr, options, seen) {
      Vue.prototype.$trace("LswJsInspector.$stringifyArray");
      let js = "";
      js += "[";
      let allKeys = undefined;
      let exceedsKeys = undefined;
      Check_max_keys: {
        allKeys = Object.getOwnPropertyNames(arr);
        const maxKeys = options.maxKeys;
        exceedsKeys = allKeys.length > maxKeys;
      }
      for (let i = 0; i < arr.length; i++) {
        const it = arr[i];
        if (i !== 0) {
          js += ",";
        }
        if (exceedsKeys) {
          js += JSON.stringify("::" + typeof (it));
        } else {
          js += this.stringify(it, options, seen);
        }
      }
      js += "]";
      return js;
    }

    static cloneOptions(options, extender = {}) {
      Vue.prototype.$trace("LswJsInspector.cloneOptions");
      const options2 = Object.assign({}, options, extender);
      const options3 = JSON.parse(JSON.stringify(options2));
      return options3;
    }

    static stringify(cualquierCosa, optionsBrute = {}, seen = []) {
      Vue.prototype.$trace("LswJsInspector.stringify");
      const options = Object.assign({}, this.getDefaultOptions(), optionsBrute);
      const curType = typeof cualquierCosa;
      if (curType === "number") {
        return "" + cualquierCosa;
      }
      if (curType === "string") {
        return JSON.stringify(cualquierCosa);
      }
      if (curType === "boolean") {
        return cualquierCosa ? "true" : "false";
      }
      if (curType === "function") {
        return JSON.stringify("::Function::" + cualquierCosa.toString());
      }
      if (typeof cualquierCosa === "undefined") {
        return "undefined";
      }
      if (curType === "object") {
        if (cualquierCosa === null) {
          return "null";
        }
        if(options.maxLevel >= options.level) {
          return JSON.stringify("::TooDeep");
        }
        if (seen.indexOf(cualquierCosa) !== -1) {
          return JSON.stringify("::Cyclic");
        }
        seen.push(cualquierCosa);
        if (Array.isArray(cualquierCosa)) {
          const nextOptions = this.cloneOptions(options, {
            level: options.level + 1
          });
          return this.$stringifyArray(cualquierCosa, nextOptions, seen);
        } else {
          const nextOptions = this.cloneOptions(options, {
            level: options.level + 1
          });
          return this.$stringifyObject(cualquierCosa, nextOptions, seen);
        }
      }
    }

    static stringifyBeautify(cualquierCosa, options) {
      return JSON.stringify(JSON.parse(this.stringify(cualquierCosa, options)), null, 2);
    }

  };

  return LswJsInspector;

});
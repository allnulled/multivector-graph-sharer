(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['URLCommand'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['URLCommand'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  const isOnlyConsecutiveNumbers = function (queryParams) {
    const queryKeysSource = Object.keys(queryParams);
    const queryKeys = queryKeysSource.map(key => "" + key);
    const output = [];
    for (let index = 0; index < queryKeys.length; index++) {
      if (queryKeys.indexOf("" + index) === -1) {
        return false;
      }
      if (queryParams[index]) {
        output.push(queryParams[index]);
      } else {
        output.push(queryParams["" + index]);
      }
    }
    return output;
  };

  /**
   * 
   * 
   * @$section: Lsw Commander API » LswCommander class

   * @type: class
   * @extends: Object
   * @vendor: lsw
   * @namespace: LswCommander
   * @source code: La clase está definida así:
   * 
   */
  // @code.start: LswCommander class | @$section: Lsw Commander API » LswCommander class
  const LswCommander = class {

    static from(...args) {
      return new this(...args);
    }

    onRun(callback, args) {
      try {
        let output = undefined;
        if (typeof this.$beforeRun === "function") {
          this.$beforeRun(...args);
        }
        output = callback(...args);
        if (typeof this.$afterRun === "function") {
          this.$afterRun(...args);
        }
        return output;
      } catch (error) {
        if (typeof this.$onError === "function") {
          const output = this.$onError(error);
          if (typeof output !== "undefined") {
            return output;
          }
        }
        throw error;
      }
    }

    constructor(handlers) {
      this.$handlers = handlers;
      this.$beforeRun = undefined;
      this.$afterRun = undefined;
      this.$onError = undefined;
      this.command = (url, queryParamsExtender = {}) => {
        if (!url) throw new Error("URL is required");
        if (typeof url !== "string") throw new Error("URL must be a string");
        if (typeof this.$handlers !== "object" || this.$handlers === null) {
          throw new Error("Handlers must be a valid object");
        }
        const [path, queryString] = url.split("?");
        const queryParams = queryString ? Object.fromEntries(new URLSearchParams(queryString).entries()) : {};
        Object.assign(queryParams, queryParamsExtender);
        const pathParts = path.split("/").filter(Boolean);
        let currentHandler = this.$handlers;
        for (const part of pathParts) {
          if (currentHandler[part] === undefined) {
            throw new Error(`Handler for path "${path}" not found`);
          }
          currentHandler = currentHandler[part];
        }
        if (typeof currentHandler !== "function") {
          throw new Error(`Handler at path "${path}" is not a function`);
        }
        const isSpreadable = isOnlyConsecutiveNumbers(queryParams);
        if (isSpreadable && isSpreadable.length) {
          return this.onRun(currentHandler, isSpreadable);
        } else if (queryParams.argumentsOrder) {
          const args = [];
          const argKeys = queryParams.argumentsOrder.split(",").map(arg => arg.trim());
          for (let index = 0; index < argKeys.length; index++) {
            const argKey = argKeys[index];
            const argValue = queryParams[argKey] || null;
            args.push(argValue);
          }
          return this.onRun(currentHandler, args);
        } else {
          return this.onRun(currentHandler, [queryParams]);
        }
      };
    }
    get run() {
      return this.command;
    }
    beforeRun(callback) {
      if (typeof callback !== "function") {
        throw new Error("Required parameter «callback» to be a function on «beforeRun»");
      }
      this.$beforeRun = callback;
    }
    afterRun(callback) {
      if (typeof callback !== "function") {
        throw new Error("Required parameter «callback» to be a function on «afterRun»");
      }
      this.$afterRun = callback;
    }
    onError(callback) {
      if (typeof callback !== "function") {
        throw new Error("Required parameter «callback» to be a function on «onError»");
      }
      this.$onError = callback;
    }
  };
  // @code.end: LswCommander class
  
  return LswCommander;
});


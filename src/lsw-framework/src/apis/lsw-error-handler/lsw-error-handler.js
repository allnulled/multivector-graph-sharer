(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswErrorHandler'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswErrorHandler'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  const GroupedErrorHandler = class extends Array {

    static unifyErrorsIntoString(errorsList) {
      return "- " + errorsList.map(e => e.message).join("\n - ");
    }

    $selfActionIfNeeded(action, errorName = "GroupedError") {
      if (!this.length) {
        return false;
      }
      const errorMessage = this.constructor.unifyErrorsIntoString(this);
      const error = new Error(errorMessage);
      error.name = errorName;
      if (action === "throw") {
        throw error;
      } else if (action === "log") {
        console.log(action);
      }
      return action;
    }

    selfThrowIfNeeded(...args) {
      return this.$selfActionIfNeeded("throw", ...args);
    }

    selfLogIfNeeded(...args) {
      return this.$selfActionIfNeeded("log", ...args);
    }

  }

  const LswErrorHandler = class {

    static createGroup() {
      return new GroupedErrorHandler();
    }

  };

  return LswErrorHandler;

});
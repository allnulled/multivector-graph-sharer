(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswTestRegistry'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswTestRegistry'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  // @code.start: LswTestRegistry API | @$section: LswTestRegistry API » LswTestRegistry classes and functions
  const LswTestRegistry = class {

    static create(...args) {
      return new this(...args);
    }

    constructor() {
      this.$tests = {};
    }

    define(id, callback) {
      this.mustMiss(id);
      this.$tests[id] = callback;
    }

    mustHave(id) {
      if(typeof id !== "string") {
        throw new Error(`Required parameter 1 «id=${id}» to be string in «$tests» on «LswTestRegistry.mustHave»`);
      }
      if(!(id in this.$tests)) {
        throw new Error(`Required parameter 1 «id=${id}» to be an identifier in «$tests» on «LswTestRegistry.mustHave»`);
      }
    }

    mustMiss(id) {
      if(typeof id !== "string") {
        throw new Error(`Required parameter 1 «id=${id}» to be string in «$tests» on «LswTestRegistry.mustMiss»`);
      }
      if(id in this.$tests) {
        throw new Error(`Required parameter 1 «id=${id}» to NOT be an identifier in «$tests» on «LswTestRegistry.mustMiss»`);
      }
    }

    pick(id) {
      this.mustHave(id);
      return this.$tests[id];
    }

    run(id) {
      this.mustHave(id);
      return this.$tests[id].call();
    }

    all() {
      const allKeys = Object.keys(this.$tests);
      const output = [];
      for(let index=0; index<allKeys.length; index++) {
        const key = allKeys[index];
        const testCallback = this.$tests[key];
        testCallback.$lswTestId = key;
        output.push(testCallback);
      }
      return Object.values(this.$tests);
    }

    collect(id, testCallback) {
      this.mustMiss(id);
      const testSource = testCallback.toString();
      const testFunction = new Function(`return LswTester.collection(${JSON.stringify(id)}, ${testSource});`)
      this.$tests[id] = testFunction;
      return {
        [id]: testFunction.toString().length + " chars",
      };
    }

  };

  LswTestRegistry.defaultInstance = LswTestRegistry.create();

  return LswTestRegistry.defaultInstance;
  // @code.end: LswTestRegistry API

});
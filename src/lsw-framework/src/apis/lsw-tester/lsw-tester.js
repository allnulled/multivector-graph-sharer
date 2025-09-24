(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswTester'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswTester'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswTester API | @$section: LswTester API » LswTester classes and functions
  const LswAssertion = class {

    static create(...args) {
      return new this(...args);
    }

    $trace(method) {
      this.$tester.$trace(method);
    }

    constructor(tester, submodule, result = undefined, message = undefined) {
      this.$tester = tester;
      this.$module = submodule;
      this.$moduleId = submodule.id;
      this.$result = result;
      this.$message = message;
    }

    as(message = undefined) {
      this.$trace("LswAssertion.as");
      this.$message = message;
      return this;
    }

    that(result = undefined) {
      this.$trace("LswAssertion.that");
      this.$result = result;
      if(this.$result === true) {
        this.$tester.hookedBy("onSuccessAssertion", { tester: this.$tester, value: this.$module, assertionText: this.$message, assertionResult: this.$result });
      } else {
        this.$tester.hookedBy("onErrorAssertion", { tester: this.$tester, value: this.$module, assertionText: this.$message, assertionResult: this.$result });
      }
    }

  };

  const createAssert = (tester, submodule) => {
    return LswAssertion.create(tester, submodule);
  };

  const LswTester_BasicLayer = class {

    async innerLoad() {
      this.$trace("LswTester.innerLoad");
      return this.innerLoadTest(this.$composition, [], null);
    }

    innerCheckIsNotTyped(val, path) {
      this.$trace("LswTester.innerCheckIsNotTyped");
      if (typeof val.fromType === "string") {
        throw new Error(`Required test on index «${path.join(".")}» to not have property «fromType» resolved on «LswTester.innerCheckIsNotTyped»`);
      }
    }

    innerTypeAsUrl(val, path) {
      this.$trace("LswTester.innerTypeAsUrl");
      this.innerCheckIsNotTyped(val, path);
      val.fromType = "url";
    }

    innerTypeAsFile(val, path) {
      this.$trace("LswTester.innerTypeAsFile");
      this.innerCheckIsNotTyped(val, path);
      val.fromType = "file";
    }

    innerTypeAsId(val, path) {
      this.$trace("LswTester.innerTypeAsId");
      this.innerCheckIsNotTyped(val, path);
      val.fromType = "id";
    }

    innerTypeAsCallback(val, path) {
      this.$trace("LswTester.innerTypeAsCallback");
      this.innerCheckIsNotTyped(val, path);
      val.fromType = "callback";
    }

    innerTypeAsCollection(val, path) {
      this.$trace("LswTester.innerTypeAsCollection");
      this.innerCheckIsNotTyped(val, path);
      val.fromType = "collection";
    }

    addDefinition(test, pathToTest = false) {
      this.$trace("LswTester.addDefinition");
      if (pathToTest) {
        test.path = pathToTest;
      }
      if (test.id in this.$definitions) {
        throw new Error(`Required property «id» in test on index «${pathToTest.join(".")}» to be a non-duplicated id for «this.$definitions» on «LswTester.addDefinition»`);
      }
      this.$definitions[test.id] = test.path;
    }

    innerLoadTest(val, path, parent = null, parentIndex = []) {
      this.$trace("LswTester.innerLoadTest");
      this.addDefinition(val, path);
      if (val.fromUrl) {
        this.innerTypeAsUrl(val, path);
      }
      if (val.fromFile) {
        this.innerTypeAsFile(val, path);
      }
      if (val.fromId) {
        this.innerTypeAsId(val, path);
      }
      if (val.fromCallback) {
        this.innerTypeAsCallback(val, path);
      }
      if (val.fromCollection) {
        this.innerTypeAsCollection(val, path);
        for (let index = 0; index < val.fromCollection.length; index++) {
          const subval = val.fromCollection[index];
          this.innerLoadTest(subval, path.concat(["fromCollection", index]), val, path);
        }
      }
    }

    async innerRun() {
      this.$trace("LswTester.innerRun");
      this.hookedBy("onStartTester", []);
      let results = new Error(`Tester «${this.$composition.id}» was not started yet`);
      try {
        results = await this.innerRunTests(this.$composition, [], null, [], []);
        this.hookedBy("onSuccessTester", [results]);
      } catch (error) {
        this.hookedBy("onErrorTester", [error]);
        results = results.concat([error]);
      } finally {
        this.hookedBy("onEndTester", [results]);
        return results;
      }
    }

    innerHandleCallback(val, path, parent, parentIndex, accumulated) {
      this.$trace("LswTester.innerHandleCallback");
      return val.fromCallback.call(this, {
        $tester: this,
        $test: val,
        $testPath: path,
        $testParent: parent,
        $testParentPath: parentIndex,
        $accumulated: accumulated,
        assert: createAssert(this, val),
      });
    }

    async innerHandleUrl(val, path, parent, parentIndex, accumulated) {
      this.$trace("LswTester.innerHandleUrl");
      const testSource = await importer.text(val.fromUrl);
      const testParameters = {
        $tester: this,
        $test: val,
        $testPath: path,
        $testParent: parent,
        $testParentPath: parentIndex,
        $accumulated: accumulated,
        assert: createAssert(this, val),
      };
      const testCallback = LswUtils.createAsyncFunction(testSource, Object.keys(testParameters));
      return await testCallback.call(this, ...Object.values(testParameters));
    }

    innerHandleFile(val, path, parent, parentIndex, accumulated) {
      this.$trace("LswTester.innerHandleFile");
      return Vue.prototype.$lsw.fs.evaluateAsJavascriptFile(val.fromFile);
    }

    async innerRunTests(val, path, parent = null, parentIndex = [], accumulated = []) {
      this.$trace("LswTester.innerRunTests");
      this.hookedBy("onStartModule", { tester:this, value:val, path, parent, parentIndex, accumulated });
      let reported = undefined;
      RunningTest: {
        try {
          Manage_bad_inputs: {
            if (typeof val !== "object") {
              throw new Error(`[ERROR: LswTester complain x004006] Required type of test «${typeof val}» on index «${path.join(".")}» to be an object in order to process module as test by «LswTester» instance on «LswTester.innerRunTests»`);
            }
            if (val === null) {
              break RunningTest;
            }
            if (!val.id) {
              throw new Error(`[ERROR: LswTester complain x004001] Required test «${typeof val}» on index «${path.join(".")}» to have property «id» in order to process module as test by «LswTester» instance on «LswTester.innerRunTests»`);
            }
            if (typeof val.id !== "string") {
              throw new Error(`[ERROR: LswTester complain x004002] Required test «${typeof val}» on index «${path.join(".")}» to have a string on property «id» in order to process module as test by «LswTester» instance on «LswTester.innerRunTests»`);
            }
            if (typeof val.fromType !== "string") {
              throw new Error(`[ERROR: LswTester complain x004003] Required test «${typeof val}» on index «${path.join(".")}» to have a string on property «fromType» in order to process module as test by «LswTester» instance. This indicates that the previous step «LswTester.innerLoad» DID NOT (while it SHOULD, or SHOULD HAVE arised an error otherwise) mark this test module as a known type on «LswTester.innerRunTests»`);
            }
            const validTypes = ["url", "file", "collection", "callback"];
            if (validTypes.indexOf(val.fromType) === -1) {
              throw new Error(`[ERROR: LswTester complain x004008] Required test «${typeof val}» on index «${path.join(".")}» to have property «fromType» with a valid type instead of «${val.fromType}» in order to process module as test by «LswTester» instance. This indicates that the previous step «LswTester.innerLoad» DID NOT (while it SHOULD, or SHOULD HAVE arised an error otherwise) mark this test module as a known type on «LswTester.innerRunTests»`);
            }
          }
          if (val.fromType === "url") {
            reported = await this.innerHandleUrl(val, path, parent, parentIndex, accumulated);
          } else if (val.fromType === "callback") {
            reported = await this.innerHandleCallback(val, path, parent, parentIndex, accumulated);
          } else if (val.fromType === "file") {
            reported = await this.innerHandleFile(val, path, parent, parentIndex, accumulated);
          } else if (val.fromType === "collection") {
            const collection = val.fromCollection;
            reported = [];
            for (let index = 0; index < collection.length; index++) {
              const item = collection[index];
              try {
                const result = await this.innerRunTests(item, path.concat(["fromCollection", index]), val, path, accumulated);
                reported.push(result);
              } catch (error) {
                if (this.$options.continueOnErrors === false) {
                  throw error;
                }
              }
            }
          }
          this.hookedBy("onSuccessModule", { tester:this, value:val, path, parent, parentIndex, accumulated });
        } catch (error) {
          this.$trace(`Error on test artifact «${val.id}» located at «${path.join(".")}» on LswTester instance`);
          if (this.$options.printErrors === true) {
            console.error(error);
          }
          this.hookedBy("onErrorModule", { tester:this, value:val, error, path, parent, parentIndex, accumulated });
          if (this.$options.continueOnErrors === false) {
            throw error;
          } else {
            reported = error;
          }
        }
      }
      this.hookedBy("onEndModule", { tester:this, value:val, path, parent, parentIndex, accumulated, reported });
      if (path.length === 0) {
        this.$result = reported
      }
      return reported;
    }

  }

  const LswTester = class extends LswTester_BasicLayer {

    static Assertion = LswAssertion;

    static createAssertion(...args) {
      return new this.Assertion(...args);
    }

    static create(...args) {
      return new this(...args);
    }

    $trace(method) {
      if (Vue?.prototype.$lsw?.logger?.$options.active) {
        console.log(`[trace][lsw-tester][${method}]`);
      }
    }

    static defaultOptions = {
      continueOnErrors: false,
      printErrors: true,
      onAnything: false,
      onStartTester: false,
      onEndTester: false,
      onSuccessTester: false,
      onErrorTester: false,
      onStartModule: false,
      onFinishModule: false,
      onSuccessModule: false,
      onErrorModule: false,
      onSuccessAssertion: false,
      onErrorAssertion: false,
    };

    static noop() { }

    constructor() {
      super();
      this.reset();
    }

    reset() {
      this.$isLoaded = false;
      this.$isExecuted = false;
      this.$definitions = {};
      this.$options = Object.assign({}, this.constructor.defaultOptions);
      this.$composition = undefined;
    }

    hookedBy(callbackId, uniqueParameter = {}) {
      this.$trace("LswTester.hookedBy");
      const isAnyEventCallback = typeof this.$options.onAnything === "function";
      if (isAnyEventCallback) {
        this.$options.onAnything.call(this, { eventType: callbackId }, uniqueParameter);
      }
      const isCallback = typeof this.$options[callbackId] === "function";
      if (!isCallback) {
        return false;
      }
      return this.$options[callbackId].call(this, uniqueParameter);
    }

    validateComposition(composition) {
      this.$trace("LswTester.validateComposition");
      $ensure(composition).type("object");
    }

    define(composition = {}) {
      this.$trace("LswTester.define");
      if (typeof this.$composition !== "undefined") {
        throw new Error("Required property «$composition» to not be defined before on «LswTester.define»");
      }
      this.validateComposition(composition);
      this.$composition = composition;
      return this;
    }

    options(options) {
      this.$trace("LswTester.options");
      this.$options = Object.assign({}, this.constructor.defaultOptions, options);
      return this;
    }

    onAnything(callback) {
      this.$trace("LswTester.onAnything");
      this.$options.onAnything = callback;
      return this;
    }

    onStartTester(callback) {
      this.$trace("LswTester.onStartTester");
      this.$options.onStartTester = callback;
      return this;
    }

    onEndTester(callback) {
      this.$trace("LswTester.onEndTester");
      this.$options.onEndTester = callback;
      return this;
    }

    onSuccessTester(callback) {
      this.$trace("LswTester.onSuccessTester");
      this.$options.onSuccessTester = callback;
      return this;
    }

    onErrorTester(callback) {
      this.$trace("LswTester.onErrorTester");
      this.$options.onErrorTester = callback;
      return this;
    }

    onStartModule(callback) {
      this.$trace("LswTester.onStartModule");
      this.$options.onStartModule = callback;
      return this;
    }

    onFinishModule(callback) {
      this.$trace("LswTester.onFinishModule");
      this.$options.onFinishModule = callback;
      return this;
    }

    onSuccessModule(callback) {
      this.$trace("LswTester.onSuccessModule");
      this.$options.onSuccessModule = callback;
      return this;
    }

    onErrorModule(callback) {
      this.$trace("LswTester.onErrorModule");
      this.$options.onErrorModule = callback;
      return this;
    }

    onSuccessAssertion(callback) {
      this.$trace("LswTester.onSuccessAssertion");
      this.$options.onSuccessAssertion = callback;
      return this;
    }

    onErrorAssertion(callback) {
      this.$trace("LswTester.onErrorAssertion");
      this.$options.onErrorAssertion = callback;
      return this;
    }

    async load() {
      this.$trace("LswTester.load");
      try {
        await this.innerLoad();
        this.$isLoaded = true;
        return this;
      } catch (error) {
        console.error("[!] Failed «LswTester» on «load» phase with:", error);
        throw error;
      }
    }

    async run(skipLoad = false) {
      this.$trace("LswTester.run");
      try {
        if(!skipLoad) {
          await this.load();
        }
        await this.innerRun();
        this.$isExecuted = true;
      } catch (error) {
        console.error("[!] Failed «LswTester» on «run» phase with:", error);
        throw error;
      } finally {
        return this;
      }
    }

    getStatus() {
      this.$trace("LswTester.getStatus");
      return this.$composition;
    }

  };

  LswTester.global = LswTester.create();
  // @code.end: LswTester API

  return LswTester;

});
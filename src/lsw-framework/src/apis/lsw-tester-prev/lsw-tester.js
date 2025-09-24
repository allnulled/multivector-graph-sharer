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
  const TestSettings = class {
    static AVAILABLE_MODES = ["normally", "never", "always", "only"];
    constructor(testObject) {
      this.$test = testObject;
    }
    timeout(value = undefined) {
      if(typeof value !== "number") {
        throw new Error(`Required parameter 1 «value=${typeof value}» to be number on «TestSettings.mode»`)
      }
      this.$test.timeoutLimit = value;
      return this;
    }
    mode(mode) {
      if(this.constructor.AVAILABLE_MODES.indexOf(mode) === -1) {
        throw new Error(`Required parameter 1 «mode=${mode}» to be one of: «${this.constructor.AVAILABLE_MODES.join("|")}» on «TestSettings.mode»`)
      }
      this.$test.mode = mode;
      return this;
    }
    onError(onErrorCallback) {
      if(typeof onErrorCallback !== "function") {
        throw new Error(`Required parameter 1 «onErrorCallback=${typeof onErrorCallback}» to be string on «TestSettings.onError»`)
      }
      this.$test.errorHandler = onErrorCallback;
      return this;
    }
    onSuccess(onSuccessCallback) {
      if(typeof onSuccessCallback !== "function") {
        throw new Error(`Required parameter 1 «onSuccessCallback=${typeof onSuccessCallback}» to be string on «TestSettings.onError»`)
      }
      this.$test.successHandler = onSuccessCallback;
      return this;
    }
  };

  const LswTester = class {

    static run(...args) {
      return this.create(...args).run();
    }

    static create(...args) {
      return new this(...args);
    }

    static STATES = {
      DEFINED: "defined",
      STARTED: "started",
      PASSED: "passed",
      FAILED: "failed",
    }

    static formatDate(dateObject = new Date()) {
      const anio = ("" + (dateObject.getFullYear() ?? 0)).padStart(4, '0');
      const mes = ("" + ((dateObject.getMonth() ?? 0) + 1)).padStart(2, '0');
      const dia = ("" + (dateObject.getDate() ?? 0)).padStart(2, '0');
      const hora = ("" + (dateObject.getHours() ?? 0)).padStart(2, '0');
      const minuto = ("" + (dateObject.getMinutes() ?? 0)).padStart(2, '0');
      const segundo = ("" + (dateObject.getSeconds() ?? 0)).padStart(2, '0');
      const milisegundo = ("" + (dateObject.getMilliseconds() ?? 0)).padStart(3, '0');
      const laHora = `${hora}:${minuto}:${segundo}.${milisegundo}`;
      return `${anio}/${mes}/${dia} ${laHora}`;
    }

    static getTimeDifferenceBetweenDates(dateStr1, dateStr2) {
      const date1 = new Date(dateStr1);
      const date2 = new Date(dateStr2);
      return date2 - date1;
    }

    static getDefaultOptions(overrider = {}) {
      return Object.assign({}, {
        trace: (Vue?.prototype?.$lsw?.logger?.$options?.active ),
        successHandler: false,
        errorHandler: false,
        failureHandler: false,
        finishHandler: false,
      }, overrider);
    };

    constructor(id, callback, options = {}) {
      if(typeof id !== "string") throw new Error("Required argument 1 to be string on «LswTester.constructor»");
      if(typeof callback !== "function") throw new Error("Required argument 2 to be function on «LswTester.constructor»");
      this.$options = this.constructor.getDefaultOptions(options);
      this.$id = id;
      this.$callback = callback;
      this.$queue = [];
      this.$state = {
        testCollectionId: this.$id,
        loaded: false,
        createdAt: this.constructor.formatDate(),
        startedAt: false,
        finishedAt: false,
        loadedAt: false,
        timeoutLimit: 4000,
        tests: {
          ids: [],
          all: [],
        },
      };
      Validate_parameters: {
        if(typeof this.$id !== "string") throw new Error(`Required parameter 1 «id=${typeof this.$id}» to be string on «LswTester.constructor»`);
        if(typeof this.$callback !== "function") throw new Error(`Required parameter 2 «callback=${typeof this.$callback}» to be function on «LswTester.constructor»`);
        if(typeof this.$options !== "object") throw new Error(`Required parameter 3 «options=${typeof this.$options}» to be object on «LswTester.constructor»`);
        if(!Array.isArray(this.$queue)) throw new Error(`Required property «$queue=${typeof this.$queue}» to be object on «LswTester.constructor»`);
        if(typeof this.$state !== "object") throw new Error(`Required property «$state=${typeof this.$state}» to be object on «LswTester.constructor»`);
      }
    }

    $trace(method) {
      if(this.$options.trace) {
        console.log(`[trace][lsw-tester] ${method}`);
      }
    }

    $createTestObject(id, action, attachedMode = "normally") {
      this.$trace("$createTestObject");
      return {
        id: id,
        // Property «currently» can be: "started", "passed", "failed" or "defined".
        currently: this.constructor.STATES.DEFINED,
        took: undefined,
        action: action,
        mode: attachedMode,
        successHandler: undefined,
        errorHandler: undefined,
        timeoutLimit: undefined,
      };
    }

    $createItFunction() {
      this.$trace("$createItFunction");
      let it2 = undefined;
      // Cuidaico con esta variable porque si llamas al mismo «it» 2 veces, puede jugártela.
      let testObject = undefined;
      const it = function(id, action, attachedMode = "normally") {
        Ensure_id_uniqueness: {
          if(this.$state.tests.ids.indexOf(id) !== -1) {
            console.log(this.$state.tests.ids);
            throw new Error(`Required parameter 1 «id=${id}» to not be a repeated test identifier on «LswTester.it»`);
          }
        }
        Append_test_object: {
          testObject = this.$createTestObject(id, action, attachedMode);
          this.$state.tests.ids.push(id);
          this.$state.tests.all.push(testObject);
        }
        return it2;
      };
      it2 = it.bind(this);
      it2.always = (id, action) => it2(id, action, "always");
      it2.normally = (id, action) => it2(id, action, "normally");
      it2.only = (id, action) => it2(id, action, "only");
      it2.never = (id, action) => it2(id, action, "never");
      it2.timeout = this.timeout.bind(this);
      it2.onSuccess = this.onSuccess.bind(this);
      it2.onError = this.onError.bind(this);
      it2.onFailure = this.onFailure.bind(this);
      return it2;
    }

    $handleLoadError(error) {
      this.$trace("$handleLoadError");
      console.error("LswTester failed on «load» step:", error);
      throw error;
    }

    $handleRunError(error) {
      this.$trace("$handleRunError");
      console.error("LswTester arised error on «run» step:", error);
      throw error;
    }

    $handleTestError(error, lastStartedTest) {
      this.$trace("$handleTestError");
      By_tester_first: {
        if(typeof this.$options.errorHandler === "function") {
          const handlerFeedback = this.$options.errorHandler(error, lastStartedTest);
          if(typeof handlerFeedback !== "undefined") {
            return handlerFeedback;
          }
        }
      }
      By_test_second: {
        if(typeof lastStartedTest.errorHandler === "function") {
          const testHandlerFeedback = lastStartedTest.errorHandler(error, lastStartedTest);
          if(typeof testHandlerFeedback !== "undefined") {
            return testHandlerFeedback;
          }
        } else {
          console.error("LswTester arised error on «test» step:", error);
          throw error;
        }
      }
    }

    $handleTestSuccess(lastStartedTest) {
      this.$trace("$handleTestSuccess");
      By_tester_first: {
        if(typeof this.$options.successHandler === "function") {
          const handlerFeedback = this.$options.successHandler(lastStartedTest);
          if(typeof handlerFeedback !== "undefined") {
            return handlerFeedback;
          }
        }
      }
      By_test_second: {
        if(typeof lastStartedTest.successHandler === "function") {
          const testHandlerFeedback = lastStartedTest.successHandler(lastStartedTest);
          if(typeof testHandlerFeedback !== "undefined") {
            return testHandlerFeedback;
          }
        } else {
          // @OK.
        }
      }
      if(typeof lastStartedTest.successHandler === "function") {
        return lastStartedTest.successHandler(lastStartedTest);
      } else {
        // @OK.
      }
    }

    $handleTestTimeout(indexTest) {
      const testObject = this.$state.tests.all[indexTest];
      const isStarted = testObject.currently === this.constructor.STATES.STARTED;
      if(isStarted) {
        testObject.currently = this.constructor.STATES.FAILED;
        testObject.failureReason = "timed out";
      }
    }

    timeout(limit) {
      this.$trace("timeout");
      this.$state.timeoutLimit = limit;
    }

    onSuccess(successHandler) {
      this.$trace("onSuccess");
      this.$options.successHandler = successHandler;
    }

    onError(errorHandler) {
      this.$trace("onError");
      this.$options.errorHandler = errorHandler;
    }

    onFailure(failureHandler) {
      this.$trace("onFailure");
      this.$options.failureHandler = failureHandler;
    }

    async load(ignoreDuplication = false) {
      this.$trace("load");
      try {
        Validate_state_before_reloading_by_error: {
          const wasLoadedBefore = typeof this.$state.loadedAt === "string";
          const allowsDuplication = !ignoreDuplication;
          if(wasLoadedBefore && !allowsDuplication) {
            throw new Error("Cannot call «LswTester.load» more than once");
          }
        }
        this.$state.loadedAt = this.constructor.formatDate();
        const it = this.$createItFunction();
        await this.$callback(it);
        this.$state.loaded = true;
      } catch (error) {
        this.$handleLoadError(error);
      }
    }

    async run() {
      this.$trace("run");
      try {
        await this.load();
        const testList = this.$state.tests.all;
        const wasActivatedOnlyMode = this.$state.tests.all.reduce((out, testObject) => {
          out = out || (testObject.mode === 'only');
          return out;
        }, false);
        let lastStartedTest = undefined;
        this.$state.startedAt = this.constructor.formatDate();
        Executing_tests:
        for(let indexTest=0; indexTest<testList.length; indexTest++) {
          try {
            const testObject = testList[indexTest];
            lastStartedTest = testObject;
            const {
              id,
              mode,
              action,
              currently,
            } = testObject;
            let testTimeoutId = undefined;
            Ignore_by_mode: {
              if(mode === "never") {
                continue Executing_tests;
              }
              if(wasActivatedOnlyMode) {
                if(mode === "normally") {
                  continue Executing_tests;
                }
              }
            }
            Throw_on_state_conflict: {
              if(currently !== this.constructor.STATES.DEFINED) {
                throw new Error(`Cannot run test «${id}» because its state is «${currently}» on «LswTester.run»`);
              }
            }
            Change_state_to_started: {
              this.$state.tests.all[indexTest].currently = this.constructor.STATES.STARTED;
              this.$state.tests.all[indexTest].startedAt = this.constructor.formatDate();
            }
            let testPromise = undefined;
            Execute_test_and_reserve_promise: {
              const testSettings = new TestSettings(testObject);
              testPromise = action(testSettings);
            }
            Start_timeout_callback_to_fail_test: {
              // Priorizamos el timeout del test al del tester:
              const timeoutLimit = testObject.timeoutLimit || this.$state.timeoutLimit;
              if((typeof timeoutLimit !== "number") || (timeoutLimit < 0)) {
                break Start_timeout_callback_to_fail_test;
              }
              const timeoutHandler = () => {
                this.$handleTestTimeout(indexTest);
              };
              testTimeoutId = setTimeout(timeoutHandler.bind(this), timeoutLimit);
            }
            Wait_for_test: {
              await testPromise;
            }
            Check_state_before_confirm_test_is_passed: {
              clearTimeout(testTimeoutId);
              const currentState = this.$state.tests.all[indexTest].currently;
              const isStarted = currentState === this.constructor.STATES.STARTED;
              if(!isStarted) {
                throw new Error(`Test «${id}» was already considered «${currentState}» and cannot promote it to «passed» on «LswTester.run»`);
              }
            }
            Change_state_to_passed: {
              this.$state.tests.all[indexTest].finishedAt = this.constructor.formatDate();
              this.$state.tests.all[indexTest].currently = this.constructor.STATES.PASSED;
              this.$state.tests.all[indexTest].took = this.constructor.getTimeDifferenceBetweenDates(this.$state.tests.all[indexTest].startedAt, this.$state.tests.all[indexTest].finishedAt);
            }
            Trigger_success_handler: {
              await this.$handleTestSuccess(lastStartedTest);
            }
          } catch (error) {
            let errorFeedback = undefined;
            Change_state_to_failed: {
              this.$state.tests.all[indexTest].finishedAt = this.constructor.formatDate();
              this.$state.tests.all[indexTest].currently = this.constructor.STATES.FAILED;
              this.$state.tests.all[indexTest].took = this.constructor.getTimeDifferenceBetweenDates(this.$state.tests.all[indexTest].startedAt, this.$state.tests.all[indexTest].finishedAt);
              this.$state.tests.all[indexTest].failureReason = error instanceof Error ? `${error.name}: ${error.message}` : error;
              console.log(error);
            }
            Trigger_error_handler: {
              errorFeedback = await this.$handleTestError(error, lastStartedTest);
            }
            Interrupt_tests_if_handler_returns_0: {
              if(errorFeedback === false) {
                break Executing_tests;
              }
            }
          }
        }
      } catch (error) {
        this.$handleRunError(error);
      } finally {
        this.$state.finishedAt = this.constructor.formatDate();
        if(typeof this.$options.finishHandler === "function") {
          this.$options.finishHandler(this.getReport(), this);
        }
        return this;
      }
    }

    getReport() {
      this.$trace("getReport");
      let testResult = "passed";
      for(let index=0; index<this.$state.tests.all.length; index++) {
        const testObject = this.$state.tests.all[index];
        const isOk = ["passed", "defined"].indexOf(testObject.currently) !== -1;
        if(!isOk) {
          testResult = testObject.currently;
        }
      }
      const tookMilliseconds = this.constructor.getTimeDifferenceBetweenDates(this.$state.startedAt, this.$state.finishedAt);
      return {
        result: testResult,
        took: tookMilliseconds,
        ...this.$state,
      };
    }

    getReportAsJson(compressed = false) {
      this.$trace("getReportAsJson");
      const report = this.getReport();
      if(!compressed) {
        return JSON.stringify(report, null, 2);
      } else {
        return JSON.stringify(report);
      }
    }

    static collection = this.run;

  };
  // @code.end: LswTester API

  return LswTester;

});
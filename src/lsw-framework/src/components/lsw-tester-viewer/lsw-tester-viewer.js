// @code.start: LswTesterViewer API | @$section: Vue.js (v2) Components » Lsw Unit Test Page » LswTesterViewer component
const LswTesterViewerUtils = {};
LswTesterViewerUtils.getEventSourceId = function(eventData) {
  return eventData?.value?.id || "tester";
};
LswTesterViewerUtils.initModule = function(component, id) {
  if(!(id in component.states)) {
    component.states[id] = "not started";
  }
};
LswTesterViewerUtils.registerEvent = function(component, eventType, id, eventData) {
  LswTesterViewerUtils.initModule(component, id);
  Notify_new_state_to_tester: {
    if(eventType === "onStartModule") {
      component.states[id] = "started";
    } else if(eventType === "onSuccessModule") {
      component.states[id] = "passed";
      Notify_to_submodule: {
        const selector = `[data-test-module=${JSON.stringify(id)}]`;
        const moduleComponent = LswDom.findVue(selector, false, component.$refs.esquema_de_tests);
        if(!moduleComponent) {
          break Notify_new_state_to_tester;
        }
        moduleComponent.changeState("passed");
      }
    } else if(eventType === "onErrorModule") {
      component.states[id] = "failed";
      Notify_to_submodule: {
        const selector = `[data-test-module=${JSON.stringify(id)}]`;
        const moduleComponent = LswDom.findVue(selector, false, component.$refs.esquema_de_tests);
        if(!moduleComponent) {
          break Notify_new_state_to_tester;
        }
        moduleComponent.changeState("failed");
      }
    }
  }
  Append_assertion: {
    if((eventType === "onSuccessAssertion") || (eventType === "onErrorAssertion")) {
      const selector = `[data-test-module=${JSON.stringify(id)}]`;
      const moduleComponent = LswDom.findVue(selector, false, component.$refs.esquema_de_tests);
      if(!moduleComponent) {
        break Append_assertion;
      }
      moduleComponent.addAssertion({
        text: eventData.assertionText,
        result: eventData.assertionResult,
      });
    }
  }
};
Vue.component("LswTesterViewer", {
  template: $template,
  props: {
    tester: {
      type: Object,
      required: true,
    },
    testsPage: {
      type: Object,
      default: () => false
    }
  },
  data() {
    return this.getInitialState();
  },
  methods: {
    getInitialState() {
      this.$trace("lsw-tests-page.methods.getInitialState");
      return {
        isRun: false,
        isStarted: false,
        isLoaded: false,
        isShowingSubmodules: false,
        isShowingErrors: false,
        isShowingEventsConsole: false,
        isSuccessfullyCompleted: false,
        currentErrors: [],
        loadingError: false,
        runningError: false,
        temporizer: LswTemporizer.create(),
        states: {},
      };
    },
    goToCoverage() {
      this.$trace("lsw-tests-page.methods.goToCoverage");
      if(this.testsPage) {
        this.testsPage.selectSection("coverage");
      }
    },
    addEvent(event, eventData) {
      this.$trace("lsw-tests-page.methods.addEvent");
      if(event.eventType === "onStartTester") {
        this.temporizer.start();
      } else if(event.eventType === "onEndTester") {
        this.isSuccessfullyCompleted = this.currentErrors.length === 0;
      } else if((event.eventType === "onErrorModule") || (event.eventType === "onErrorAssertion")) {
        this.currentErrors.push({
          errorType: event.eventType,
          ...eventData
        });
      }
      const id = LswTesterViewerUtils.getEventSourceId(eventData);
      The_magic_should_happen_mostly_here: {
        eventData.timeoff = this.temporizer.getTime();
        LswTesterViewerUtils.registerEvent(this, event.eventType, id, eventData);
      }
      this.$refs.eventsConsole.textContent = `>> ${id} > ${ event.eventType } @${eventData.timeoff}\n${ this.$refs.eventsConsole.textContent }`;
    },
    toggleEventsConsole() {
      this.$trace("lsw-tests-page.methods.toggleEventsConsole");
      this.isShowingEventsConsole = !this.isShowingEventsConsole;
    },
    toggleErrors() {
      this.$trace("lsw-tests-page.methods.toggleErrors");
      this.isShowingErrors = !this.isShowingErrors;
    },
    toggleSubmodules() {
      this.$trace("lsw-tests-page.methods.toggleSubmodules");
      this.isShowingSubmodules = !this.isShowingSubmodules;
    },
    validateTester() {
      this.$trace("lsw-tests-page.methods.validateTester");
      $ensure(this.tester).to.be.instanceOf(LswTester);
    },
    async loadTester() {
      this.$trace("lsw-tests-page.methods.loadTester");
      try {
        this.validateTester();
        await this.tester.options({}).load();
      } catch (error) {
        this.loadingError = error;
        this.$lsw.toasts.showError(error);
        console.log(error);
      } finally {
        this.isLoaded = true;
      }
    },
    async runTester() {
      this.$trace("lsw-tests-page.methods.runTester");
      try {
        this.isStarted = true;
        const viewer = this;
        await this.tester.options({
          trace: (Vue?.prototype?.$lsw?.logger?.$options?.active ),
          onAnything(event, ...args) {
            viewer.addEvent(event, ...args);
          }
        }).run(1);
      } catch (error) {
        this.runningError = error;
        this.$lsw.toasts.showError(error);
        console.log(error);
      } finally {
        this.isRun = true;
      }
    },
    resetTester() {
      this.$trace("lsw-tests-page.methods.resetTester");
      LswDomIrruptor.abrirTestsDeAplicacion();
    }
  },
  watch: {},
  computed: {
    isSuccessfullyCompleted() {

    },
    isCompleted() {
      return this.tester.$isExecuted;
    },
    currentState() {
      return !this.isLoaded ? "to be loaded" :
        !this.isStarted ? "loaded" :
        !this.isRun ? "running" : "finished";
    }
  },
  async mounted() {
    this.$trace("lsw-tests-page.mounted");
    this.loadTester();
    window.testerviewer = this;
  }
});
// @code.end: LswTesterViewer API
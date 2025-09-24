// @code.start: LswJsInspector API | @$section: Vue.js (v2) Components » Lsw SchemaBasedForm API » LswJsInspector component
(() => {
  const emptyOutput = {};
  const InspectorTab = class {
    constructor(options = {}, inspector) {
      this.inspector = inspector;
      this.uid = LswRandomizer.getRandomString(5);
      this.id = inspector.tabs.length;
      // this.inputSource = "Vue.options.components.LswCalendario.options.template";
      this.inputSource = "Vue";
      this.pathSource = '';
      this.transformerSource = '';
      this.searchSource = '';
      Object.assign(this, options);
    }
  }
  Vue.component("LswJsInspector", {
    template: $template,
    props: {
      initialBase: {
        type: [],
        default: () => window,
      }
    },
    data() {
      this.$trace("lsw-js-inspector.data");
      return {
        isDigesting: false,
        selectedTab: undefined,
        base: this.initialBase,
        tabs: [],
        errorGettingInput: false,
        errorPathingInput: false,
        errorTransformingInput: false,
        output: emptyOutput,
        emptyOutput: emptyOutput,
        digestTimeoutId: undefined,
        digestTimeoutMilliseconds: 1000,
      };
    },
    methods: {
      addTab(specifications = {}) {
        this.$trace("lsw-js-inspector.methods.addTab");
        const anotherTab = new InspectorTab(specifications, this);
        this.tabs.push(anotherTab);
        this.selectedTab = anotherTab.uid;
        return anotherTab;
      },
      cloneTab() {
        const specifications = {
          input: this.inputSource,
          path: this.pathSource,
          transformer: this.transformerSource,
          search: this.searchSource,
        };
        const anotherTab = new InspectorTab(specifications, this);
        this.tabs.push(anotherTab);
        this.selectedTab = anotherTab.uid;
        return anotherTab;
      },
      async digestInput() {
        try {
          this.$trace("lsw-js-inspector.methods.digestInput");
          this.isDigesting = true;
          clearTimeout(this.digestTimeoutId);
          const currentTab = this.tabs.filter(tab => tab.uid === this.selectedTab)[0];
          let transformedInput = undefined;
          Getting_input: {
            try {
              if (currentTab.inputSource.trim() === "") {
                throw new Error("Este campo es requerido para iniciar la exploración");
              }
              const callback = LswUtils.createAsyncFunction("return " + currentTab.inputSource, ["it"])
              transformedInput = await callback.call(this, transformedInput);
            } catch (error) {
              this.errorGettingInput = error;
              throw error;
            }
          }
          Pathing_input: {
            try {
              if (currentTab.pathSource.trim() === "") {
                break Pathing_input;
              }
              transformedInput = jmespath.search(transformedInput, currentTab.pathSource);
            } catch (error) {
              this.errorPathingInput = error;
              throw error;
            }
          }
          Transforming_input: {
            try {
              if (currentTab.transformerSource.trim() === "") {
                break Transforming_input;
              }
              transformedInput = await LswUtils.createAsyncFunction(currentTab.transformerSource, ["it"]).call(this, transformedInput);
            } catch (error) {
              this.errorTransformingInput = error;
              throw error;
            }
          }
          Set_output: {
            this.outputValue = transformedInput;
            this.output = LswJsInspector.stringifyBeautify(transformedInput);
          }
        } catch (error) {
          console.log(error);
          this.$lsw.toasts.showError(error);
        } finally {
          this.isDigesting = false;
        }
      },
      backProperty(tabIndex) {
        this.$trace("lsw-js-inspector.methods.backProperty");
        const tab = this.tabs[tabIndex];
        const propPath = tab.inputSource.trim();
        let newPath = undefined;
        let pos = undefined;
        if (propPath.endsWith("]")) {
          pos = propPath.lastIndexOf("[");
        } else {
          pos = propPath.lastIndexOf(".");
        }
        const shouldOpenGlobal = (pos === 0) || (propPath.trim() === '');
        const shouldIgnore = (pos === -1) && (propPath.trim() !== '');
        if (shouldIgnore) {
          return;
        } else if (shouldOpenGlobal) {
          tab.inputSource = "window";
        } else {
          newPath = propPath.slice(0, pos);
          tab.inputSource = newPath;
        }
        this.digestInput();
      },
      openProperty(tabIndex, propId) {
        this.$trace("lsw-js-inspector.methods.openProperty");
        const tab = this.tabs[tabIndex];
        const propRegex = /^[A-Za-z$_][A-Za-z0-9$_]*$/g;
        const byString = !propRegex.test(propId);
        const appendment = byString ? `[${JSON.stringify(propId)}]` : `.${propId}`;
        tab.inputSource += appendment;
        this.digestInput();
      },
      updateSearchWithDelay(tab, searchSource) {
        this.$trace("lsw-js-inspector.methods.updateSearchWithDelay");
        clearTimeout(this.digestTimeoutId);
        this.digestTimeoutId = setTimeout(() => {
          tab.searchSource = searchSource;
          this.digestInput();
        }, this.digestTimeoutMilliseconds);
      },
      resetTabId(tabIndex) {
        this.$trace("lsw-js-inspector.methods.resetTabId");
        this.tabs[tabIndex].idSource = '';
        this.digestInput();
      },
      resetTabInput(tabIndex) {
        this.$trace("lsw-js-inspector.methods.resetTabInput");
        this.tabs[tabIndex].inputSource = '';
        this.digestInput();
      },
      resetTabPath(tabIndex) {
        this.$trace("lsw-js-inspector.methods.resetTabPath");
        this.tabs[tabIndex].pathSource = '';
        this.digestInput();
      },
      resetTabTransformer(tabIndex) {
        this.$trace("lsw-js-inspector.methods.resetTabTransformer");
        this.tabs[tabIndex].transformerSource = '';
        this.digestInput();
      },
      resetTabSearch(tabIndex) {
        this.$trace("lsw-js-inspector.methods.resetTabSearch");
        this.tabs[tabIndex].searchSource = '';
        this.digestInput();
      },
      openConsole() {
        this.$trace("lsw-js-inspector.methods.openConsole");
        this.$consoleHooker.toggleConsole();
      },
    },
    watch: {
      selectedTab() {
        this.digestInput();
      }
    },
    async mounted() {
      try {
        this.$trace("lsw-js-inspector.mounted");
        await LswLazyLoads.loadBeautifier();
        await LswLazyLoads.loadJmespath();
        await LswJsInspector.initializeFully();
        if (this.tabs.length === 0) {
          this.selectedTab = this.addTab({
            id: "Principal",
          }).uid;
        }
        await this.digestInput();
      } catch (error) {
        console.log(error);
      }
    }
  });
})();
// @code.end: LswJsInspector API
// @code.start: LswDebugger API | @$section: Vue.js (v2) Components » LswDebugger component
Vue.component("LswDebugger", {
  template: $template,
  props: {
    
  },
  data() {
    this.$trace("lsw-error-box.data");
    return {
      currentMessages: [],
    };
  },
  methods: {
    debug(data, options = {}) {
      this.$trace("lsw-debugger.methods.debug");
      const id = options.id || LswRandomizer.getRandomString(10);
      const timeout = options.timeout || 3000;
      const timeoutId = setTimeout(() => {
        const pos = this.currentMessages.findIndex(it => it.id === id);
        if(pos === -1) return;
        this.currentMessages.splice(pos, 1);
        this.$forceUpdate(true);
      }, timeout);
      this.currentMessages.unshift({
        id,
        data: data,
        options,
        timeout,
        timeoutId,
        created_at: LswTimer.utils.fromDateToDatestring(new Date(), 0, 0, 1, 0, 1),
      });
    },
    clearMessages() {
      this.$trace("lsw-debugger.methods.clearMessages");
      this.currentMessages = [];
    }
  },
  watch: {},
  mounted() {
    try {
      this.$trace("lsw-error-box.mounted");
      LswDebugger.global = LswDebugger.create(this);
      this.$debugger = LswDebugger.global;
      this.$lsw.debugger = LswDebugger.global;
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswDebugger API
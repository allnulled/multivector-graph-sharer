// @code.start: LswClockwatcher API | @$section: Vue.js (v2) Components » Lsw Windows API » LswClockwatcher component
// Change this component at your convenience:
Vue.component("LswClockwatcher", {
  template: $template,
  props: {
    viewer: {
      type: Object,
      required: true
    }
  },
  data() {
    this.$trace("lsw-clockwatcher.data");
    return {
      currentDate: new Date(),
      currentMessage: false,
    };
  },
  methods: {
    onClick(event) {
      this.$trace("lsw-clockwatcher.methods.onClick");
      this.viewer.toggleState();
    },
    startTimer() {
      this.$trace("lsw-clockwatcher.methods.startTimer");
      this.timerId = setTimeout(() => {
        this.currentDate = new Date();
        this.startTimer();
      }, 1000 * 60);
    },
    stopTimer() {
      this.$trace("lsw-clockwatcher.methods.stopTimer");
      clearTimeout(this.timerId);
    },
    async loadMessage() {
      this.$trace("lsw-clockwatcher.methods.loadMessage");
      try {
        const userPreferences = await this.$lsw.fs.evaluateAsDotenvFileOrReturn('/kernel/settings/user.env', {});
        const clockMessage = userPreferences["app.clock_message"] || false;
        this.currentMessage = clockMessage;
      } catch (error) {
        // @OK.
        console.error("[!] Could not load preference «app.clock_message» from clockwatcher:", error);
      }
    }
  },
  mounted() {
    this.$trace("lsw-clockwatcher.mounted");
    this.startTimer();
    this.loadMessage();
  },
  unmount() {
    this.$trace("lsw-clockwatcher.unmounted");
    this.stopTimer();
  }
});
// @code.end: LswClockwatcher API
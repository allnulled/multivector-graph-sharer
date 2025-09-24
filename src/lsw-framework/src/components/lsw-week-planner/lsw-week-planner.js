// @code.start: LswWeekPlanner API | @$section: Vue.js (v2) Components » Lsw Week Planner API » LswWeekPlanner component
Vue.component("LswWeekPlanner", {
  template: $template,
  props: {},
  data() {
    return {
      scriptContent: "",
      scriptOutput: "",
    };
  },
  methods: {
    parsear() {
      try {
        const ast = WeekLang.parse(this.scriptContent);
        this.scriptOutput = JSON.stringify(ast, null, 2);
      } catch (error) {
        this.scriptOutput = JSON.stringify({
          error: true,
          name: error.name,
          message: error.message,
          stack: error.stack,
        }, null, 2);
      }
    }
  },
  watch: {},
  mounted() {
    
  }
});
// @code.end: LswWeekPlanner API
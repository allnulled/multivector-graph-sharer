// @code.start: LswGoalsViewer API | @$section: Vue.js (v2) Components » LswGoalsViewer component
Vue.component("LswGoalsViewer", {
  template: $template,
  props: {
    onClose: {
      type: [Function, Boolean],
      default: false,
    },
    onRefresh: {
      type: [Function, Boolean],
      default: false,
    }
  },
  data() {
    this.$trace("lsw-goals-viewer.data");
    return {
      isLoaded: false,
      goalsData: false,
      isShowingBars: true,
      completedGoalsCounter: 0,
      missingGoalsCounter: 0,
    };
  },
  methods: {
    async loadGoals() {
      this.$trace("lsw-goals-viewer.methods.loadGoals");
      const allGoals = await LswGoals.loadGoals();
      console.log("allGoals", allGoals);
      this.goalsData = allGoals;
      for(let indexGoal=0; indexGoal<allGoals.length; indexGoal++) {
        const goal = allGoals[indexGoal];
        const it = this.expandGoal(goal);
        try {
          if(it["tiene el"] >= 100) {
            this.completedGoalsCounter++;
          } else {
            this.missingGoalsCounter++;
          }
        } catch (error) {
          console.log(error);
        }
      }
      this.isLoaded = true;
    },
    toggleBars() {
      this.$trace("lsw-goals-viewer.methods.emitClose");
      const graphComp = this.$refs.barsGraph;
      graphComp.selectPropertyViewByName("falta el");
    },
    emitClose() {
      this.$trace("lsw-goals-viewer.methods.emitClose");
      if(typeof this.onClose === "function") {
        this.onClose(this);
      }
    },
    emitRefresh() {
      this.$trace("lsw-goals-viewer.methods.emitRefresh");
      if(typeof this.onRefresh === "function") {
        this.onRefresh(this);
      }
    },
    openGoalsDirectory() {
      this.$trace("lsw-goals-viewer.methods.openGoalsDirectory");
      this.$lsw.dialogs.open({
        title: "Directorio de objetivos",
        template: `
          <lsw-filesystem-explorer :absolute-layout="true" opened-by="/kernel/goals/goals.week" />
        `
      });
    },
    expandGoal(goal) {
      this.$trace("lsw-goals-viewer.methods.expandGoal");
      return Object.assign({}, goal, {
          "tiene el": goal.porcentaje,
          "falta el": 100-goal.porcentaje
      });
    },
    sortGoals(g1, g2) {
      this.$trace("lsw-goals-viewer.methods.sortGoals");
      const u1 = g1.urgencia || 0;
      const u2 = g2.urgencia || 0;
      const c1 = g1["tiene el"] || 0;
      const c2 = g2["tiene el"] || 0;
      const g1over = c1 > 100;
      const g2over = c2 > 100;
      if(g2over) return -1;
      if(g1over) return 1;
      if(u1 > u2) return -1;
      if(u1 < u2) return 1;
      if(c1 < c2) return -1;
      if(c1 > c2) return 1;
      return 0;
    },
    adaptSample(goalsData) {
      this.$trace("lsw-goals-viewer.methods.adaptSample");
      return goalsData.map(it => {
        const expandedGoal = this.expandGoal(it);
        return expandedGoal;
      }).sort((...args) => {
        return this.sortGoals(...args);
      });
    }
  },
  watch: {},
  mounted() {
    this.$trace("lsw-goals-viewer.mounted");
    this.loadGoals();
  },
  unmounted() {
    this.$trace("lsw-goals-viewer.unmounted");
  }
});
// @code.end: LswGoalsViewer API
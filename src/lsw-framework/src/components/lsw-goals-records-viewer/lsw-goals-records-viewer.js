// @code.start: LswGoalsRecordsViewer API | @$section: Vue.js (v2) Components » LswGoalsRecordsViewer component
Vue.component("LswGoalsRecordsViewer", {
  template: $template,
  props: {

  },
  data() {
    this.$trace("lsw-goals-records-viewer.data");
    return {
      isLoaded: false,
      isShowingGoals: true,
      records: false,
      selectedGoals: [],
      availableGoals: [],
    };
  },
  methods: {
    async loadRecords() {
      this.$trace("lsw-goals-records-viewer.methods.loadRecords");
      this.isLoaded = false;
      try {
        const recordsFiles = await this.$lsw.fs.read_directory("/kernel/goals/records");
        const recordDays = Object.keys(recordsFiles).map(file => file.replace(/\.json$/g, ""));
        const allRecords = [];
        const allGoalConcepts = [];
        const errors = [];
        for (let index = 0; index < recordDays.length; index++) {
          const recordDay = recordDays[index];
          try {
            const recordPath = `/kernel/goals/records/${recordDay}.json`;
            const recordJson = await this.$lsw.fs.read_file(recordPath);
            const recordData = JSON.parse(recordJson);
            allRecords.push(recordData);
            for(let indexGoals=0; indexGoals<recordData.goals.length; indexGoals++) {
              const goal = recordData.goals[indexGoals];
              try {
                const goalId = goal.originalConcept;
                const goalPos = allGoalConcepts.indexOf(goalId);
                if(goalPos === -1) {
                  allGoalConcepts.push(goalId);
                }
              } catch (error) {
                // @BADLUCK
              }
            }
          } catch (error) {
            console.log(error);
            error.message = `(${recordDay}) ` + error.message;
            error.fileOrigin = recordDay;
            errors.push(error);
          }
        }
        if (errors.length) {
          console.log(errors);
          this.$lsw.toasts.send({
            title: `Hubo ${errors.length} errores cargando los records`,
            text: "Errores en: " + errors.map(err => err.fileOrigin).join(", "),
          });
          return;
        }
        this.records = allRecords;
        this.availableGoals = allGoalConcepts;
      } catch (error) {
        console.log(error);
      }
      this.isLoaded = true;
    },
    toggleGoals() {
      this.$trace("lsw-goals-records-viewer.methods.toggleGoals");
      this.isShowingGoals = !this.isShowingGoals;
    },
    toggleAllSelectedGoals() {
      this.$trace("lsw-goals-records-viewer.methods.toggleAllSelectedGoals");
      if(this.selectedGoals.length) {
        this.selectedGoals = [];
      } else {
        this.selectedGoals = [].concat(this.availableGoals);
      }
    }
  },
  watch: {},
  mounted() {
    this.$trace("lsw-goals-records-viewer.mounted");
    this.loadRecords();
  },
  unmounted() {
    this.$trace("lsw-goals-records-viewer.unmounted");
  }
});
// @code.end: LswGoalsRecordsViewer API
// @code.start: LswEquationSolver API | @$section: Vue.js (v2) Components » LswEquationSolver component
Vue.component("LswEquationSolver", {
  template: $template,
  props: {
    initialIncognites: {
      type: Array,
      default: () => [],
    },
    initialEquation: {
      type: String,
      default: () => "",
    },
  },
  data() {
    this.$trace("lsw-equation-solver.data");
    const allExamples = [
      "x + 10",
      "sqrt(x)",
      "log(10000, 10)",
      "f(x) = x ^ 2 - 5; f(2)",
      "g(x, y) = x ^ y; g(2, 3)",
      "x = 7; h(y) = x + y; h(3)",
      "twice(func, x) = func(func(x)); twice(square, 2)",
      "twice(func, x) = func(func(x)); f(x) = 3*x; twice(f, 2)",
      // To be continued...
    ]
    return {
      equationSolverButtons: [{
        text: "ℹ️",
        event: () => {
          LswUtils.copyToClipboard("https://mathjs.org/docs/expressions/syntax.html");
        }
      }],
      solution: "",
      equation: this.initialEquation,
      incognites: this.initialIncognites,
      currentExample: LswRandomizer.getRandomItem(allExamples),
    };
  },
  methods: {
    async load() {
      this.$trace("lsw-equation-solver.methods.load");
      await LswLazyLoads.loadMathJs();
    },
    addIncognite() {
      this.$trace("lsw-equation-solver.methods.addIncognite");
      let incogniteName = "";
      const originalPossibilities = "xyzabcdefghijklmnopqrstuvw".split("");
      const possibilities = originalPossibilities.reduce((out, incog) => {
        out[incog] = false;
        return out;
      }, {});
      Turn_to_true_chosen_possibilities:
      for(let index=0; index<this.incognites.length; index++) {
        const incognite = this.incognites[index];
        possibilities[incognite] = true;
      }
      const currentIncognites = this.incognites.map(incognite => incognite.name);
      Find_first_non_chosen_possibility:
      for(let index=0; index<originalPossibilities.length; index++) {
        const possibility = originalPossibilities[index];
        if(currentIncognites.indexOf(possibility) === -1) {
          incogniteName = possibility;
          break Find_first_non_chosen_possibility;
        }
      }
      this.incognites.push({
        name: incogniteName,
        value: "",
      });
    },
    solve() {
      this.$trace("lsw-equation-solver.methods.solve");
      try {
        const incogniteValues = this.incognites.reduce((out, it) => {
          out[it.name] = it.value;
          return out;
        }, {});
        this.solution = math.evaluate(this.equation, incogniteValues);
      } catch (error) {
        console.log(error);
        this.solution = error.message;
      }
    },
    dropIncognite(index) {
      this.$trace("lsw-equation-solver.methods.solve");
      this.incognites.splice(index, 1);
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-equation-solver.mounted");
      await this.load();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswEquationSolver API
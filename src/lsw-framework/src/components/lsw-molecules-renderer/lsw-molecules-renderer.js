// @code.start: LswMoleculesRenderer API | @$section: Vue.js (v2) Components » LswMoleculesRenderer component
const moleculeExamples = [
  "C",
  "OCC",
  "[CH3][CH2][OH] ",
  "C-C-O",
  "C(O)C",
  "OC(=O)C(Br)(Cl)N",
  "ClC(Br)(N)C(=O)O",
  "O=C(O)C(N)(Br)Cl",
  "P",
  "N",
  "S",
  "O",
  "Cl",
  "[S]",
  "[Au]",
  "[H+]",
  "[Fe+2]",
  "[OH-]",
  "[Fe++]",
  "[OH3+]",
  "[NH4+]",
  "CC",
  "C=O",
  "C=C",
  "O=C=O",
  "COC",
  "C#N",
  "CCO",
  "[H][H]",
  "C=CCC=CCO",
  "C=C-C-C=C-C-O",
  "OCC=CCC=C",
  "CCN(CC)CC",
  "CC(C)C(=O)O",
  "C=CC(CCC)C(C(C)C)CCC",
  "C12C3C4C1C5C4C3C25",
  "O1CCCCC1N1CCCCC1",
  "[12C]",
  "[13C]",
  "[C]",
  "[13CH4]",
  "NC(C)(F)C(=O)O",
  "N[C@](C)(F)C(=O)O",
];
Vue.component("LswMoleculesRenderer", {
  template: $template,
  props: {
    initialSource: {
      type: [Boolean, String],
      default: () => false,
    }
  },
  data() {
    this.$trace("lsw-molecules-renderer.data");
    const originalSource = this.initialSource ? this.initialSource : LswRandomizer.getRandomItem(moleculeExamples);
    return {
      moleculesRendererButtons: [{
        text: "🎲",
        event: () => this.randomizeSource(),
      }, {
        text: "📚",
        event: () => {
          LswUtils.copyToClipboard("https://www.daylight.com/dayhtml/doc/theory/theory.smiles.html");
        },
      }, {
        text: "ℹ️",
        event: () => {
          LswUtils.copyToClipboard("https://es.wikipedia.org/wiki/SMILES");
        }
      }],
      source: originalSource,
    };
  },
  methods: {
    randomizeSource() {
      this.$trace("lsw-molecules-renderer.methods.randomizeSource");
      this.source = LswRandomizer.getRandomItem(moleculeExamples);
      this.renderSmileScript();
    },
    renderSmileScript() {
      this.$trace("lsw-molecules-renderer.methods.renderSmileScript");
      let smilesDrawer = new SmilesDrawer.Drawer({
        width: 250,
        height: 250,
      });
      SmilesDrawer.parse(this.source, (tree) => {
        smilesDrawer.draw(tree, this.$refs.smilesCanvas, "light", false);
      });
    }
  },
  watch: {},
  async mounted() {
    try {
      this.$trace("lsw-molecules-renderer.mounted");
      await LswLazyLoads.loadSmilesDrawer();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswMoleculesRenderer API
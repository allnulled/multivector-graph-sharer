// @code.start: DgnRestHomepage API | @$section: Vue.js (v2) Components » Lsw Rest UI API » DgnRestHomepage component
Vue.component("DgnRestHomepage", {
  template: $template,
  props: {},
  data() {
    this.$trace("dgn-rest-homepage.data");
    return {
      selectedPage: "esquema", // also: "esquema", "tabla", "fila"
      selectedTable: false,
      selectedRow: false,
      schema: false,
    };
  },
  methods: {
    goToSchema() {
      this.$trace("dgn-rest-homepage.methods.goToSchema");
      this.selectedTable = false;
      this.selectedRow = false;
      this.selectedPage = "esquema";
    },
    goToTable(tableId) {
      this.$trace("dgn-rest-homepage.methods.goToTable");
      this.selectedTable = tableId;
      this.selectedRow = false;
      this.selectedPage = "tabla";
    },
    goToRow(tableId, rowId) {
      this.$trace("dgn-rest-homepage.methods.goToRow");
      this.selectedTable = tableId;
      this.selectedRow = rowId;
      this.selectedPage = "fila";
    }
  },
  watch: {},
  mounted() {
    this.$trace("dgn-rest-homepage.mounted");
  },
});
// @code.end: DgnRestHomepage API
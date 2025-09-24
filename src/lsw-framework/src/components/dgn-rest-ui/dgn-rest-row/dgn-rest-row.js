// @code.start: DgnRestRow API | @$section: Vue.js (v2) Components » Lsw Rest UI API » DgnRestRow component
Vue.component("DgnRestRow", {
  template: $template,
  props: {
    homepage: {
      type: Object,
      required: true,
    },
    table: {
      type: String,
      required: true,
    },
    row: {
      type: Number,
      default: () => -1
    }
  },
  data() {
    this.$trace("dgn-rest-row.data");
    return {
      rowData: {},
    };
  },
  methods: {
    async loadRow() {
      this.$trace("dgn-rest-row.methods.loadRow");
      if(this.row === -1) return;
      if(typeof this.row === "number") {
        const response = await DgnFetch.fetch("/api/v1/data/select?from=" + this.table + '&where=[["id","=",' + this.row + "]]");
        this.rowData = response.data.output[0];
      }
    }
  },
  watch: {},
  mounted() {
    this.$trace("dgn-rest-row.mounted");
    this.loadRow();
  },
});
// @code.end: DgnRestRow API
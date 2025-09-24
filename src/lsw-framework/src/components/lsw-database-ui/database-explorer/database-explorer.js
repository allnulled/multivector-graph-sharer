// @code.start: LswDatabaseExplorer API | @$section: Vue.js (v2) Components » LswDatabaseExplorer API » LswDatabaseExplorer API
Vue.component("LswDatabaseExplorer", {
  template: $template,
  props: {
    showBreadcrumb: {
      type: Boolean,
      default: () => true
    },
    initialPage: {
      type: String,
      default: () => "lsw-page-tables"
    },
    initialArgs: {
      type: Object,
      default: () => ({ database: "lsw_default_database" })
    },
  },
  data() {
    this.$trace("lsw-database-explorer.data", []);
    return {
      isLoading: false,
      selectedPage: this.initialPage,
      selectedArgs: this.initialArgs,
    }
  },
  methods: {
    selectPage(page, args = {}) {
      try {
        this.$trace("lsw-database-explorer.methods.selectPage", arguments);
        $ensure({page}, 1).type("string");
        $ensure({args}, 1).type("object");
        this.isLoading = true;
        this.$nextTick(() => {
          this.selectedArgs = args;
          this.selectedPage = page;
          this.isLoading = false;
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  async mounted() {
    this.$trace("lsw-database-explorer.methods.mounted", arguments);
  },
  unmounted() {
    this.$trace("lsw-database-explorer.methods.unmounted", arguments);
  }
});
// @code.end: LswDatabaseExplorer API
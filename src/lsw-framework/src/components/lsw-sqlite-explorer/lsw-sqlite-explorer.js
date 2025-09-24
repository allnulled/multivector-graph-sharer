// @code.start: LswSqliteExplorer API | @$section: Vue.js (v2) Components » LswSqliteExplorer component
Vue.component("LswSqliteExplorer", {
  template: $template,
  props: {
    
  },
  data() {
    this.$trace("lsw-sqlite-explorer.data");
    return {
      selectedSection: "data",
      selectedDataSection: "tables",
      selectedDataTable: false,
      sqliteResolvable: Promise.withResolvers(),
      isSqliteLoaded: false,
      schema: false,
      rows: false,
    };
  },
  methods: {
    loadEnvironment() {
      this.$trace("lsw-sqlite-explorer.methods.loadEnvironment");
      return LswLazyLoads.loadSqlite().then(() => {
        this.isSqliteLoaded = true;
        this.sqliteResolvable.resolve();
      });
    },
    async loadSchema() {
      this.$trace("lsw-sqlite-explorer.methods.loadSchema");
      this.sqliteResolvable.promise.then(() => {
        this.schema = LswSqlite.getSchema();
      });
    },
    async saveDatabase() {
      this.$trace("lsw-sqlite-explorer.methods.saveDatabase");
      try {
        await LswSqlite.saveDatabase();
        this.$lsw.toasts.send({
          title: "Datos guardados",
          text: "Los dadtos fueron guardados con éxito."
        });
      } catch (error) {
        this.$lsw.toasts.showError(error);
      }
    },
    goToData() {
      this.$trace("lsw-sqlite-explorer.methods.goToData");
      this.selectedSection = "data";
    },
    goToConsole() {
      this.$trace("lsw-sqlite-explorer.methods.goToConsole");
      this.selectedSection = "console";
    },
    goToTables() {
      this.$trace("lsw-sqlite-explorer.methods.goToTables");
      this.selectedSection = "data";
      this.selectedDataSection = "tables";
    },
    openTable(tableId) {
      this.$trace("lsw-sqlite-explorer.methods.goToTables");
      this.selectedSection = "data";
      this.selectedDataSection = "rows";
      this.selectedDataTable = tableId;
    },
    goToNewItem() {
      this.$trace("lsw-sqlite-explorer.methods.goToNewItem");
      this.selectedDataSection = "new-row";
    },
    goToRows() {
      this.$trace("lsw-sqlite-explorer.methods.goToRows");
      this.selectedDataSection = "rows";
    }
  },
  watch: {
    selectedDataTable(tableId) {
      Cascadea_las_rows: {
        if(typeof tableId === "string") {
          (async () => {
            this.rows = await LswSqlite.selectMany(tableId, []);
          })();
        } else {
          this.rows = false;
        }
      }
    }
  },
  async mounted() {
    try {
      this.$trace("lsw-sqlite-explorer.mounted");
      this.loadEnvironment();
      this.loadSchema();
    } catch (error) {
      console.log(error);
    }
  }
});
// @code.end: LswSqliteExplorer API
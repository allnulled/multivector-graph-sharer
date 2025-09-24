// @code.start: LswPageRows API | @$section: Vue.js (v2) Components » LswPageRows API » LswPageRows API
Vue.component("LswPageRows", {
  template: $template,
  props: {
    databaseExplorer: {
      type: Object,
      required: true
    },
    args: {
      type: Object,
      required: true
    },
  },
  data() {
    this.$trace("lsw-page-rows.data", []);
    $ensure({ "args": this.args }, 1).type("object");
    $ensure({ "args.database": this.args.database }, 1).type("string");
    $ensure({ "args.table": this.args.table }, 1).type("string");
    return {
      breadcrumb: [{
        page: "LswPageTables",
        name: this.args.database,
        args: {
          database: this.args.database
        }
      }, {
        page: "LswPageRows",
        name: this.args.table,
        args: {
          database: this.args.database,
          table: this.args.table
        },
        current: true
      }],
      database: this.args.database,
      table: this.args.table,
      rows: undefined,
      connection: undefined,
    }
  },
  methods: {
    goBack() {
      this.$trace("lsw-page-rows.methods.goBack", arguments);
      return this.databaseExplorer.selectPage("LswPageTables", {
        database: this.database,
      });
    },
    getTableId() {
      if(this.args.tableStorageId) {
        return this.args.tableStorageId + '.json';
      } else {
        return 'lsw-database-ui.page-rows.' + this.args.database + '.' + this.args.table + '.json';
      }
    },
    async loadRows() {
      this.$trace("lsw-page-rows.methods.loadRows", arguments);
      this.connection = this.connection ?? new LswDatabaseAdapter(this.database);
      await this.connection.open();
      const filterCallback = (this.args.filterCallback && typeof(this.args.filterCallback) === "function") ? this.args.filterCallback : () => true;
      const selection = await this.connection.select(this.table, filterCallback);
      this.rows = selection;
      return selection;
    },
    openRow(rowId) {
      this.$trace("lsw-page-rows.methods.openRow", arguments);
      return this.databaseExplorer.selectPage("LswPageRow", {
        database: this.database,
        table: this.table,
        rowId: rowId
      });
    }
  },
  mounted() {
    this.$trace("lsw-page-rows.mounted", arguments);
    this.loadRows();
  },
  unmounted() {
    this.$trace("lsw-page-rows.unmounted", arguments);
    this.connection.close();
  }
});
// @code.end: LswPageRows API
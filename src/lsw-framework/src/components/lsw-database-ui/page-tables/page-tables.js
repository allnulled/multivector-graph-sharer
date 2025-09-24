// @code.start: LswPageTables API | @$section: Vue.js (v2) Components » LswPageTables API » LswPageTables API
Vue.component("LswPageTables", {
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
    const ensureArgs = $ensure(this.args).type("object");
    ensureArgs.to.have.key("database").its("database").type("string");
    return {
      breadcrumb: [{
        page: "LswPageTables",
        name: this.args.database,
        args: {
          database: this.args.database
        },
        current: true
      }],
      database: this.args.database,
      tables: false,
      tablesAsList: false,
      isShowingSchema: false,
    }
  },
  methods: {
    async loadDatabase() {
      const db = await LswDatabaseAdapter.getSchema(this.database);
      this.tables = db;
      console.log(`[*] Tables of database ${this.args.database}:`, db);
    },
    openTable(table) {
      $ensure({ table }, 1).type("string");
      return this.databaseExplorer.selectPage("LswPageRows", {
        database: this.database,
        table: table
      });
    },
    toggleSchema() {
      this.isShowingSchema = !this.isShowingSchema;
    }
  },
  watch: {
    tables(value) {
      const tablesAsList = [];
      const tableIds = Object.keys(value);
      for(let index=0; index<tableIds.length; index++) {
        const tableId = tableIds[index];
        const tableData = value[tableId];
        tablesAsList.push({
          id: tableId,
          name: tableId,
          ...tableData,
          indexes: tableData.indexes ? tableData.indexes.map(ind => ind.name) : []
        });
      }
      this.tablesAsList = tablesAsList;
    },
  },
  computed: {
    tablesAsIdsList() {
      return Object.keys(this.tablesAsList || {});
    }
  },
  mounted() {
    this.loadDatabase();
  },
  unmounted() {

  }
});
// @code.end: LswPageTables API
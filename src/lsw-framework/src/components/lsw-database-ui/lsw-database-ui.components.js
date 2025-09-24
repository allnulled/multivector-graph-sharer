(function(factory) {
  const mod = factory();
  if(typeof window !== 'undefined') {
    window["Lsw_database_ui_components"] = mod;
  }
  if(typeof global !== 'undefined') {
    global["Lsw_database_ui_components"] = mod;
  }
  if(typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function() {
Vue.component("LswDatabaseExplorer", {
  template: `<div class="lsw_database_ui database_explorer" :class="{hideBreadcrumb: !showBreadcrumb}">
    <template v-if="!isLoading">
        <component :is="selectedPage" :args="selectedArgs" :database-explorer="this" />
    </template>
</div>`,
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
    }
  },
  data() {
    this.$trace("lsw-database-explorer.data", arguments);
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
Vue.component("LswDatabaseBreadcrumb", {
  template: `<div class="database_breadcrumb">
    <span>Estás en: </span>
    <template v-for="item, itemIndex in breadcrumb">
        <span v-bind:key="'breadcrumb_item_' + itemIndex">
            <span v-if="itemIndex !== 0"> » </span>
            <a v-if="!item.current" href="javascript:void(0)" v-on:click="() => selectPage(item.page, item.args)">
                {{ item.name }}
            </a>
            <span v-else>{{ item.name }}</span>
        </span>
    </template>
</div>`,
  props: {
    databaseExplorer: {
      type: Object,
      required: true
    },
    breadcrumb: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    selectPage(page, args = {}) {
      return this.databaseExplorer.selectPage(page, args);
    }
  },
  async mounted() {
    
  },
  unmounted() {

  }
});
Vue.component("LswPageDatabases", {
  template: `<div>
    <h3>Todas las bases de datos</h3>
    <lsw-database-breadcrumb :breadcrumb="breadcrumb"
        :database-explorer="databaseExplorer" />
    <lsw-table v-if="databases && databases.length"
        :initial-input="databases"
        :initial-settings="{title: 'Lista de todas las bases de datos:', itemsPerPage: 50 }"
        :row-buttons="[{ header: '', text: '↗️', event: (row) => openDatabase(row.name) }]"></lsw-table>
</div>`,
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
    return {
      databases: [],
      databasesForTable: false,
      breadcrumb: [{
        page: "LswPageDatabases",
        name: "Databases",
        args: {},
        current: true
      }],
    }
  },
  methods: {
    openDatabase(name) {
      this.databaseExplorer.selectPage("LswPageTables", { database: name });
    }
  },
  watch: {
    databases(value) {
      AdaptingForTable: {
        const databasesForTable = [];
        if (typeof value !== "object") {
          break AdaptingForTable;
        }
        const databaseIds = Object.keys(value);
        for(let indexDatabase=0; indexDatabase<databaseIds.length; indexDatabase++) {
          const databaseId = databaseIds[indexDatabase];
          const databaseObject = value[databaseId];
        }
        this.databasesForTable = databasesForTable;
      }
    }
  },
  async mounted() {
    this.databases = await LswDatabaseAdapter.listDatabases();
    Filter_by_entity_schema_matched_db_names: {
      $lswSchema
    }
  },
  unmounted() {

  }
});
Vue.component("LswPageRow", {
  template: `<div>
    <h3>
        <span>
            <span>
                <button v-on:click="goBack">⬅️</button>
            </span>
            <span>{{ args.table }}</span>
        </span>
        <span v-if="(args.rowId && args.rowId !== -1)">
            [#{{ args.rowId }}]
        </span>
        <span v-else-if="args.row && args.row.id">
            [#{{ args.row.id }}]
        </span>
        <span v-else>
            [new]
        </span>
        <span>
            [{{ args.database }}]
        </span>
    </h3>
    <lsw-database-breadcrumb :breadcrumb="breadcrumb"
        :database-explorer="databaseExplorer" />
    <div v-if="!isLoaded">Un momento, por favor, está cargando...</div>
    <lsw-schema-based-form v-else
        :on-submit="upsertRow"
        :model="{
            connection: \$lsw.database,
            databaseId: args.database,
            tableId: args.table,
            rowId: args.rowId,
            row: row,
            databaseExplorer,
        }"
        />
</div>`,
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
    this.$trace("lsw-page-row.data", arguments);
    $ensure(this.args.database).type("string");
    $ensure(this.args.table).type("string");
    $ensure(this.args.rowId).type("number");
    return {
      isLoaded: false,
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
      }, {
        page: "LswPageRow",
        name: (this.args.rowId === -1) ? '#new' : ("#" + this.args.rowId),
        args: {
          database: this.args.database,
          table: this.args.table,
          rowId: this.args.rowId
        },
        current: true
      }],
      database: this.args.database,
      table: this.args.table,
      rowId: this.args.rowId,
      connection: undefined,
      row: false,
    }
  },
  methods: {
    goBack() {
      this.$trace("lsw-page-row.methods.goBack", arguments);
      return this.databaseExplorer.selectPage("LswPageRows", {
        database: this.database,
        table: this.table
      });
    },
    async loadRow() {
      this.$trace("lsw-page-row.methods.loadRow", arguments);
      try {
        if(this.rowId === -1) {
          return false;
        }
        this.connection = this.connection ?? new LswDatabaseAdapter(this.database);
        await this.connection.open();
        const matches = await this.connection.select(this.table, it => it.id === this.rowId);
        this.row = matches[0];
      } catch (error) {
        console.log("Error loading row:", error);
        throw error;
      } finally {
        this.row = false;
      }
    },
    async upsertRow(v) {
      this.$trace("lsw-page-row.methods.upsertRow", arguments);
      const existsRow = this.rowId || ((typeof (this.row) === "object") && (typeof (this.row.id) === "number") && (this.row.id !== -1));
      let id = this.rowId || this.row.id;
      const operation = (existsRow && (id !== -1)) ? "update" : "insert";
      if (operation === "insert") {
        id = await this.$lsw.database.insert(this.table, v);
      } else {
        await this.$lsw.database.update(this.table, id, v);
      }
      lsw.toasts.send({
        title: `Nueva ${operation === 'insert' ? 'inserción' : 'actualización'}`,
        text: `El registro #${id} de «${this.table}» fue ${operation === 'insert' ? 'insertado' : 'actualizado'} correctamente.`
      });
      if(operation === "insert") {
        this.databaseExplorer.selectPage("LswPageRow", {
          database: this.database,
          table: this.table,
          rowId: id
        });
      } else {
        // @OK.
      }
    }
  },
  async mounted() {
    this.$trace("lsw-page-row.mounted", arguments);
    try {
      await this.loadRow();
    } catch (error) {
      console.log("Error loading row:", error);
      throw error;
    } finally {
      this.isLoaded = true;
    }
  },
  unmounted() {
    this.$trace("lsw-page-row.unmounted", arguments);
    this.connection.close();
  }
});
Vue.component("LswPageRows", {
  template: `<div>
    <h3>
        <span>
            <button v-on:click="goBack">⬅️</button>
        </span>
        <span>{{ args.table }} [all]</span>
        <span>[{{ args.database }}]</span>
    </h3>
    <lsw-database-breadcrumb :breadcrumb="breadcrumb" :database-explorer="databaseExplorer" />
    <lsw-table
        :initial-input="rows" v-if="rows"
        :initial-settings="{
            title: 'Registros de ' + args.table,
            columnsOrder: ['id'],
        }"
        :row-buttons="[{ header: '', text: '↗️', event: (row) => openRow(row.id) }]"
        :table-buttons="[{ text: '#️⃣', event() { openRow(-1) }}]"></lsw-table>
    <!--table class="basic_table top_aligned">
        <thead>
            <tr>
                <th>Nº</th>
                <th>ID</th>
                <th class="width_100">Item</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row, rowIndex in rows" v-bind:key="'row_index_' + rowIndex">
                <td>{{ rowIndex + 1 }}</td>
                <td>
                    <a href="javascript:void(0)" v-on:click="() => openRow(row.id)">
                        #{{ row.id }}
                    </a>
                </td>
                <td>
                    <div v-for="prop, propIndex, propCounter in row" v-bind:key="'row_index_' + rowIndex + '_prop_' + propIndex">
                        {{ propCounter + 1 }}. {{ propIndex }}: {{ prop }}
                    </div>
                </td>
            </tr>
        </tbody>
    </table-->
</div>`,
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
    this.$trace("lsw-page-rows.data", arguments);
    $ensure(this.args).type("object");
    $ensure(this.args.database).type("string");
    $ensure(this.args.table).type("string");
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
    async loadRows() {
      this.$trace("lsw-page-rows.methods.loadRows", arguments);
      this.connection = this.connection ?? new LswDatabaseAdapter(this.database);
      await this.connection.open();
      const selection = await this.connection.select(this.table, it => true);
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
Vue.component("LswPageSchema", {
  template: `<div></div>`,
  props: {},
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  mounted() {
    
  },
  unmounted() {

  }
});
Vue.component("LswPageTables", {
  template: `<div class="page_tables page">
    <h3>Tablas de {{ args.database }}</h3>
    <lsw-database-breadcrumb :breadcrumb="breadcrumb"
        :database-explorer="databaseExplorer" />
    <lsw-table v-if="tablesAsList && tablesAsList.length"
        :initial-input="tablesAsList"
        :initial-settings="{
            title: 'Tablas de ' + args.database,
            itemsPerPage: 50,
            columnsAsList: ['indexes'],
            columnsOrder: ['name', 'indexes', 'keyPath']
        }"
        :row-buttons="[{
            header: '',
            text: '↗️',
            event: (row, i) => openTable(row.name)
        }]"></lsw-table>
</div>`,
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
          name: tableId,
          ...tableData,
          indexes: tableData.indexes ? tableData.indexes.map(ind => ind.name) : []
        });
      }
      this.tablesAsList = tablesAsList;
    }
  },
  mounted() {
    this.loadDatabase();
  },
  unmounted() {

  }
});
});

(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswSchema'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswSchema'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {


  const LswSchemaSignature = class {

    static create(...args) {
      return new this(...args);
    }

    static noop() {}

    constructor(base = {}, generator = this.constructor.noop, parameters = [], scope = this) {
      const result = generator.call(scope, ...parameters) || {};
      Object.assign(this, base, result);
    }

  };

  /**
   * 
   * @$section: Lsw Schema API » LswSchema class
   * @type: Class
   * @vendor: lsw
   * @namespace: LswSchema
   * @source code: La clase está definida así:
   * 
   */
  // @code.start: LswSchema class | @section: Lsw Schema API » LswSchema class
  const LswSchema = class {

    $trace(methodId, argsList) {
      if(this.$options && this.$options.trace) {
        console.log("[trace][lsw-schema][" + methodId + "] " + argsList.length);
      }
    }

    static Signature = LswSchemaSignature;

    static createSignature(creatorCallback, creatorParameters, creatorScope) {
      return this.Signature.create(creatorCallback, creatorParameters, creatorScope);
    }

    onValidateSchema(schema) {
      this.$trace("onValidateSchema", arguments);
      // @OVERRIDABLE
    }

    onValidateTable(id, definition, schema) {
      this.$trace("onValidateTable", arguments);
      // @OVERRIDABLE
    }

    onValidateColumn(id, definition, tableId, schema) {
      this.$trace("onValidateColumn", arguments);
      // @OVERRIDABLE
    }

    onFusionateSchema(schema) {
      this.$trace("onFusionateSchema", arguments);
      // @OVERRIDABLE
    }

    onFusionateTable(table, tableId, schema) {
      this.$trace("onFusionateTable", arguments);
      // @OVERRIDABLE
    }

    onFusionateColumn(column, columnId, tableId, schema) {
      this.$trace("onFusionateColumn", arguments);
      // @OVERRIDABLE
    }

    static create(...args) {
      return new this(...args);
    }

    constructor(options = {}) {
      this.$cache = {
        schemaForLsw: null
      };
      this.$schema = {
        hasTables: {

        }
      };
      this.$options = options;
    }
    
    getDatabaseSchemaForLsw(refresh = false) {
      this.$trace("getDatabaseSchemaForLsw", arguments);
      if(refresh) {
        this.$cache.schemaForLsw = null;
      }
      if(this.$cache.schemaForLsw) {
        return this.$cache.schemaForLsw;
      }
      const schemaForLsw = {};
      for(let tableId in this.$schema.hasTables) {
        const tableData = this.$schema.hasTables[tableId];
        let tableSchema = [];
        for(let columnId in tableData.hasColumns) {
          const columnData = tableData.hasColumns[columnId];
          const prefix = columnData.isUnique ? "!" : "";
          tableSchema.push(prefix + columnId);
        }
        schemaForLsw[tableId] = tableSchema;
      }
      this.$cache.schemaForLsw = schemaForLsw;
      return schemaForLsw;
    }

    loadSchemaByProxies(aspectId = "SchemaEntity") {
      this.$trace("loadSchemaByProxies", arguments);
      const schema = this.getSchemaByProxies(aspectId);
      return this.registerSchema(schema);
    }

    getSchemaByProxies(aspectId = "SchemaEntity") {
      this.$trace("getSchemaByProxies", arguments);
      const allSchemaEntities = Object.values($proxifier.$definitions).filter(d => d[aspectId]).map(d => d[aspectId]);
      const schemaTemp = new LswSchema();
      for(let index=0; index<allSchemaEntities.length; index++) {
        const SchemaEntityClass = allSchemaEntities[index];
        const lswDatabaseSchema = this.adaptSchemaEntityToDatabaseSchema(SchemaEntityClass);
        schemaTemp.registerSchema(lswDatabaseSchema);
      }
      return schemaTemp.$schema;
    }

    adaptSchemaEntityToDatabaseSchema(SchemaEntityClass) {
      this.$trace("adaptSchemaEntityToDatabaseSchema", arguments);
      const schema = { hasTables: {} };
      const data = SchemaEntityClass.toObject();
      schema.hasTables[data.name] = {
        ...data,
        hasEntityId: SchemaEntityClass.getEntityId(),
        hasColumns: data.properties,
        hasExtraAttributes: data.extraAttributes,
      };
      return schema;
    }

    registerSchema(partialSchema = {}) {
      this.$trace("registerSchema", arguments);
      if (typeof partialSchema !== "object") {
        throw new Error("Required parameter «partialSchema» to be an object on «LswSchema.registerSchema»");
      }
      this.$validateSchema(partialSchema);
      this.$fusionateSchema(partialSchema);
      return this;
    }

    $validateSchema(schema) {
      this.$trace("$validateSchema", arguments);
      Native: {
        this.$validateSchemaNative(schema);
      }
      Core_process: {
        if ("hasTables" in schema) {
          const tableIds = Object.keys(schema.hasTables);
          Iterating_tables:
          for (let indexTable = 0; indexTable < tableIds.length; indexTable++) {
            const tableId = tableIds[indexTable];
            const table = schema.hasTables[tableId];
            this.$validateTableNative(table, tableId, schema);
            if (!("hasColumns" in table)) {
              continue Iterating_tables;
            }
            const columnIds = Object.keys(table.hasColumns);
            Iterating_columns:
            for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
              const columnId = columnIds[indexColumn];
              const column = table.hasColumns[columnId];
              this.$validateColumnNative(column, columnId, tableId, schema);
            }
          }
        }
      }
      User: {
        this.onValidateSchema(schema);
      }
    }

    $fusionateSchema(partialSchema) {
      this.$trace("$fusionateSchema", arguments);
      const tableIds = Object.keys(partialSchema?.hasTables || {});
      Debug_purposes: {
        const columnIds = tableIds.map(tableId => Object.keys(partialSchema.hasTables[tableId].hasColumns || {}).map(columnId => [tableId, columnId].join(".")));
        const tablesMessage = tableIds.length === 0 ? "No tables to fusionate" : "Tables to fusionate:\n - " + tableIds.join("\n - ");
        const columnsMessage = columnIds.length === 0 ? "No columns to fusionate" : "Columns to fusionate:\n - " + columnIds.join("\n - ");
        this.$trace(`[*] ${tablesMessage}`, []);
        this.$trace(`[*] ${columnsMessage}`, []);
      }
      this.$fusionateSchemaNative(partialSchema);
      Iterating_tables:
      for (let indexTable = 0; indexTable < tableIds.length; indexTable++) {
        const tableId = tableIds[indexTable];
        const tableInfo = partialSchema.hasTables[tableId];
        this.$fusionateTableNative(tableInfo, tableId, partialSchema);
        const columnIds = Object.keys(tableInfo.columns || {});
        Iterating_columns:
        for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
          const columnId = columnIds[indexColumn];
          const columnInfo = tableInfo.columns[columnId];
          this.$fusionateColumnNative(columnInfo, columnId, tableId, partialSchema);
        }
      }
    }

    $validateSchemaNative(schema) {
      this.$trace("$validateSchemaNative", arguments);
      Native: {
        const ensureSchema = $ensure(schema).type("object").to.have.key("hasTables");
        ensureSchema.its("hasTables").type("object");
      }
      User: {
        this.onValidateSchema(schema);
      }
    }

    $validateTableNative(definition, id, schema) {
      this.$trace("$validateTableNative", arguments);
      Native: {
        const ensureTable = $ensure(definition).type("object").to.have.key("hasColumns");
        const ensureHasColumns = ensureTable.its("hasColumns").type("object");
        const columnIds = Object.keys(ensureHasColumns.$subject);
        for(let index=0; index<columnIds.length; index++) {
          const columnId = columnIds[index];
          const ensureColumn = ensureHasColumns.its(columnId).type("object");
          ensureColumn.its("isType").type("string");
          ensureColumn.its("isUnique").type(["boolean", "undefined"]);
          ensureColumn.its("refersTo").type(["object", "undefined", "boolean"]);
          if(typeof ensureColumn.$subject.refersTo === "object") {
            const ensureRefersTo = ensureColumn.its("refersTo").type("object");
            ensureRefersTo.to.have.keys(["entity", "property"]);
            ensureRefersTo.its("entity").type("string");
            ensureRefersTo.its("property").type("string");
          }
          ensureColumn.its("isFormType").type("string");
          ensureColumn.its("hasValidator").type(["string", "boolean", "function", "undefined"]);
          ensureColumn.its("hasFormatter").type(["string", "boolean", "function", "undefined"]);
          ensureColumn.its("hasLabel").type(["string", "boolean", "undefined"]);
          ensureColumn.its("hasDescription").type(["string", "boolean", "undefined"]);
          ensureColumn.its("hasPlaceholder").type(["string", "boolean", "undefined"]);
        }
      }
      User: {
        this.onValidateTable(id, definition, schema);
      }
    }

    $validateColumnNative(id, definition, tableId, schema) {
      this.$trace("$validateColumnNative", arguments);
      Native: {
        // !@OK: the validation is already made on the $validateTableNative
      }
      User: {
        this.onValidateColumn(id, definition, tableId, schema);
      }
    }

    $fusionateSchemaNative(partialSchema) {
      this.$trace("$fusionateSchemaNative", arguments);
      Native_fusion: {
        
      }
      User_fusion: {
        this.onFusionateSchema(partialSchema);
      }
    }

    $fusionateTableNative(tableInfo, tableId, partialSchema) {
      this.$trace("$fusionateTableNative", arguments);
      Native_fusion: {
        const isKnown = tableId in this.$schema.hasTables;
        if(!isKnown) {
          this.$schema.hasTables[tableId] = tableInfo;
        } else {
          throw new Error(`Schema cannot fusionate table «${tableId}» to schema for second time on «$fusionateTableNative»`);
        }
      }
      User_fusion: {
        this.onFusionateTable(tableInfo, tableId, partialSchema);
      }
    }

    $fusionateColumnNative(columnInfo, columnId, tableId, partialSchema) {
      this.$trace("$fusionateColumnNative", arguments);
      Native_fusion: {
        const isKnown = columnId in this.$schema.hasTables[tableId].hasColumns;
        if(!isKnown) {
          this.$schema.hasTables[tableId].hasColumns[columnId] = columnInfo;
        } else {
          throw new Error(`Schema cannot fusionate column «${tableId}.${columnId}» to schema for second time on «$fusionateTableNative»`);
        }
      }
      User_fusion: {
        this.onFusionateColumn(columnInfo, columnId, tableId, partialSchema);
      }
    }

  };
  
  // Last global injection for a unique main instance:
  window.$lswSchema = LswSchema.create();
  // @code.end: LswSchema class
  
  return LswSchema;

});
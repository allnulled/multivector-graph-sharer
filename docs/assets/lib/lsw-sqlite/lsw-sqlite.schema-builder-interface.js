const LswSqlitePrototype_SchemaBuilderInterface = class extends LswSqlitePrototype_BasicInterface {

  sanitizeValue(val) {
    return "'" + ("" + val).replace(/'/g, "''") + "'";
  }

  sanitizeId(id) {
    return "`" + ("" + id).replace(/`/g, "") + "`";
  }

  validateSchemaObject(schema) {
    this.$trace("validateSchemaObject");
    $ensure.id({ "schema": schema }).type("object");
    const tableIds = Object.keys(schema);
    Iterating_tables:
    for (let indexTable = 0; indexTable < tableIds.length; indexTable++) {
      const tableId = tableIds[indexTable];
      const tableData = schema[tableId];
      const tablePath = `schema.${tableId}`;
      $ensure.id({ [tablePath]: tableData }).type("object");
      const columnIds = Object.keys(tableData);
      Iterating_columns:
      for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
        const columnId = columnIds[indexColumn];
        const columnPath = tablePath + `.${columnId}`;
        const columnData = tableData[columnId];
        const $ensureColumn = $ensure.id({ [columnPath]: columnData }).type(["object", "string"]);
        if (typeof columnData === "object") {
          $ensureColumn.to.have.key("type");
          const columnTypePath = columnPath + ".type";
          $ensure.id({ [columnTypePath]: columnData.type }).type("string").to.not.be.empty();
        }
      }
    }
  }

  fromSchemaObjectToSql(schema) {
    this.$trace("fromSchemaObjectToSql");
    this.validateSchemaObject(schema);
    const sqlSentences = [];
    const tableIds = Object.keys(schema);
    for (let indexTable = 0; indexTable < tableIds.length; indexTable++) {
      const tableId = tableIds[indexTable];
      sqlSentences.push(`CREATE TABLE ${tableId} (id INTEGER PRIMARY KEY AUTOINCREMENT);`);
      const columnIds = Object.keys(schema[tableId]);
      for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
        const columnId = columnIds[indexColumn];
        const columnData = schema[tableId][columnId];
        const columnCode = typeof columnData === 'string' ? columnData : columnData.code ?? columnData.type ?? 'varchar';
        sqlSentences.push(`ALTER TABLE ${tableId} ADD COLUMN ${columnId} ${columnCode};`);
      }
    }
    return sqlSentences;
  }

  synchronizeSchema(schema) {
    this.$trace("synchronizeSchema");
    this.validateSchemaObject(schema);
    const sentences = this.fromSchemaObjectToSql(schema);
    return this.executeSerie(sentences, true);
  }

  dropTable(table, silently = false) {
    this.$trace("dropTable");
    return this.exec(`DROP TABLE ${table};`, silently);
  }

  dropColumn(table, column, silently = false) {
    this.$trace("dropColumn");
    return this.exec(`ALTER TABLE ${table} DROP COLUMN ${column};`, silently);
  }

}

const LswSqlitePrototype_SchemaHandlerInterface = class extends LswSqlitePrototype_SchemaBuilderInterface {

  getSchema() {
    this.$trace("getSchema");
    const schema = {};
    const databaseSchema = this.getSchemaFromDatabase();
    const databaseMetaschema = this.getMetaschema();
    const allTables = LswUtils.getUniqueItemsFromLists(Object.keys(databaseSchema), Object.keys(databaseMetaschema));
    Iterating_tables:
    for (let indexTable = 0; indexTable < allTables.length; indexTable++) {
      const tableId = allTables[indexTable];
      if (!(tableId in databaseSchema)) {
        continue Iterating_tables;
      }
      const currentTableData = databaseSchema[tableId] || {};
      const newTableData = databaseMetaschema[tableId] || {};
      const allColumns = LswUtils.getUniqueItemsFromLists(Object.keys(currentTableData), Object.keys(newTableData));
      schema[tableId] = {};
      Iterating_columns:
      for (let indexColumn = 0; indexColumn < allColumns.length; indexColumn++) {
        const columnId = allColumns[indexColumn];
        const currentColumnData = databaseSchema[tableId][columnId] || {};
        const newColumnData = databaseSchema[tableId][columnId] || {};
        const finalColumnData = Object.assign({}, currentColumnData, newColumnData);
        schema[tableId][columnId] = finalColumnData;
      }
    }
    return schema;
  }

  getMetaschema() {
    this.$trace("getMetaschema");
    const metaschema = {};
    let metaschemaItems = [];
    try {
      metaschemaItems = LswSqlite.selectMany("database_properties", [
        ["name", "like", "schema.definition%"]
      ]);
    } catch (error) {
      // @BADLUCK @OK
    }
    const metaschemaItemsSorted = metaschemaItems.sort((a, b) => {
      if (a.name === "schema.definition.column") {
        return -1;
      }
      if (b.name === "schema.definition.column") {
        return 1;
      }
      return 0;
    });
    for (let indexItem = 0; indexItem < metaschemaItemsSorted.length; indexItem++) {
      const item = metaschemaItemsSorted[indexItem];
      if (item.name === "schema.definition.column") {
        Definir_columna_en_metaesquema: {
          const columnData = LswUtils.parseAsJsonOrReturn(item.value, []);
          const tableId = columnData.table;
          const columnId = columnData.column;
          if (!(tableId in metaschema)) {
            metaschema[tableId] = {};
          }
          if (!(columnId in metaschema[tableId])) {
            metaschema[tableId][columnId] = {};
          }
          delete columnData.table;
          delete columnData.column;
          metaschema[tableId][columnId] = Object.assign(metaschema[tableId][columnId], columnData);
        }
      }
    }
    return metaschema;
  }

  getSchemaFromDatabase() {
    this.$trace("getSchemaFromDatabase");
    let sqlForTables = "";
    sqlForTables += "SELECT name\n";
    sqlForTables += "  FROM sqlite_master\n";
    sqlForTables += "  WHERE type='table'\n";
    sqlForTables += "    AND name NOT LIKE 'sqlite_%'\n";
    const resultado = this.execute(sqlForTables);
    const tablas = resultado;
    const esquema = {};
    for (let index = 0; index < tablas.length; index++) {
      const tabla = tablas[index];
      const tablaId = tabla.name;
      let sqlForColumns = "";
      sqlForColumns += `PRAGMA table_info(${tablaId})`;
      const columnas = this.execute(sqlForColumns);
      esquema[tablaId] = columnas.reduce((out, col) => {
        out[col.name] = col;
        return out;
      }, {});
    }
    return esquema;
  }

};
/**
 * LSW-SQLITE is an implementation of ORM/Database Layer based on SQLite and targeting LSW applications.
 * 
 * 
 */

const LswSqlitePrototype_BasicInterface = class {

  static create(...args) {
    return new this(...args);
  }

  static defaultOptions = {
    openTypes: true,
    trace: (Vue?.prototype?.$lsw?.logger?.$options?.active ),
  }

  $trace(method) {
    if (this.$options.trace) {
      console.log(`[trace][lsw-sqlite] ${method}`);
    }
  }

  constructor(options = {}, databaseId = "sqlite_dataset_1") {
    this.$databaseId = databaseId;
    this.$sqlite3 = window.sqlite3;
    this.$database = new sqlite3.oo1.JsStorageDb("local");
    this.$options = Object.assign({}, this.constructor.defaultOptions, options);
    this.$errorHandler = false;
  }

  setErrorHandler(callback) {
    this.$errorHandler = callback;
  }

  async initialize() {
    try {
      await this.loadDatabase();
    } catch (error) {
      console.log(error);
    }
  }

  resetDatabase() {
    this.$trace("resetDatabase");
    this.$database = new sqlite3.oo1.JsStorageDb("local");
  }

  execute(sqlCode, silently = false) {
    this.$trace("execute");
    console.log("[sql] " + sqlCode);
    try {
      return this.$database.exec(sqlCode, {
        rowMode: "object"
      });
    } catch (error) {
      error.sqlCode = sqlCode;
      if (typeof this.$errorHandler === "function") {
        this.$errorHandler(error);
      }
      if (silently) {
        return error;
      }
      throw error;
    }
  }

  executeSerie(sqlList, silently = false) {
    const results = [];
    for (let index = 0; index < sqlList.length; index++) {
      const sqlCode = sqlList[index];
      const result = this.execute(sqlCode, silently);
      results.push(result);
    }
  }

  close() {
    this.$trace("close");
    this.$database.close();
  }

  async saveDatabase() {
    this.$trace("saveDatabase");
    const binarioPersistible = this.$sqlite3.capi.sqlite3_js_db_export(this.$database.pointer);
    const rows = await Vue.prototype.$lsw.database.selectMany("Banco_de_datos_principal", row => row.tiene_nombre === this.$databaseId);
    if (rows.length === 0) {
      await Vue.prototype.$lsw.database.insert("Banco_de_datos_principal", {
        tiene_nombre: this.$databaseId,
        tiene_datos: binarioPersistible,
      });
    } else {
      await Vue.prototype.$lsw.database.update("Banco_de_datos_principal", rows[0].id, {
        tiene_nombre: this.$databaseId,
        tiene_datos: binarioPersistible,
      });
    }
    return binarioPersistible;
  }

  async loadDatabase() {
    this.$trace("loadDatabase");
    try {
      const rows = await Vue.prototype.$lsw.database.selectMany("Banco_de_datos_principal", row => row.tiene_nombre === this.$databaseId);
      if (rows.length === 0) {
        return ":memory:";
      }
      const binario = rows[0].tiene_datos;
      const binarioLegible = binario instanceof Uint8Array ? binario : new Uint8Array(binario);
      const pDb = this.$database.pointer;
      const pData = this.$sqlite3.wasm.allocFromTypedArray(binarioLegible);
      this.$sqlite3.capi.sqlite3_deserialize(
        pDb,
        "main",
        pData,
        binarioLegible.length,
        binarioLegible.length,
        this.$sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE,
      );
      return binario;
    } catch (error) {
      console.log(error);
      // throw error;
    }
  }

};

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

const LswSqlitePrototype_CrudInterface = class extends LswSqlitePrototype_SchemaHandlerInterface {

  static sqlOperators = {
    ">": ">",
    ">=": ">=",
    "<": "<",
    "<=": "<=",
    "=": "=",
    "!=": "!=",
    "in": "IN",
    "not in": "NOT IN",
    "is null": "IS NULL",
    "is not null": "IS NOT NULL",
    "like": "LIKE",
    "not like": "NOT LIKE"
  }

  translateSqlOperator(op) {
    if (!(op in this.constructor.sqlOperators)) {
      throw new Error(`Invalid sql operator «${op}» on «LswSqlite.translateSqlOperator»`);
    }
    return this.constructor.sqlOperators[op];
  }

  translateSqlWhere(where) {
    this.$trace("translateSqlWhere");
    let sql = "";
    for (let indexWhere = 0; indexWhere < where.length; indexWhere++) {
      const whereRule = where[indexWhere];
      if (indexWhere !== 0) {
        sql += "\n  AND ";
      }
      const [subj, op, compl] = whereRule;
      sql += subj;
      sql += " ";
      sql += this.translateSqlOperator(op);
      if (["is null", "is not null"].indexOf(op) !== -1) {
        // @OK
      } else if (["in", "not in"].indexOf(op) !== -1) {
        if (!Array.isArray(compl)) {
          throw new Error(`Invalid complement for sql operator ${op} because it must be an array (${typeof compl}) on «LswSqlite.translateSqlWhere»`);
        }
        sql += " (";
        sql += compl.map(it => this.sanitizeValue(it)).join(",");
        sql += ")";
      } else {
        sql += " ";
        sql += this.sanitizeValue(compl);
      }
    }
    return sql ?? "1 = 1";
  }

  translateSqlOrderBy(orderBy) {
    this.$trace("translateSqlOrderBy");
    let sql = "";
    for (let indexOrder = 0; indexOrder < orderBy.length; indexOrder++) {
      const orderRule = orderBy[indexOrder];
      if (indexOrder !== 0) {
        sql += ",\n    ";
      }
      if (orderRule.startsWith("!")) {
        sql += `${orderRule.substr(1)} DESC`;
      } else {
        sql += `${orderRule} ASC`;
      }
    }
    return sql;
  }

  translateSqlInsertIntoKeys(item) {
    this.$trace("translateSqlInsertIntoKeys");
    const keys = Object.keys(item);
    let sql = "";
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      if (index !== 0) {
        sql += `,`;
      }
      sql += `\n  ${this.sanitizeId(key)}`;
    }
    return sql;
  }

  translateSqlInsertValues(item) {
    this.$trace("translateSqlInsertValues");
    const values = Object.values(item);
    let sql = "";
    for (let index = 0; index < values.length; index++) {
      const value = values[index];
      if (index !== 0) {
        sql += `,`;
      }
      sql += `\n  ${this.sanitizeValue(value)}`;
    }
    return sql;
  }

  translateSqlInsertValuesList(list) {
    this.$trace("translateSqlInsertValuesList");
    let sql = "";
    for (let indexList = 0; indexList < list.length; indexList++) {
      const item = list[indexList];
      const values = Object.values(item);
      if (indexList !== 0) {
        sql += `,`;
      }
      sql += "(";
      for (let indexProp = 0; indexProp < values.length; indexProp++) {
        const value = values[indexProp];
        if (indexProp !== 0) {
          sql += `,`;
        }
        sql += `\n  ${this.sanitizeValue(value)}`;
      }
      sql += "\n)";
    }
    return sql;
  }

  translateSqlUpdateValues(values) {
    this.$trace("translateSqlUpdateValues");
    const keys = Object.keys(values);
    let sql = "";
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const value = values[key];
      sql += index === 0 ? "" : ",";
      sql += `\n    ${key} = ${this.sanitizeValue(value)}`;
    }
    return sql;
  }

  // CRUD methods:

  selectAny(where = [], separingTypes = false) {
    this.$trace("selectAny");
    const allTypes = Object.keys(this.getSchema());
    let allResults = !separingTypes ? [] : {};
    for (let index = 0; index < allTypes.length; index++) {
      const oneType = allTypes[index];
      let sql = "";
      sql += `SELECT`;
      sql += `\n    *`;
      sql += `\n  FROM ${this.sanitizeId(oneType)}`;
      if (where && where.length) {
        sql += `\n  WHERE ${this.translateSqlWhere(where)}`;
      }
      const oneResult = this.execute("\n\n" + sql);
      const typedResult = oneResult.map(row => {
        row.$table = oneType;
        return row;
      })
      if (!separingTypes) {
        allResults = allResults.concat(typedResult);
      } else {
        allResults[oneType] = oneResult;
      }
    }
    return allResults;
  }

  selectMany(table, where = [], order = ["id"], limit = false) {
    this.$trace("selectMany");
    let sql = "";
    sql += `SELECT`;
    sql += `\n    *`;
    sql += `\n  FROM ${this.sanitizeId(table)}`;
    if (where && where.length) {
      sql += `\n  WHERE ${this.translateSqlWhere(where)}`;
    }
    if (order) {
      sql += `\n  ORDER BY ${this.translateSqlOrderBy(order)}`;
    }
    if (limit) {
      sql += `\n  LIMIT ${limit}`;
    }
    return this.execute("\n\n" + sql);
  }

  insertOne(table, item = {}) {
    this.$trace("insertOne");
    if (this.$options.openTypes === true) {
      const keys = Object.keys(item);
      this.synchronizeSchema({
        [table]: keys.reduce((out, key) => {
          out[key] = "varchar";
          return out;
        }, {})
      })
    }
    let sql = "";
    sql += `INSERT INTO ${table} (${this.translateSqlInsertIntoKeys(item)}`;
    sql += `\n) VALUES (${this.translateSqlInsertValues(item)}`;
    sql += `\n);\n`;
    return this.execute("\n\n" + sql);
  }
  insertMany(table, list = []) {
    this.$trace("insertMany");
    const item = list[0];
    if (this.$options.openTypes === true) {
      const keys = Object.keys(item);
      this.synchronizeSchema({
        [table]: keys.reduce((out, key) => {
          out[key] = "varchar";
          return out;
        }, {})
      })
    }
    let sql = "";
    sql += `INSERT INTO ${table} (${this.translateSqlInsertIntoKeys(item)}`;
    sql += `\n) VALUES `;
    sql += this.translateSqlInsertValuesList(list);
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }

  updateMany(table, where = [], values = {}) {
    this.$trace("updateMany");
    let sql = "";
    sql += `UPDATE ${table} SET ${this.translateSqlUpdateValues(values)}`;
    sql += `\n  WHERE ${this.translateSqlWhere(where)}`;
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }
  updateOne(table, id, values = {}) {
    this.$trace("updateOne");
    let sql = "";
    sql += `UPDATE ${table}`;
    sql += `\n  SET ${this.translateSqlUpdateValues(values)}`;
    sql += `\n  WHERE id = ${this.sanitizeValue(id)}`;
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }

  deleteOne(table, id) {
    this.$trace("deleteOne");
    let sql = "";
    sql += `DELETE FROM ${table}`;
    sql += `\n  WHERE id = ${this.sanitizeValue(id)}`;
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }
  deleteMany(table, where) {
    this.$trace("deleteMany");
    let sql = "";
    sql += `DELETE FROM ${table}`;
    sql += `\n  WHERE ${this.translateSqlWhere(where)}`;
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }

  // Convenient methods:

  selectOne(table, id, order = ["id"]) {
    this.$trace("selectOne");
    const resultados = this.selectMany(table, ["id", "=", id], order, 1);
    return resultados.length ? resultados[0] : false;
  }

  selectFirst(table, where = [], order = ["id"]) {
    this.$trace("selectFirst");
    const resultados = this.selectMany(table, where, order, 1);
    return resultados.length ? resultados[0] : false;
  }

  insert(table, itemOrList = []) {
    this.$trace("insert");
    if (Array.isArray(itemOrList)) {
      return this.insertMany(table, itemOrList);
    }
    return this.insertOne(table, itemOrList);
  }

  update(table, idOrWhere, values = {}) {
    this.$trace("update");
    if (Array.isArray(idOrWhere)) {
      return this.updateMany(table, idOrWhere, values);
    }
    return this.updateOne(table, idOrWhere, values);
  }

  delete(table, idOrWhere) {
    this.$trace("delete");
    if (Array.isArray(idOrWhere)) {
      return this.deleteMany(table, idOrWhere);
    }
    return this.delete(table, idOrWhere);
  }

};

(function() {



const jQliteLoader = class {

  constructor(jQlite) {
    this.jQlite = jQlite;
  }

};

const jQliteUtils = class {

  constructor() {
    
  }

};

const jQliteFormatter = class {

  constructor(jQlite) {
    this.jQlite = jQlite;
  }

  json() {
    return JSON.stringify(this.jQlite.$data);
  }

  data() {
    return this.jQlite.$data;
  }

  sql(table) {
    let sql = "";
    sql += "INSERT INTO " + table;
    return sql;
  }

};

class ArrayProxy {
  
  constructor(initial = []) {
      this.$data = Array.isArray(initial) ? initial.slice() : [];
  }

  get length() {
      return this.$data.length;
  }

  set length(val) {
      this.$data.length = val;
  }

  toArray() {
      return this.$data.slice();
  }

  toString() {
      return this.$data.toString();
  }

  toJSON() {
      return this.toArray();
  }

};

const mutables = [
  "copyWithin", "fill", "pop", "push", "reverse", "shift",
  "sort", "splice", "unshift"
];

const inmutables = [
  "concat", "includes", "indexOf", "join", "lastIndexOf",
  "slice", "toString", "toLocaleString", "entries",
  "every", "filter", "find", "findIndex", "flat", "flatMap",
  "forEach", "map", "reduce", "reduceRight", "some", "values", "keys", "at"
];

const new2023 = [
  "toReversed", "toSorted", "toSpliced", "with"
];

// Métodos mutables (modifican this.$data)
for (const method of mutables) {
  ArrayProxy.prototype[method] = function (...args) {
      return this.$data[method](...args);
  };
}

// Métodos inmutables (devuelven nuevo array o valor)
for (const method of inmutables.concat(new2023)) {
  ArrayProxy.prototype[method] = function (...args) {
      const resultado = this.$data[method](...args);
      this.setData(resultado);
      return this;
  };
}

const jQlitePrototype = class extends ArrayProxy {

  static create(...args) {
    return new this(...args);
  }

  static from = this.create;

  static defaultConfigurations = {
    trace: false,
  }

  trace() {
    if(this.$configurations.trace) {
      console.log("[trace][jqlite] " + methodId + " ");
    }
  }

  constructor(...args) {
    super(...args);
    this.$data = [];
    this.$formatters = new jQliteFormatter(this);
    this.$configurations = {};
  }

  getDatabase() {
    this.trace("getDatabase");
    return LswSqlite;
  }

  setData(data) {
    this.trace("setData");
    if(!(Array.isArray(data))) {
      throw new Error(`Required parameter «data» to be an array on «jQlite.setData»`);
    }
    this.$data = data;
    return this;
  }

  getData() {
    return this.$data;
  }

  addConfigurations(configurations = {}) {
    this.trace("addConfigurations");
    Object.assign(this.$configurations, configurations);
    return this;
  }

  addFormatter(id, callback) {
    this.trace("addFormatter");
    this.$formatters[id] = callback.bind(this);
    return this;
  }

  removeFormatter(id) {
    this.trace("removeFormatter");
    delete this.$formatters[id];
    return this;
  }

  action(actionData) {
    this.trace("action");
    if(!(actionData.op in this)) {
      throw new Error("Method «${actionData.op}» was not found on «jQlite.action»");
    }
    return this[actionData.op](actionData);
  }

  schema() {
    this.trace("schema");
    return LswSqlite.getSchema();
  }

  get to() {
    this.trace("to");
    return this.$formatters;
  }

  omit(props = []) {
    this.trace("omit");
    for(let index=0; index<this.$data.length; index++) {
      const row = this.$data[index];
      for(let indexProp=0; indexProp<props.length; indexProp++) {
        const propId = props[indexProp];
        delete row[propId];
      }
    }
    return this;
  }

  allow(props = [], defaultValue = undefined) {
    this.trace("allow");
    let output = [];
    for(let index=0; index<this.$data.length; index++) {
      const row = this.$data[index];
      const newRow = {};
      for(let indexProp=0; indexProp<props.length; indexProp++) {
        const propId = props[indexProp];
        newRow[propId] = row[propId] || defaultValue;
      }
      output.push(newRow);
    }
    this.$data = output;
    return this;
  }

  extract(propId) {
    this.trace("extract");
    let output = [];
    for(let index=0; index<this.$data.length; index++) {
      const row = this.$data[index];
      const newRow = row[propId];
      output.push(newRow);
    }
    this.$data = output;
    return this;
  }

  ids() {
    this.trace("ids");
    return this.extract("id");
  }

  select(actionData) {
    this.trace("select");
    // @TODO...
    const { table, where, sort = ["!id"] } = actionData;
    return LswSqlite.select(table, where, sort);
  }

  insert(actionData) {
    this.trace("insert");
    // @TODO...
    const { table, value } = actionData;
    return LswSqlite.insert(table, value);
  }

  update(actionData) {
    this.trace("update");
    // @TODO...
    const { table, where, value } = actionData;
    return LswSqlite.update(table, where, value);
  }

  delete(actionData) {
    this.trace("delete");
    // @TODO...
    const { table, where } = actionData;
    return LswSqlite.delete(table, where);
  }

  randomized(...args) {
    this.trace("randomized");
    let id = 0;
    const output = LswRandomizer.getRandomObject(...args).map(row => {
      return Object.assign(row, {
        id: id++
      });
    });
    return this.setData(output);
  }

  datify() {
    return this.to.data();
  }

  jsonify() {
    return this.to.json();
  }

  sqlize() {
    return this.to.sql();
  }

};

const jQliteFactory = function() {
  return new jQlitePrototype();
}

window.jQlite = jQliteFactory();
window.$ = window.jQlite;


})();

const LswSqlitePrototype = class extends LswSqlitePrototype_CrudInterface { };

const LswSqlite = LswSqlitePrototype.create();

// @ATTENTION: sip, hay un asíncroner aquí.
await LswSqlite.initialize();

window.LswSqlite = LswSqlite;


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
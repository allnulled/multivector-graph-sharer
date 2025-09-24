(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window["Browsie"] = mod;
  }
  if (typeof global !== 'undefined') {
    // global["Browsie"] = mod;
  }
  if (typeof module !== 'undefined') {
    // module.exports = mod;
  }
})(function () {


  /**
   * 
   * 
   * @$section: Lsw Database API » LswDatabase class
   * @type: class
   * @extends: Object
   * @vendor: lsw
   * @namespace: LswDatabase
   * @source code: La clase está definida así:
   * 
   */
  // @code.start: LswDatabase class | @section: Lsw Database API » LswDatabase class
  class BrowsieCheckersAPI {

    static mustBeString(obj, method = "Browsie.mustBeString", id = "?") {
      if (typeof obj !== "string") {
        throw new Error(`Required «${id}» to be a string on «${method}»`);
      }
    }

    static mustBeArray(obj, method = "Browsie.mustBeArray", id = "?") {
      if (!Array.isArray(obj)) {
        throw new Error(`Required «${id}» to be an array on «${method}»`);
      }
    }

    static mustBeObject(obj, method = "Browsie.mustBeObject", id = "?") {
      if (typeof obj !== "object") {
        throw new Error(`Required «${id}» to be an object on «${method}»`);
      }
    }

    static mustBeGreaterThan(obj, comparison = 0, method = "Browsie.mustBeObject", id = "?") {
      if (obj <= comparison) {
        throw new Error(`Required «${id}» to be greater than «${comparison}» on «${method}»`);
      }
    }
  }

  class BrowsieStaticAPI extends BrowsieCheckersAPI {

    static openedConnections = [];

    static _trace = true;

    static trace(methodName, args = []) {
      // @INJECTION: from LSW
      const traceActivatedGlobally = (typeof Vue === "undefined") || (typeof Vue.prototype.$lsw === "undefined") || ((typeof Vue !== "undefined") && (typeof Vue.prototype.$lsw !== "undefined") && (Vue.prototype.$lsw.logger.$options.active));
      if (this._trace && traceActivatedGlobally) {
        console.log("[browsie][" + methodName + "]", args.length + " args: " + Array.from(args).map(arg => typeof (arg)).join(", "));
      }
    }

    static async listDatabases() {
      this.trace("Browsie.listDatabases", arguments);
      try {
        const databases = await indexedDB.databases();
        console.log('Bases de datos disponibles:', databases);
        return databases;
      } catch (error) {
        console.error('Error al obtener las bases de datos:', error);
      }
    }

    static createDatabase(dbName, schemaDefinition = null, version = 1, versionUpgrades = {}) {
      this.trace("Browsie.createDatabase", arguments);
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);
        request.onsuccess = () => {
          console.log(`[SUCCESS] Database "${dbName}" created/opened successfully.`);
          request.result.close();
          resolve(request.result);
        };
        request.onerror = (error) => {
          console.error(`[ERROR] Failed to create/open database "${dbName}":`, error);
          reject(error);
        };
        request.onupgradeneeded = async (event) => {
          const db = event.target.result;
          console.log(`[UPGRADE] Upgrading database "${dbName}" from version ${event.oldVersion} to ${version}.`);
          // Si hay una definición de esquema inicial, crear los almacenes e índices
          if (schemaDefinition && event.oldVersion === 0) {
            console.log("[SCHEMA] Applying initial schema definition.");
            Object.keys(schemaDefinition).forEach((storeName) => {
              if (!db.objectStoreNames.contains(storeName)) {
                const objectStore = db.createObjectStore(storeName, {
                  keyPath: "id",
                  autoIncrement: true,
                });
                if (!Array.isArray(schemaDefinition[storeName])) {
                  console.log(schemaDefinition);
                  throw new Error(`Required property «schemaDefinition.${storeName}» to be an array on «LswDatabase.createDatabase»`);
                }
                schemaDefinition[storeName].forEach((index) => {
                  const indexName = index.replace(/^\!/, "");
                  objectStore.createIndex(indexName, indexName, {
                    unique: index.startsWith("!")
                  });
                });
              }
            });
          }
          // Aplicar las transformaciones de esquema para cada versión
          for (let v = event.oldVersion + 1; v <= version; v++) {
            if (versionUpgrades[v]) {
              console.log(`[VERSION ${v}] Applying upgrade function.`);
              await versionUpgrades[v](db);
            } else {
              console.log(`[VERSION ${v}] No upgrade function defined.`);
            }
          }
        };
      });
    }

    static async exportDatabase(dbName) {
      this.trace("Browsie.exportDatabase", arguments);
      const schema = await this.getSchema(dbName);
      const storeIds = Object.keys(schema);
      const allData = {};
      for(let indexStore=0; indexStore<storeIds.length; indexStore++) {
        const storeId = storeIds[indexStore];
        const storeData = await this.getAllDataFromStore(dbName, storeId);
        allData[storeId] = storeData;
      }
      return allData;
    }

    static async importToDatabase(dbName, storesData = {}) {
      this.trace("Browsie.importToDatabase", arguments);
      const storeIds = Object.keys(storesData);
      const connection = await this.open(dbName);
      for(let indexStore=0; indexStore<storeIds.length; indexStore++) {
        const storeId = storeIds[indexStore];
        const allData = storesData[storeId];
        console.log(`[*] Importing store «${storeId}»`);
        await connection.insertMany(storeId, allData);
      }
    }

    // Obtener todos los datos de un store
    static async getAllDataFromStore(dbName, storeName) {
      this.trace("Browsie.getAllDataFromStore", arguments);
      return await new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);

          const getAllRequest = store.getAll();
          getAllRequest.onsuccess = () => resolve(getAllRequest.result);
          getAllRequest.onerror = () => {
            db.close();
            reject(new Error('Error al obtener los datos del store'));
          };
        };

        request.onerror = () => {
          reject(new Error('Error al abrir la base de datos'));
        };
      });
    }

    // Insertar datos en un store
    static async insertDataIntoStore(dbName, storeName, data) {
      this.trace("Browsie.insertDataIntoStore", arguments);
      return await new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(storeName, 'readwrite');
          const store = transaction.objectStore(storeName);

          data.forEach(item => store.add(item));

          transaction.oncomplete = () => resolve();
          transaction.onerror = () => {
            db.close();
            reject(new Error('Error al insertar los datos en el store'));
          };
        };

        request.onerror = () => {
          reject(new Error('Error al abrir la base de datos'));
        };
      });
    }

    // Eliminar una base de datos
    static deleteDatabase(dbName) {
      this.trace("Browsie.deleteDatabase", arguments);
      return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(dbName);

        request.onblocked = () => {
          // db.close();
          reject(new Error("Error al eliminar la base de datos porque está bloqueada"));
        };
        request.onsuccess = () => resolve();
        request.onerror = () => {
          // db.close();
          reject(new Error('Error al eliminar la base de datos'));
        };
      }).then(() => {
        console.log(`[!] Base de datos «${dbName}» eliminada correctamente.`);
      });
    }

    static async getSchema(dbName) {
      this.trace("Browsie.getSchema", arguments);
      let db = undefined;
      try {
        // Abrir la base de datos en modo solo lectura
        const request = indexedDB.open(dbName);

        db = await new Promise((resolve, reject) => {
          request.onsuccess = (event) => resolve(event.target.result);
          request.onerror = () => {
            reject(new Error('Error al abrir la base de datos'));
          };
        });

        // Construir el esquema a partir de los almacenes
        const schema = {};
        const objectStoreNames = Array.from(db.objectStoreNames); // Lista de stores

        objectStoreNames.forEach(storeName => {
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);

          const storeInfo = {
            keyPath: store.keyPath,
            autoIncrement: store.autoIncrement,
            indexes: []
          };

          // Recorrer los índices del store
          const indexNames = Array.from(store.indexNames); // Lista de índices
          indexNames.forEach(indexName => {
            const index = store.index(indexName);
            storeInfo.indexes.push({
              name: index.name,
              keyPath: index.keyPath,
              unique: index.unique,
              multiEntry: index.multiEntry
            });
          });

          schema[storeName] = storeInfo;
        });

        return schema;
      } catch (error) {
        console.error('Error al obtener el esquema:', error);
        throw error;
      } finally {
        if (db) {
          db.close();
        }
      }
    }

    static async pickRow(databaseId, tableId, rowId) {
      this.trace("Browsie.pickRow", arguments);
      $ensure(databaseId).type("string");
      $ensure(tableId).type("string");
      $ensure(rowId).type("number");
      let connection = undefined;
      try {
        connection = await this.open(databaseId);
        const rows = await connection.selectMany(tableId, v => v.id === rowId);
        if (rows.length === 1) {
          return rows[0];
        } else if (rows.length === 0) {
          return undefined;
        }
      } catch (error) {
        throw error;
      } finally {
        try {
          await connection.close();
        } catch (error) {
          console.log("Could not close connection on picking row");
        }
      }
    }

  }

  class BrowsieTriggersAPI extends BrowsieStaticAPI {

    static globMatch = TriggersClass.globMatch;

    triggers = new TriggersClass();

  }


  class BrowsieCrudAPI extends BrowsieTriggersAPI {

    static async open(...args) {
      this.trace("Browsie.open", arguments);
      const db = new this(...args);
      await db.open();
      return db;
    }

    // Constructor que abre la base de datos
    constructor(dbName, trace = false) {
      super();
      this.$dbName = dbName;
      this.$db = null;
      this.$innerSchema = null;
      this._trace = trace;
    }

    getInnerSchema() {
      this.constructor.trace("browsie.getInnerSchema", arguments);
      return this.$innerSchema;
    }

    setInnerSchema(innerSchema) {
      this.constructor.trace("browsie.setInnerSchema", arguments);
      if (!(innerSchema instanceof LswSchema)) {
        throw new Error(`Required parameter «innerSchema» to be an instance of LswSchema on «browsie.setInnerSchema»`);
      }
      this.$innerSchema = innerSchema;
    }

    // Abre la base de datos
    open() {
      this.constructor.trace("browsie.open", arguments);
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.$dbName);

        request.onsuccess = () => {
          this.$db = request.result;
          resolve(this.$db);
        };
        request.onerror = (error) => reject(this._expandError(error, `Error on «browsie.open» operation over database «${this.$dbName}»: `));
      });
    }

    close(...args) {
      this.constructor.trace("browsie.close", arguments);
      return this.$db.close(...args);
    }

    // Método para seleccionar 1 elemento de un store con un filtro
    select(store, filter = {}) {
      this.constructor.trace("browsie.select", arguments);
      this.triggers.emit(`crud.select.one.${store}`, { store, filter });
      return new Promise((resolve, reject) => {
        const transaction = this.$db.transaction(store, 'readonly');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.getAll();
        request.onsuccess = () => {
          const result = request.result.filter(item => {
            return Object.keys(filter).every(key => item[key] === filter[key]);
          });
          resolve(result);
        };
        request.onerror = (error) => reject(this._expandError(error, `Error on «browsie.select» operation over store «${store}»: `));
      });
    }

    // Método para insertar un solo item en un store
    insert(store, item) {
      this.constructor.trace("browsie.insert", arguments);
      this.triggers.emit(`crud.insert.one.${store}`, { store, item });
      return new Promise((resolve, reject) => {
        const transaction = this.$db.transaction(store, 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (error) => reject(this._expandError(error, `Error on «browsie.insert» operation over store «${store}»: `));
      });
    }

    // Método para actualizar un item en un store
    update(store, id, item) {
      this.constructor.trace("browsie.update", arguments);
      this.triggers.emit(`crud.update.one.${store}`, { store, id, item });
      return new Promise((resolve, reject) => {
        const transaction = this.$db.transaction(store, 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.put({ ...item, id });

        request.onsuccess = () => resolve(request.result);
        request.onerror = (error) => reject(this._expandError(error, `Error on «browsie.update» operation over store «${store}»: `));
      });
    }

    // Método tipo upsert: que cambia solo los campos que le proporcionas (hace entre 1 y 2 queries)
    async overwrite(store, idOrItem, item) {
      this.constructor.trace("browsie.overwrite", arguments);
      this.triggers.emit(`crud.overwrite.one.${store}`, { store, idOrItem, item });
      const isId = (typeof idOrItem === "string") || (typeof idOrItem === "number");
      const isItem = typeof idOrItem === "object";
      let previousItem = undefined;
      if (isItem) {
        previousItem = idOrItem;
      } else if (isId) {
        const matches = await this.select(store, it => it.id === idOrItem);
        if (matches.length === 0) {
          throw new Error(`Zero rows on overwrite operator. Cannot overwrite a row that does not exist on «browsie.overwrite»`);
        } else if (matches.length > 1) {
          throw new Error(`Multiple rows on overwrite operation. Cannot overwrite multiple rows. Ensure store «${store}» is using index «id» as unique value to complete this operation`);
        }
        previousItem = matches[0];
      } else {
        throw new Error(`Required parameter «idOrItem» to be a string or an object on «browsie.overwrite»`);
      }
      const newItem = Object.assign({}, previousItem, item);
      return await this.update(store, newItem.id, newItem);
    }

    // Método para eliminar un item de un store por ID
    delete(store, id) {
      this.constructor.trace("browsie.delete", arguments);
      this._ensureIntegrity(store, id);
      this.triggers.emit(`crud.delete.one.${store}`, { store, id });
      return new Promise((resolve, reject) => {
        const transaction = this.$db.transaction(store, 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (error) => reject(this._expandError(error, `Error on «browsie.delete» operation over store «${store}»: `));
      });
    }

    _getSchemaEntityByStoreName(store) {
      this.constructor.trace("browsie._ensureIntegrity", arguments);
      const innerSchema = this.getInnerSchema().$schema;
      const tableIds = Object.keys(innerSchema.hasTables);
      Iterating_tables:
      for (let indexTables = 0; indexTables < tableIds.length; indexTables++) {
        const tableId = tableIds[indexTables];
        if (tableId === store) {
          return innerSchema.hasTables[tableId];
        }
      }
      return undefined;
    }

    _ensureIntegrity(store, id) {
      this.constructor.trace("browsie._ensureIntegrity", arguments);
      const innerSchema = this.getInnerSchema().$schema;
      const tableIds = Object.keys(innerSchema.hasTables);
      const sourceEntity = innerSchema.hasTables[store];
      const sourceEntityId = sourceEntity.hasEntityId;
      const boundColumns = [];
      Iterating_tables:
      for (let indexTables = 0; indexTables < tableIds.length; indexTables++) {
        const tableId = tableIds[indexTables];
        const tableData = innerSchema.hasTables[tableId];
        const columnIds = Object.keys(tableData.hasColumns);
        Iterating_columns:
        for (let indexColumns = 0; indexColumns < columnIds.length; indexColumns++) {
          const columnId = columnIds[indexColumns];
          const columnData = tableData.hasColumns[columnId];
          When_it_has_references: {
            if (!columnData.refersTo) {
              break When_it_has_references;
            }
            const { entity: schemaEntityId, property: entityColumnId, constraint = true } = columnData.refersTo;
            if (!constraint) {
              break When_it_has_references;
            }
            const isSameEntity = schemaEntityId === sourceEntityId;
            if (!isSameEntity) {
              break When_it_has_references;
            }
            boundColumns.push({
              source: [store, entityColumnId],
              mustCheck: [tableId, columnId]
            });
          }
        }
      }
      console.log(`BOUND COLUMNS to ${store}:`, boundColumns);
    }

    _expandError(errorObject, baseMessage = false) {
      this.constructor.trace("browsie._expandError", arguments);
      let error = errorObject;
      if (errorObject instanceof Error) {
        error = errorObject;
      } else if (errorObject.target && errorObject.target.error) {
        error = errorObject.target.error;
      } else {
        error = new Error(errorObject);
      }
      if (baseMessage) {
        const errorTemp = new Error(error.message ?? error);
        Object.assign(errorTemp, error);
        errorTemp.message = baseMessage + errorTemp.message;
        error = errorTemp;
      }
      return error;
    }

    // Método para seleccionar elementos de un store con un filtro
    select(store, filter) {
      this.constructor.trace("browsie.select", arguments);
      this.triggers.emit(`crud.select.one.${store}`, { store, filter });
      return new Promise((resolve, reject) => {
        const transaction = this.$db.transaction(store, 'readonly');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.getAll();

        request.onsuccess = () => {
          const result = request.result.filter(item => {
            try {
              return filter(item);
            } catch (error) {
              console.error("Error arised from filter callback on «browsie.select»", error);
              return false;
            }
          });
          resolve(result);
        };
        request.onerror = (error) => reject(this._expandError(error, `Error on «browsie.select» operation over store «${store}»: `));
      });
    }

    selectMany(store, filterFn = i => true) {
      this.constructor.trace("browsie.selectMany", arguments);
      this.triggers.emit(`crud.select.many.${store}`, { store, filterFn });
      return new Promise((resolve, reject) => {
        const transaction = this.$db.transaction(store, 'readonly');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.openCursor(); // Usa cursor para recorrer la BD sin cargar todo en memoria
        const results = [];
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            let isAccepted = undefined;
            try {
              isAccepted = filterFn(cursor.value);
            } catch (error) {
              console.error(`Silent error arised from filter callback on «browsie.selectMany» against store «${store}»`, error);
            }
            if (isAccepted) { // Aplica la función de filtro
              results.push(cursor.value);
            }
            cursor.continue(); // Avanza al siguiente registro
          } else {
            resolve(results); // Se terminó el recorrido
          }
        };
        request.onerror = (error) =>
          reject(this._expandError(error, `Error on «browsie.selectMany» operation over store «${store}»: `));
      });
    }

    // Método para insertar varios items en un store
    insertMany(store, items) {
      this.constructor.trace("browsie.insertMany", arguments);
      this.triggers.emit(`crud.insert.many.${store}`, { store, items });
      this.constructor.mustBeString(store, "insertMany", "arguments[0]");
      this.constructor.mustBeArray(items, "insertMany", "arguments[1]");
      return new Promise((resolve, reject) => {
        if (items.length === 0) {
          return resolve(false);
        }
        const transaction = this.$db.transaction(store, 'readwrite');
        const objectStore = transaction.objectStore(store);
        let insertedCount = 0;
        items.forEach(item => {
          const request = objectStore.add(item);
          request.onsuccess = () => {
            insertedCount++;
            if (insertedCount === items.length) resolve();
          };
          request.onerror = (error) => reject(this._expandError(error, `Error on «browsie.insertMany» operation over store «${store}» inserting «${items.length}» items: `));
        });
      });
    }

    // Método para actualizar varios items en un store
    updateMany(store, filter, item) {
      this.constructor.trace("browsie.updateMany", arguments);
      this.triggers.emit(`crud.update.many.${store}`, { store, filter, item });
      return new Promise((resolve, reject) => {
        const transaction = this.$db.transaction(store, 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.openCursor();
        let updatedCount = 0;
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            if (Object.keys(filter).every(key => cursor.value[key] === filter[key])) {
              const updatedItem = { ...cursor.value, ...item };
              const updateRequest = cursor.update(updatedItem);
              updateRequest.onsuccess = () => {
                updatedCount++;
                if (updatedCount === cursor.value.length) resolve();
              };
            }
            cursor.continue();
          }
        };

        request.onerror = (error) => reject(this._expandError(error, `Error on «browsie.updateMany» operation over store «${store}»: `));
      });
    }

    // Método a tipo upsertAll para llenar los valores pero dejar los que no
    async overwriteMany(store, filter, item) {
      this.constructor.trace("browsie.overwriteMany", arguments);
      this.triggers.emit(`crud.overwrite.many.${store}`, { store, filter, item });
      const allMatches = await this.selectMany(store, filter);
      const allResults = [];
      for (let indexRow = 0; indexRow < allMatches.length; indexRow++) {
        const row = allMatches[indexRow];
        const result = await this.overwrite(store, row, item);
        allResults.push(result);
      }
      return allResults;
    }

    // Método para eliminar varios items de un store según un filtro
    deleteMany(store, filterCallback) {
      this.constructor.trace("browsie.deleteMany", arguments);
      this.triggers.emit(`crud.delete.many.${store}`, { store, filterCallback });
      return new Promise((resolve, reject) => {
        const transaction = this.$db.transaction(store, 'readwrite');
        const objectStore = transaction.objectStore(store);
        const request = objectStore.openCursor();
        let deletedCount = 0;
        request.onsuccess = () => {
          const cursor = request.result;
          if (!cursor) {
            return resolve();
          }
          const isAccepted = filterCallback(cursor.value);
          if (isAccepted) {
            const deleteRequest = cursor.delete();
            deleteRequest.onsuccess = () => {
              deletedCount++;
              if (deletedCount === cursor.value.length) {
                return resolve();
              }
            };
            deleteRequest.onerror = (error) => reject(this._expandError(error, `Error on «browsie.deleteMany» operation over store «${store}» and id «${cursor.value.id}»: `));
          }
          cursor.continue();
        };
        request.onerror = (error) => reject(this._expandError(error, `Error on «browsie.deleteMany» operation over store «${store}»: `));
      });
    }
  }

  // @TOCONTINUEFROM
  class BrowsieMigration {

    static from(...args) {
      return new this(...args);
    }

    static createTable(arg) {
      return this.from({
        operation: "createTable",
        parameters: arg
      });
    }

    static renameTable(arg) {
      return this.from({
        operation: "renameTable",
        parameters: arg
      });
    }

    static deleteTable(arg) {
      return this.from({
        operation: "deleteTable",
        parameters: arg
      });
    }

    static createColumn(arg) {
      return this.from({
        operation: "createColumn",
        parameters: arg
      });
    }

    static renameColumn(arg) {
      return this.from({
        operation: "renameColumn",
        parameters: arg
      });
    }

    static deleteColumn(arg) {
      return this.from({
        operation: "deleteColumn",
        parameters: arg
      });
    }

    constructor(options = {}) {
      LswDatabase.trace("LswDatabaseMigration.constructor");
      const { operation, parameters } = options;
      this.$validateOperation(operation);
      this.$validateParameters(parameters);
      this.operation = operation;
      this.parameters = parameters;
      this.config = {
        temporaryDatabase: this.parameters.fromDatabase + "_" + this.$getRandomString(5),
      };
      this.migrated = false;
    }

    $getRandomString(len = 10) {
      LswDatabase.trace("LswDatabaseMigration.$getRandomString");
      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      let out = "";
      while (out.length < len) {
        out += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      return out;
    };

    $validateOperation(operation) {
      LswDatabase.trace("LswDatabaseMigration.$validateOperation");
      if (["createTable", "renameTable", "deleteTable", "createColumn", "renameColumn", "deleteColumn", "cloneDatabase", "moveDatabase"].indexOf(operation) === -1) {
        throw new Error("Required «operation» to be a valid operation on «LswDatabaseMigration.$validateOperation»");
      }
    }

    $validateParameters(parameters) {
      LswDatabase.trace("LswDatabaseMigration.$validateParameters");
      if (typeof parameters !== "object") {
        throw new Error("Required «parameters» to be an object on «LswDatabaseMigration.$validateParameters»");
      }
    }

    async $$transferBackTemporaryDatabase() {
      await LswDatabase.deleteDatabase(this.parameters.fromDatabase);
      await this.$replicateSchema({
        fromDatabase: this.config.temporaryDatabase,
        toDatabase: this.parameters.fromDatabase,
      });
      await this.$populateDatabase({
        fromDatabase: this.config.temporaryDatabase,
        toDatabase: this.parameters.fromDatabase,
      });
      await LswDatabase.deleteDatabase(this.config.temporaryDatabase);
    }

    commit() {
      LswDatabase.trace("LswDatabaseMigration.commit");
      return this["$$" + this.operation].call(this).finally(() => {
        this.migrated = true;
      });
    }

    $validateCreateTableParameters() {
      LswDatabase.trace("LswDatabaseMigration.$validateCreateTableParameters");
      if (typeof this.parameters.fromDatabase !== "string") {
        throw new Error("Required «parameters.fromDatabase» to be a string on «LswDatabaseMigration.$validateCreateTableParameters»");
      }
      if (typeof this.parameters.table !== "string") {
        throw new Error("Required «parameters.table» to be a string on «LswDatabaseMigration.$validateCreateTableParameters»");
      }
      if (typeof this.parameters.tableDefinition !== "object") {
        throw new Error("Required «parameters.tableDefinition» to be an object on «LswDatabaseMigration.$validateCreateTableParameters»");
      }
    }

    async $$cloneDatabase() {
      LswDatabase.trace("LswDatabaseMigration.$$cloneDatabase");
      await this.$replicateSchema({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.parameters.toDatabase,
      });
      await this.$populateDatabase({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.parameters.toDatabase,
      });
    }

    async $$moveDatabase() {
      LswDatabase.trace("LswDatabaseMigration.$$moveDatabase");
      await this.$replicateSchema({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.parameters.toDatabase,
      });
      await this.$populateDatabase({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.parameters.toDatabase,
      });
      await LswDatabase.deleteDatabase(this.parameters.fromDatabase);
    }

    async $$createTable() {
      LswDatabase.trace("LswDatabaseMigration.$$createTable");
      this.$validateCreateTableParameters();
      await this.$replicateSchema({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onAlterSchema: schema => {
          schema[this.parameters.table] = this.parameters.tableDefinition;
          return schema;
        },
      });
      await this.$populateDatabase({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onMapTableId: false,
        onMapColumnId: false,
      });
      await this.$$transferBackTemporaryDatabase();
    }

    $validateDeleteTableParameters() {
      LswDatabase.trace("LswDatabaseMigration.$validateDeleteTableParameters");
      if (typeof this.parameters.fromDatabase !== "string") {
        throw new Error("Required «parameters.fromDatabase» to be a string on «LswDatabaseMigration.$validateDeleteTableParameters»");
      }
      if (typeof this.parameters.table !== "string") {
        throw new Error("Required «parameters.table» to be a string on «LswDatabaseMigration.$validateDeleteTableParameters»");
      }
    }

    async $$deleteTable() {
      LswDatabase.trace("LswDatabaseMigration.$$deleteTable");
      this.$validateDeleteTableParameters();
      await this.$replicateSchema({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onAlterSchema: schema => {
          delete schema[this.parameters.table];
          return schema;
        },
      });
      await this.$populateDatabase({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onMapTableId: false,
        onMapColumnId: false,
      });
      await this.$$transferBackTemporaryDatabase();
    }

    $validateRenameTableParameters() {
      LswDatabase.trace("LswDatabaseMigration.$validateRenameTableParameters");
      if (typeof this.parameters.fromDatabase !== "string") {
        throw new Error("Required «parameters.fromDatabase» to be a string on «LswDatabaseMigration.$validateDeleteTableParameters»");
      }
      if (typeof this.parameters.tableSource !== "string") {
        throw new Error("Required «parameters.tableSource» to be a string on «LswDatabaseMigration.$validateDeleteTableParameters»");
      }
      if (typeof this.parameters.tableDestination !== "string") {
        throw new Error("Required «parameters.tableDestination» to be a string on «LswDatabaseMigration.$validateDeleteTableParameters»");
      }
    }

    async $$renameTable() {
      LswDatabase.trace("LswDatabaseMigration.$$renameTable");
      this.$validateRenameTableParameters();
      const currentSchema = await LswDatabase.getSchema(this.parameters.fromDatabase);
      await this.$replicateSchema({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onAlterSchema: schema => {
          delete schema[this.parameters.tableSource];
          const tableInput = this.$adaptSchemaTableAsSchemaDefinition(currentSchema[this.parameters.tableSource]);
          schema[this.parameters.tableDestination] = tableInput;
          return schema;
        },
      });
      await this.$populateDatabase({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onMapTableId: tableId => {
          return this.parameters.tableDestination;
        },
        onMapColumnId: false,
      });
      await this.$$transferBackTemporaryDatabase();
    }

    $validateCreateColumnParameters() {
      LswDatabase.trace("LswDatabaseMigration.$validateCreateColumnParameters");
      if (typeof this.parameters.fromDatabase !== "string") {
        throw new Error("Required «parameters.fromDatabase» to be a string on «LswDatabaseMigration.$validateCreateColumnParameters»");
      }
      if (typeof this.parameters.table !== "string") {
        throw new Error("Required «parameters.table» to be a string on «LswDatabaseMigration.$validateCreateColumnParameters»");
      }
      if (typeof this.parameters.column !== "string") {
        throw new Error("Required «parameters.column» to be a string on «LswDatabaseMigration.$validateCreateColumnParameters»");
      }
      if (typeof this.parameters.columnDefinition !== "object") {
        throw new Error("Required «parameters.columnDefinition» to be an object on «LswDatabaseMigration.$validateCreateColumnParameters»");
      }
    }

    async $$createColumn() {
      LswDatabase.trace("LswDatabaseMigration.$$createColumn");
      this.$validateCreateColumnParameters();
      const isUnique = !!this.parameters.columnDefinition.isUnique;
      const columnSymbol = `${isUnique ? "!" : ""}${this.parameters.column}`;
      await this.$replicateSchema({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        table: this.parameters.table,
        onAlterSchema: schema => {
          schema[this.parameters.table].push(columnSymbol);
          return schema;
        },
      });
      await this.$populateDatabase({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onMapTableId: false,
        onMapColumnId: false,
      });
      await this.$$transferBackTemporaryDatabase();
    }

    $validateDeleteColumnParameters() {
      LswDatabase.trace("LswDatabaseMigration.$validateDeleteColumnParameters");
      if (typeof this.parameters.fromDatabase !== "string") {
        throw new Error("Required «parameters.fromDatabase» to be a string on «LswDatabaseMigration.$validateDeleteColumnParameters»");
      }
      if (typeof this.parameters.table !== "string") {
        throw new Error("Required «parameters.table» to be a string on «LswDatabaseMigration.$validateDeleteColumnParameters»");
      }
      if (typeof this.parameters.column !== "string") {
        throw new Error("Required «parameters.column» to be a string on «LswDatabaseMigration.$validateDeleteColumnParameters»");
      }
    }

    async $$deleteColumn() {
      LswDatabase.trace("LswDatabaseMigration.$$deleteColumn");
      this.$validateDeleteColumnParameters();
      await this.$replicateSchema({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onAlterSchema: schema => {
          console.log(schema);
          const columnPosition = schema[this.parameters.table].indexOf(this.parameters.column);
          schema[this.parameters.table].splice(columnPosition, 1);
          return schema;
        },
      });
      await this.$populateDatabase({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        // !@TOCONFIGURE: $$deleteColumn needs a specific hook (or none).
        onMapTableId: false,
        onMapColumnId: false,
      });
      await this.$$transferBackTemporaryDatabase();
    }

    $validateRenameColumnParameters() {
      LswDatabase.trace("LswDatabaseMigration.$validateRenameColumnParameters");
      if (typeof this.parameters.fromDatabase !== "string") {
        throw new Error("Required «parameters.fromDatabase» to be a string on «LswDatabaseMigration.$validateRenameColumnParameters»");
      }
      if (typeof this.parameters.table !== "string") {
        throw new Error("Required «parameters.table» to be a string on «LswDatabaseMigration.$validateRenameColumnParameters»");
      }
      if (typeof this.parameters.columnSource !== "string") {
        throw new Error("Required «parameters.columnSource» to be a string on «LswDatabaseMigration.$validateRenameColumnParameters»");
      }
      if (typeof this.parameters.columnDestination !== "string") {
        throw new Error("Required «parameters.columnDestination» to be a string on «LswDatabaseMigration.$validateRenameColumnParameters»");
      }
    }

    async $$renameColumn() {
      LswDatabase.trace("LswDatabaseMigration.$$renameColumn");
      this.$validateRenameColumnParameters();
      await this.$replicateSchema({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onAlterSchema: schema => {
          console.log(schema);
          const columnPosition = schema[this.parameters.table].indexOf(this.parameters.columnSource);
          schema[this.parameters.table].splice(columnPosition, 1);
          schema[this.parameters.table].push(this.parameters.columnDestination);
          return schema;
        },
      });
      await this.$populateDatabase({
        fromDatabase: this.parameters.fromDatabase,
        toDatabase: this.config.temporaryDatabase,
        onMapTableId: false,
        onMapColumnId: (columnId) => {
          return columnId;
        },
      });
      await this.$$transferBackTemporaryDatabase();
    }

    $adaptSchemaAsSchemaDefinition(schemaDefinition) {
      const output = {};
      const tableIds = Object.keys(schemaDefinition);
      for (let index = 0; index < tableIds.length; index++) {
        const storeId = tableIds[index];
        const tableDefinition = schemaDefinition[storeId];
        const columns = tableDefinition.indexes;
        if (!(storeId in output)) {
          output[storeId] = [];
        }
        for (let indexColumn = 0; indexColumn < columns.length; indexColumn++) {
          const column = columns[indexColumn];
          const columnId = column.name;
          const columnInput = this.$adaptSchemaColumnAsSchemaDefinition(column, columnId);
          output[storeId].push(columnInput);
        }
      }
      return output;
    }

    $adaptSchemaTableAsSchemaDefinition(tableDefinition) {
      const output = [];
      const columns = tableDefinition.indexes;
      for (let indexColumn = 0; indexColumn < columns.length; indexColumn++) {
        const column = columns[indexColumn];
        const columnId = column.name;
        const columnInput = this.$adaptSchemaColumnAsSchemaDefinition(column, columnId);
        output.push(columnInput);
      }
      return output;
    }

    $adaptSchemaColumnAsSchemaDefinition(column, columnId) {
      if (column.unique) {
        return "!" + columnId;
      } else {
        return columnId;
      }
    }

    async $replicateSchema(scenario) {
      LswDatabase.trace("LswDatabaseMigration.$replicateSchema");
      const { fromDatabase, toDatabase, onAlterSchema } = scenario;
      console.log(`⌛️ Replicating database from «${fromDatabase}» to «${toDatabase}» on «LswDatabaseMigration.$replicateSchema»`);
      const schemaDefinition = await LswDatabase.getSchema(fromDatabase);
      const schemaInput = this.$adaptSchemaAsSchemaDefinition(schemaDefinition);
      let alteredSchema = schemaInput;
      if (onAlterSchema) {
        alteredSchema = onAlterSchema(schemaInput);
        if (typeof alteredSchema === "undefined") {
          throw new Error("Required «onAlterSchema» to return an object on «LswDatabaseMigration.$replicateSchema»")
        }
      }
      console.log("Replicated schema:", alteredSchema);
      await LswDatabase.createDatabase(toDatabase, alteredSchema);
    }

    async $populateDatabase(scenario) {
      LswDatabase.trace("LswDatabaseMigration.$populateDatabase");
      const { fromDatabase, toDatabase, onMapTableId = false, onMapColumnId = false } = scenario;
      console.log(`⌛️ Populating database from «${fromDatabase}» to «${toDatabase}» on «LswDatabaseMigration.$populateDatabase»`);
      const schemaDefinition = await LswDatabase.getSchema(fromDatabase);
      const tableIds = Object.keys(schemaDefinition);
      let fromConnection = undefined;
      let toConnection = undefined;
      let indexTable = 0;
      let indexColumn = 0;
      let tableId = undefined;
      let alteredTableId = undefined;
      try {
        fromConnection = new LswDatabase(fromDatabase);
        toConnection = new LswDatabase(toDatabase);
        await fromConnection.open();
        await toConnection.open();
        for (indexTable = 0; indexTable < tableIds.length; indexTable++) {
          tableId = tableIds[indexTable];
          console.log("table:", tableId);
          Transfering_tables: {
            console.log(`⌛️ Transfering table «${tableId}» on «LswDatabaseMigration.$populateDatabase»`);
            let allRows = await fromConnection.selectMany(tableId, v => true);
            console.log("[*] Getting table id");
            alteredTableId = tableId;
            if (onMapTableId) {
              alteredTableId = onMapTableId(tableId);
            }
            console.log("[*] Getting column id");
            if (onMapColumnId) {
              allRows = allRows.reduce((output, row) => {
                const allKeys = Object.keys(row);
                const alteredRow = {};
                for (let indexKeys = 0; indexKeys < allKeys.length; indexKeys++) {
                  console.log("column:", indexKeys);
                  const columnId = allKeys[indexKeys];
                  const alteredColumnId = onMapColumnId(columnId, tableId, alteredTableId, {
                    fromConnection,
                    toConnection
                  }) || columnId;
                  alteredRow[alteredColumnId] = row[columnId];
                }
                output.push(alteredRow);
                return output;
              }, []);
            }
            console.log("[*] Got:", alteredTableId, allRows);
            await toConnection.insertMany(alteredTableId, allRows);
            console.log("What??? 444")
          }
        }
      } catch (error) {
        console.log(`💥 Error while populating database on table ${tableId || "-"} (alias «${alteredTableId}»):`, error);
      } finally {
        try {
          await fromConnection.close();
        } catch (error) {
          console.log(error);
        }
        try {
          await toConnection.close();
        } catch (error) {
          console.log(error);
        }
        console.log(`[*] Database «${toDatabase}» population finished successfully.`);
      }
    }

  }

  class LswDatabaseMigration extends BrowsieMigration {

  }

  LswDatabaseMigration.default = LswDatabaseMigration;
  window.LswDatabaseMigration = LswDatabaseMigration;
  window.BrowsieMigration = BrowsieMigration;

  class BrowsieMigrable extends BrowsieCrudAPI {

    static migration = LswDatabaseMigration;

  }

  window.Browsie = BrowsieMigrable;
  Browsie.default = BrowsieMigrable;

  /* Extended API */

  class LswDatabase extends BrowsieMigrable {

    class = this.constructor;

  }

  LswDatabase.default = LswDatabase;
  window.LswDatabase = LswDatabase;
  // @code.end: LswDatabase class

  return LswDatabase;

});
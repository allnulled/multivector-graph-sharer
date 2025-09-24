(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswVolatileDB'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswVolatileDB'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  const localStorage = typeof window !== "undefined" ? window.localStorage : {};
  const LswVolatileDB = {
    classes: {
      DatabaseInterface: class {
        constructor(storageId) {
          this.storageId = storageId;
          this.data = {};
          this.load();
        }
        getSchema(options = {}) {
          let tables = Object.keys(LswVolatileDB.global.data);
          if(options.sorted) {
            tables = tables.sort();
          }
          return tables;
        }
        createTable(tableId, initialData = {}) {
          if(tableId in this.data) {
            throw new Error(`Cannot create table «${tableId}» because it already exists on «LswVolatileDB.classes.DatabaseInterface.createTable»`);
          }
          this.data[tableId] = new LswVolatileDB.classes.DatabaseTableInterface(tableId, this, initialData);
          this.persist();
        }
        getData() {
          const data = {};
          const tableIds = Object.keys(this.data);
          for(let indexTable=0; indexTable<tableIds.length; indexTable++) {
            const tableId = tableIds[indexTable];
            const tableData = this.data[tableId].data;
            data[tableId] = tableData;
          }
          return data;
        }
        persist() {
          const onlyData = this.getData();
          localStorage[this.storageId] = JSON.stringify(onlyData);
        }
        load() {
          const tables = JSON.parse(localStorage[this.storageId] || "{}");
          const tableIds = Object.keys(tables);
          for(let index=0; index<tableIds.length; index++) {
            const tableId = tableIds[index];
            const tableData = tables[tableId];
            this.createTable(tableId, tableData);
          }
        }
      },
      DatabaseTableInterface: class {
        constructor(tableId, database, initialData = {}) {
          this.getDatabase = () => database;
          this.tableId = tableId;
          this.lastId = 1;
          this.data = initialData;
        }
        getNewIdentifier() {
          return this.lastId++;
        }
        knownProtocols = {
          "http://": function () {
            // @TODO:
          },
          "https://": function (text, propId) {
            // @TODO:
          },
          "function://": function (text, propId) {
            const code = text.substr("function://".length);
            const callback = new Function(code);
            return callback;
          },
          "async-function://": function (text, propId) {
            const AsyncFunction = (async function(){}).constructor;
            const code = text.substr("async-function://".length);
            const callback = new AsyncFunction(code);
            return callback;
          },
          "eval://": function (text, propId) {
            const code = text.substr("eval://".length);
            const callback = new Function(code);
            return callback();
          }
        }
        hydrateRowProperty(propValue, metadata = {}) {
          if(typeof(propValue) !== "string") {
            metadata.protocol = false;
            return propValue;
          }
          const protocolIds = Object.keys(this.knownProtocols);
          for(let indexProtocol=0; indexProtocol<protocolIds.length; indexProtocol++) {
            const protocolId = protocolIds[indexProtocol];
            if(propValue.startsWith(protocolId)) {
              metadata.protocol = protocolId;
              const protocolCallback = this.knownProtocols[protocolId];
              const rowValue = protocolCallback.call(this, propValue);
              return rowValue;
            }
          }
          return propValue;
        }
        hydrateRow(row) {
          const hydratedRow = {};
          let currentKey = undefined;
          let currentValue = undefined;
          let currentMetadata = { protocol: false };
          const props = Object.keys(row);
          for(let indexProp=0; indexProp<props.length; indexProp++) {
            try {
              const propKey = props[indexProp];
              currentKey = propKey;
              const propValue = row[propKey];
              currentValue = propValue;
              const hydratedValue = this.hydrateRowProperty(propValue, currentMetadata);
              hydratedRow[propKey] = hydratedValue;
            } catch (error) {
              console.log(`[!] Error hydrating property «${currentKey}» on protocol «${currentMetadata.protocol}» by error «${error.name}» with message «${error.message}»`)
              hydratedRow[currentKey] = {
                type: "ProtocolError",
                protocol: currentMetadata.protocol,
                original: currentValue,
                error: {
                  name: error.name,
                  message: error.message,
                }
              };
            }
          }
          return hydratedRow;
        }
        hydrateRows(rows) {
          const hydratedRows = [];
          for(let indexRow=0; indexRow<rows.length; indexRow++) {
            const row = rows[indexRow];
            const hydratedRow = this.hydrateRow(row);
            hydratedRows.push(hydratedRow);
          }
          return hydratedRows;
        }
        selectAll() {
          return this.select(it => true);
        }
        selectById(id) {
          const item = this.data[id];
          Return_null_if_not_found: {
            if(!item) {
              return null;
            }
          }
          const hydratedItem = this.hydrateRow(item);
          return hydratedItem;
        }
        select(filter) {
          const allKeys = Object.keys(this.data);
          const allMatches = [];
          for(let indexRow=0; indexRow<allKeys.length; indexRow++) {
            const oneKey = allKeys[indexRow];
            const oneValue = this.data[oneKey];
            const isValid = filter(oneValue, oneKey, indexRow, allMatches);
            if(isValid === true) {
              allMatches.push(oneValue);
            }
          }
          return this.hydrateRows(allMatches);
        }
        insert(...items) {
          for(let indexItem=0; indexItem<items.length; indexItem++) {
            const item = items[indexItem];
            const id = this.getNewIdentifier();
            let sanitizedItem = {};
            Sanitize_item: {
              delete item.id;
              sanitizedItem = {
                id,
                ...item,
              };
            }
            Set_item: {
              this.data[id] = sanitizedItem;
            }
          }
          this.getDatabase().persist();
        }
        update(id, values = {}) {
          if(!(id in this.data)) {
            throw new Error(`Cannot update id «${id}» on table «${this.tableId}» because it does not exist`);
          }
          delete values.id;
          Object.assign(this.data[id], values);
          this.getDatabase().persist();
        }
        delete(id) {
          delete this.data[id];
          this.getDatabase().persist();
        }
        init() {
          this.getDatabase().persist();
          return this;
        }
      }
    },
    create(storageId) {
      return new LswVolatileDB.classes.DatabaseInterface(storageId);
    }
  };
  LswVolatileDB.default = LswVolatileDB;
  LswVolatileDB.global = LswVolatileDB.create("LSW_VOLATILE_DB_GLOBAL");
  return LswVolatileDB;
});
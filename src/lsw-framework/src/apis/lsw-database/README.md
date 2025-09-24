# lsw-database

IndexedDB wrapper.

Branched from [@allnulled/browsie](https://github.com/allnulled/browsie).

## Installation

Download from console:

```sh
npm i -s @allnulled/browsie
```

Import from code:

```html
<script src="node_modules/@allnulled/lsw-database/browsie.bundled.js"></script>
```

The global `window.Browsie` should now be available.

## API

```js
await Browsie.listDatabases()
await Browsie.deleteDatabase(dbName)
await Browsie.createDatabase(dbName, storeDefinition, version = 1, versionUpgrades = []) // Opens a database with awareness flag of versionation, optionally 
await Browsie.getSchema(dbName)
await Browsie.createTable(args)
await Browsie.createColumn(args)
await Browsie.renameTable(args)
await Browsie.renameColumn(args)
await Browsie.deleteTable(args)
await Browsie.deleteColumn(args)
await Browsie.globMatch(patterns, texts)
await Browsie.open(dbName) // opens a database by its name on its current version nomatterwhich.
browsie = new Browsie(dbName)
await browsie.open()
await browsie.select(store, filter)
await browsie.insert(store, item)
await browsie.update(store, id, item)
await browsie.delete(store, id)
await browsie.selectMany(store, filter)
await browsie.insertMany(store, items)
await browsie.updateMany(store, filter, item)
await browsie.deleteMany(store, filter)
await browsie.triggers.register(eventId, triggerId, callback, options)
await browsie.triggers.emit(eventId, parameters)
await browsie.triggers.unregister(triggerId)
await browsie.triggers.load(triggersScript) // For this method, the library occupies like x20 times hahahaha maybe more HAHAHAHAHAH!
```

On `storeDefinitions:object` we want an object like:

```js
{
  articulos: ["!nombre", "categorias", "resumen", "fecha", "autor", "inspiracion", "tags"],
  productos: ["!nombre", "!modeloId", "categorias", "descripcion"]
}
```

Here, the `!` is to declare `unique` indexes.

On `version:integer` we want the current version of the database. This must be updated when a `versionUpgrades` is added.

On `versionUpgrades:object` we want an object like this:

```js
{
  2: function(db) {
    if (!db.objectStoreNames.contains("orders")) {
      const ordersStore = db.createObjectStore("orders", {
        keyPath: "id",
        autoIncrement: true,
      });
      ordersStore.createIndex("orderDate", "orderDate", { unique: false });
      ordersStore.createIndex("userId", "userId", { unique: false });
    }
  }
}
```

Here, every version should have its own function.

On `eventId:string`, triggers section, we want:

  - On `browsie.triggers.register(eventId, ...)`: a selector of events that accepts `*` as magic character.
  - On `browsie.triggers.emit(eventId, ...)`: the name of the event, that does NOT accept `*` as magic character.

On `triggersScript:string` we want a [`@allnulled/triggers-script`](https://github.com/allnulled/triggers-script) script as string.

## Example

This is the test that is ensuring the API right now. There are 3 tests in 1 function: `Data_api`, `Schema_api` and `Triggers_api`.

```js
(async function main() {
  try {
    Data_api: {
      await Browsie.deleteDatabase("browsie_test_data");
      await Browsie.createDatabase("browsie_test_data", {
        articulos: ["!nombre", "categorias", "resumen", "fecha", "autor", "inspiracion", "tags"],
        productos: ["!nombre", "!modeloId", "categorias", "descripcion"]
      }, 2, {
        2: function (db) {
          if (!db.objectStoreNames.contains("orders")) {
            const ordersStore = db.createObjectStore("orders", {
              keyPath: "id",
              autoIncrement: true,
            });
            ordersStore.createIndex("orderDate", "orderDate", { unique: false });
            ordersStore.createIndex("userId", "userId", { unique: false });
          }
        }
      });
      const db = new Browsie("browsie_test_data");
      await db.open();
      const id1 = await db.insert("articulos", { nombre: "Artículo 1" });
      const id2 = await db.insert("articulos", { nombre: "Artículo 2" });
      const id3 = await db.insert("articulos", { nombre: "Artículo 3" });
      const selection1 = await db.select("articulos", i => i);
      if (selection1.length !== 3) {
        throw new Error("Test falló en aserción 1");
      }
      await db.update("articulos", id1, { nombre: "Artículo cambiado 1" });
      await db.update("articulos", id2, { nombre: "Artículo cambiado 2" });
      await db.update("articulos", id3, { nombre: "Artículo cambiado 3" });
      const selection2 = await db.select("articulos", i => i);
      if (selection2.length !== 3) {
        throw new Error("Test falló en aserción 2");
      }
      if (selection2[0].nombre !== "Artículo cambiado 1") {
        throw new Error("Test falló en aserción 3");
      }
      await db.delete("articulos", id3);
      await db.delete("articulos", id2);
      await db.delete("articulos", id1);
      const selection3 = await db.select("articulos", i => i);
      if (selection3.length !== 0) {
        throw new Error("Test falló en aserción 4");
      }
      await db.insertMany("articulos", [{
        nombre: "Papaguata1",
        categorias: "Papaguata, tocolombo, meketino, paquetumba, nonomuni",
        resumen: "wherever",
      }, {
        nombre: "Papaguata2",
        categorias: "Papaguata, tocolombo, meketino, paquetumba, nonomuni",
        resumen: "wherever",
      }, {
        nombre: "Papaguata3",
        categorias: "Papaguata, tocolombo, meketino, paquetumba, nonomuni",
        resumen: "wherever",
      }]);
      const selection4 = await db.select("articulos", i => i);
      if (selection4.length !== 3) {
        throw new Error("Test falló en aserción 5");
      }
      await db.close();
    }
    document.querySelector("#test").textContent += "\n[✔] Browsie Data API Tests passed successfully.";
    Schema_api: {
      // let schema = await Browsie.getSchema("browsie_test"); console.log(schema);
      await Browsie.deleteDatabase("browsie_test_schema");
      // console.log("Create database..");
      await Browsie.createDatabase("browsie_test_schema", {
        tabla1: ["!uuid", "columna1", "columna2", "columna3"],
        tabla2: ["!uuid", "columna1", "columna2", "columna3"],
        tabla3: ["!uuid", "columna1", "columna2", "columna3"],
        tabla4: ["!uuid", "columna1", "columna2", "columna3"],
      });
      const db = await Browsie.open("browsie_test_schema");
      await db.insert("tabla1", { uuid: "1", columna1: "a", columna2: "b", columna3: "c" });
      await db.insert("tabla2", { uuid: "2", columna1: "a", columna2: "b", columna3: "c" });
      await db.insert("tabla3", { uuid: "3", columna1: "a", columna2: "b", columna3: "c" });
      await db.insert("tabla4", { uuid: "4", columna1: "a", columna2: "b", columna3: "c" });
      schema = await Browsie.getSchema("browsie_test_schema");
      console.log(schema);
      await db.close();
      // await Browsie.deleteDatabase("browsie_test_data");
      // await Browsie.deleteDatabase("browsie_test_schema");
      document.querySelector("#test").textContent += "\n[✔] Browsie Schema API Tests Pack 1 passed successfully.";
    }
    Triggers_api: {
      console.log(await Browsie.globMatch([
        "crud.insert.*.users",
        "crud.*.many.users"
      ], [
        "crud.select.one.users",
        "crud.select.many.users",
        "crud.insert.one.users",
        "crud.insert.many.users",
        "crud.update.one.users",
        "crud.update.many.users",
        "crud.delete.one.users",
        "crud.delete.many.users",
      ]));
      const db = await Browsie.open("browsie_test_schema");
      let counter = 0;
      await db.triggers.register("crud.insert.one.tabla1", "temp1", function () {
        console.log("triggering temp1");
        counter -= 2;
      }, {
        priority: 20
      });
      await db.triggers.register("crud.insert.one.tabla1", "temp2", function () {
        console.log("triggering temp2");
        counter *= 10;
      }, {
        priority: 10
      });
      await db.triggers.register("crud.insert.one.tabla1", "temp3", function () {
        console.log("triggering temp3");
        counter += 5;
      }, {
        priority: 30
      });
      await db.insert("tabla1", { uuid: "5", columna1: "a", columna2: "b", columna3: "c" });
      schema = await Browsie.getSchema("browsie_test_schema");
      console.log(schema);
      console.log(db);
      setTimeout(() => {
        console.log(counter);
        if (counter !== 30) {
          console.error("Failed calculus");
        } else {
          console.log("Triggers are working fine");
        }
      }, 1000);
      const resultTmp = await db.selectMany("tabla1", v => v.uuid === "5");
      console.log(resultTmp);
      if (!Array.isArray(resultTmp)) {
        throw new Error("Error expected selectMany to work (1)");
      }
      if (resultTmp.length !== 1) {
        throw new Error("Error expected selectMany to work (2)");
      }
      await db.close();
    }
    document.querySelector("#test").textContent += "\n[✔] Browsie Triggers API Tests passed successfully.";

    Schema_api_2: {
      const checkSchemaHasColumn = function (schema, table, columnId) {
        if (!(table in schema)) {
          return false;
        }
        const matchedColumns = schema[table].indexes.filter(column => column.name === columnId);
        if (matchedColumns.length === 0) {
          return false;
        }
        return true;
      };
      await Browsie.deleteDatabase("browsie_test_schema_2");
      await Browsie.createDatabase("browsie_test_schema_2", {
        userzz: ["name", "alias", "!email"]
      });
      Insert_some_registries: {
        const db = await Browsie.open("browsie_test_schema_2");
        await db.insertMany("userzz", [{
          name: "userzz1",
          alias: "userzz1",
          email: "userzz1@userzz.org" + BrowsieMigration.prototype.$getRandomString(4)
        }, {
          name: "userzz2",
          alias: "userzz2",
          email: "userzz2@userzz.org" + BrowsieMigration.prototype.$getRandomString(4)
        }, {
          name: "userzz3",
          alias: "userzz3",
          email: "userzz3@userzz.org" + BrowsieMigration.prototype.$getRandomString(4)
        }]);
        await db.close();
      }
      const schema1 = await Browsie.getSchema("browsie_test_schema_2");
      await BrowsieMigration.createTable({
        fromDatabase: "browsie_test_schema_2",
        table: "messages",
        tableDefinition: ["user_source", "user_destination", "content", "sent_at"]
      }).commit();
      if ("messages" in schema1) {
        throw new Error("This should not happen (1)");
      }
      const schema2 = await Browsie.getSchema("browsie_test_schema_2");
      if (!("messages" in schema2)) {
        throw new Error("This should not happen (2)");
      }
      if ("secrets" in schema2) {
        throw new Error("This should not happen (3)");
      }
      const schema3 = await Browsie.getSchema("browsie_test_schema_2");
      await BrowsieMigration.createTable({
        fromDatabase: "browsie_test_schema_2",
        table: "secrets",
        tableDefinition: ["user_source", "user_destination", "content", "sent_at"]
      }).commit();
      const schema4 = await Browsie.getSchema("browsie_test_schema_2");
      if (!("secrets" in schema4)) {
        throw new Error("This should not happen (4)");
      }
      if ("attached_documents" in schema4) {
        throw new Error("This should not happen (5)");
      }
      await BrowsieMigration.createTable({
        fromDatabase: "browsie_test_schema_2",
        table: "attached_documents",
        tableDefinition: ["user_source", "title", "document_content"]
      }).commit();
      const schema5 = await Browsie.getSchema("browsie_test_schema_2");
      if (!("attached_documents" in schema5)) {
        throw new Error("This should not happen (6)");
      }
      if ("attached_documents_remamed" in schema5) {
        throw new Error("This should not happen (7)");
      }
      await BrowsieMigration.renameTable({
        fromDatabase: "browsie_test_schema_2",
        tableSource: "attached_documents",
        tableDestination: "attached_documents_renamed",
      }).commit();
      const schema6 = await Browsie.getSchema("browsie_test_schema_2");
      if ("attached_documents" in schema6) {
        throw new Error("This should not happen (8)");
      }
      if (!("attached_documents_renamed" in schema6)) {
        throw new Error("This should not happen (9)");
      }
      if (!checkSchemaHasColumn(schema6, "attached_documents_renamed", "document_content")) {
        throw new Error("This should not happen (10)");
      }
      if (checkSchemaHasColumn(schema6, "attached_documents_renamed", "document")) {
        throw new Error("This should not happen (11)");
      }
      await BrowsieMigration.deleteColumn({
        fromDatabase: "browsie_test_schema_2",
        table: "attached_documents_renamed",
        column: "document_content",
      }).commit();
      const schema7 = await Browsie.getSchema("browsie_test_schema_2");
      if (checkSchemaHasColumn(schema7, "attached_documents_renamed", "document_content")) {
        throw new Error("This should not happen (12)");
      }
      if (checkSchemaHasColumn(schema7, "attached_documents_renamed", "document")) {
        throw new Error("This should not happen (13)");
      }
      await BrowsieMigration.createColumn({
        fromDatabase: "browsie_test_schema_2",
        table: "attached_documents_renamed",
        column: "document_2",
        columnDefinition: {}
      }).commit();
      const schema8 = await Browsie.getSchema("browsie_test_schema_2");
      if (!checkSchemaHasColumn(schema8, "attached_documents_renamed", "document_2")) {
        throw new Error("This should not happen (14)");
      }
      if (checkSchemaHasColumn(schema7, "attached_documents_renamed", "document_2_renamed")) {
        throw new Error("This should not happen (15)");
      }
      await BrowsieMigration.renameColumn({
        fromDatabase: "browsie_test_schema_2",
        table: "attached_documents_renamed",
        columnSource: "document_2",
        columnDestination: "document_2_renamed",
      }).commit();
      const schema9 = await Browsie.getSchema("browsie_test_schema_2");
      if (checkSchemaHasColumn(schema9, "attached_documents_renamed", "document_2")) {
        throw new Error("This should not happen (16)");
      }
      if (!checkSchemaHasColumn(schema9, "attached_documents_renamed", "document_2_renamed")) {
        throw new Error("This should not happen (17)");
      }
      console.log(schema9);


      Ensure_rename_column_transfers_data: {
        const insertRow = async function(dbName, tableId, row) {
          const db = await Browsie.open(dbName);
          const id = await db.insert(tableId, row);
          await db.close();
          return id;
        };
        const getAllRowsFrom = async function(dbName, tableId) {
          const db = await Browsie.open(dbName);
          const data = await db.selectMany(tableId, v => true);
          await db.close();
          return data;
        };
        const id1 = await insertRow("browsie_test_schema_2", "attached_documents_renamed", { metadata1: "whatever1" });
        const id2 = await insertRow("browsie_test_schema_2", "attached_documents_renamed", { metadata1: "whatever2" });
        const id3 = await insertRow("browsie_test_schema_2", "attached_documents_renamed", { metadata1: "whatever3" });
        const all1 = await getAllRowsFrom("browsie_test_schema_2", "attached_documents_renamed");
        console.log(all1);
        if(all1.length !== 6) {
          throw new Error("This should not happen (18)");
        }
        await BrowsieMigration.renameColumn({
          fromDatabase: "browsie_test_schema_2",
          table: "attached_documents_renamed",
          columnSource: "document_2",
          columnDestination: "document_2_renamed",
        }).commit();
        const schema10 = await Browsie.getSchema("browsie_test_schema_2");
        if (checkSchemaHasColumn(schema10, "attached_documents_renamed", "document_2")) {
          throw new Error("This should not happen (19)");
        }
        if (!checkSchemaHasColumn(schema10, "attached_documents_renamed", "document_2_renamed")) {
          throw new Error("This should not happen (20)");
        }
        const all2 = await getAllRowsFrom("browsie_test_schema_2", "attached_documents_renamed");
        if(all2.length !== 6) {
          throw new Error("This should not happen (21)");
        }
        console.log(all2);
      }


      document.querySelector("#test").textContent += "\n[✔] Browsie Schema API Tests Pack 2 passed successfully.";
    }

  } catch (error) {
    console.log(error);
  }
})();
```

You can run it using `npm test`.

## The versionation

This was a stopper when developing, and I want to clarify it.

> The method of versionation IndexedDB uses is a very correct one, in which we print the mutations of the database schema. This creates the ADN along time of the database schema. So it is a good pattern. Despite it can seem annoying at first sight.

This library implements, via parameters of the `createDatabase` method:

  - `storeDefinition`: a declarative way of defining the first schema shape.
  - `versionUpgrades`: an imperative way of defining the next database schema modifications.
  - `version`: current version.

So.

When you want to upgrade a version, to apply a schema mutation, you **append a hardcoded function** into the **versionUpgrades** parameter of the *browsie instance* constructor call.

Finally, to apply the version upgrade, **increase the version** parameter of the same call.

Applying these 2 changes into your code, the database can migrate by itself, and track the ADN, to **keep compatibility** with previous schemas that users can have in their own browsers.

So it is a good pattern. And we have close it the best way possible no, but close enough.

## The triggerization

We are using [@allnulled/triggers-api](https://github.com/allnulled/triggers-api) to cover the topic.

This allows you to use **triggers pattern** in multiple places, for multiple purposes or APIs.

It is up to you. On `TriggersApi` global, you can find.






## Documentación extendida para LSW

1. Hay que usar `createDatabase` antes que `open` siempre, y cuando quieres versionar la base de datos, vas ahí y añades tu función.

2. En esta librería tienes las globales `window.Browsie` y `window.LswDatabase`.

## Nuevas features

### Schema IO

Antes solo se podía hacer `Browsie.getSchema(dbName)`.

Ahora puedes alterar el esquema también desde el Browsie global:

```js
await Browsie.createTable({
  fromDatabase: "source_db",
  table: "my_new_table",
  tableDefinition: ["name", "city", "age"]
});
await Browsie.renameTable({
  fromDatabase: "source_db",
  tableSource: "my_new_table",
  tableDestination: "my_new_table_2"
});
await Browsie.deleteTable({
  fromDatabase: "source_db",
  table: "my_new_table_2",
});
await Browsie.createColumn({
  fromDatabase: "source_db",
  table: "my_new_table",
  column: "name",
  columnDefinition: {
    isUnique: false,
  }
});
await Browsie.renameColumn({
  fromDatabase: "source_db",
  table: "my_new_table",
  columnSource: "age",
  columnDestination: "birthday"
});
await Browsie.deleteColumn({
  fromDatabase: "source_db",
  table: "my_new_table",
  column: "obsolete_index"
});
```

Esta API **destruye las versiones de IndexedDB** que tuviera y recrea toda la base de datos, por lo cual:

  - Pierdes retrocompatibilidad de versiones con bases de datos.
  - Pierdes compatibilidad con código que gestione versionado (no necesariamente, pero fácilmente) vía IndexedDB.
  - Si sale mal, puede quedarse colgado y perder los datos.
  - No es el mejor algoritmo de transferencia de datos tampoco.

Esta API es solo para hacer el parche. Está bien programada, pero los caminos lógicos no serían los recomendados por los estándares. Sin embargo, si sabes qué estás haciendo, puede ser útil igual.
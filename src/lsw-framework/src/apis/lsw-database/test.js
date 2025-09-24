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
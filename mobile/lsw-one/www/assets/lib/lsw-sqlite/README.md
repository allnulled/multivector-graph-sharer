# lsw-sqlite

Con esta clase interactúas con los bindings en C de WASM de SQLite desde JS.

## Features

- El archivo se carga en remoto siempre y como una función asíncrona evaluable:
   - porque `LswSqlite` no es una clase
   - **porque `LswSqlite` es una instancia de la clase `LswSqlitePrototype` ya inicializada**
   - es decir: habiendo llamado al `await LswSqlite.initialize()`
- La clase ya carga los datos del último estado guardado:
   - Guardas con `LswSqlite.saveData` (manual)
   - Cargas con `LswSqlite.loadData` (automático y al principio 1 vez solamente)


## Métodos de interés

```js
LswSqlite.getSchema(); // No cachea, en runtime con query intercalada

LswSqlite.select(tabla, where, order, limit);
LswSqlite.selectMany(tabla, where, order, limit);
LswSqlite.selectFirst(tabla, where, order, limit);
LswSqlite.selectOne(tabla, id);

LswSqlite.insert(tabla, valueOrList);
LswSqlite.insertMany(tabla, list);
LswSqlite.insertOne(tabla, value);

LswSqlite.update(tabla, whereOrId, values);
LswSqlite.updateMany(tabla, where, values);
LswSqlite.updateOne(tabla, id, values);

LswSqlite.delete(tabla, whereOrId);
LswSqlite.deleteMany(tabla, where);
LswSqlite.deleteOne(tabla, id);

await LswSqlite.saveDatabase();
await LswSqlite.loadDatabase();

LswSqlite.execute(sql);
LswSqlite.executeSerie(sqlList);

LswSqlite.dropTable(table);
LswSqlite.dropColumn(table, column);

// P. ej: LswSqlite.synchronizeSchema({
//   [table1]: {
//     [col1]: "varchar(255)",
//     [col2]: {
//       type: "varchar(255)",
//     }
//   }
// })
LswSqlite.synchronizeSchema(partialSchema);
```

## Fuera de esto

La importación de `sqlite3` puede ser conflictiva porque recae en APIs de C que están documentadas, pero en y para C.

Pero en principio, estaríamos funcionando SQL con C en browser desde JS, full-cliente/sin servidores.
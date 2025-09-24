const LswSqlitePrototype = class extends LswSqlitePrototype_CrudInterface { };

const LswSqlite = LswSqlitePrototype.create();

// @ATTENTION: sip, hay un asíncroner aquí.
await LswSqlite.initialize();

window.LswSqlite = LswSqlite;
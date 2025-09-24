await (async function (factory) {
  const mod = await factory();
  if (typeof window !== 'undefined') {
    window['LswSqlite'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswSqlite'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(async function () {

  await LswLazyLoader.loadSqlite3();
  
  await sqlite3InitModule();
  
  const LswSqlite = class {

    static create(...args) {
      return new this(...args);
    }

    constructor(options = {}) {
      
    }

  };

  LswSqlite.global = await LswSqlite.create();

  return LswSqlite;

});
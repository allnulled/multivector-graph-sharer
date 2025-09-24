(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswBackuper'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswBackuper'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  // @code.start: LswBackuper class | @$section: Lsw Backuper API » LswBackuper class

  const LswBackuper = class {

    static create(...args) {
      return new this(...args);
    }

    static get defaultOptions() {
      return {
        storageId: "lsw_default_database_backup_1",
        trace: Vue.prototype.$lsw.logger.$options.active,
      };
    }

    $trace(method, args = []) {
      if(this.options.trace) {
        console.log(`[lsw][trace][lsw-backuper] ${method}: ${Array.from(args).length}`);
      }
    }

    constructor(options = {}) {
      this.options = Object.assign({}, this.constructor.defaultOptions, options);
    }

    getLastBackup() {
      this.$trace("getLastBackup", arguments);
      try {
        const jsonData = localStorage[this.options.storageId] || "{}";
        const data = JSON.parse(jsonData);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    setLastBackup(backupJson) {
      this.$trace("setLastBackup", arguments);
      localStorage[this.options.storageId] = JSON.stringify(backupJson, null, 2);
    }

    deleteLastBackup() {
      this.$trace("deleteLastBackup", arguments);
      delete localStorage[this.options.storageId];
    }

  };

  return LswBackuper;
  // @code.end: LswBackuper class

});
(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswDatabaseVirtualizer'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswDatabaseVirtualizer'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  // @code.start: LswDatabaseVirtualizer class | @section: Lsw DatabaseVirtualizer API » LswDatabaseVirtualizer class
  const LswDatabaseVirtualizer = class {

    static create(...args) {
      return new this(...args);
    }

    static start(...args) {
      const virtualization = new this(...args);
      return virtualization;
    }

    $lifecycle = [
      "onStart",
      "onStartValidation",
      "onValidateConnection",
      "onValidateSchema",
      "onFinishValidation",
      "onDeleteVirtualDatabase",
      "onStartClonation",
      "onCloneDatabase",
      "onFinishClonation",
      "onStartVirtualization",
      "onVirtualizeSchema",
      "onVirtualizeTables",
      "onVirtualizeColumns",
      "onFinishVirtualization",
      "onStartFormalization",
      "onFormalizeColumns",
      "onFormalizeTables",
      "onFormalizeSchema",
      "onReport",
      "onFinishFormalization",
      "onFinish",
    ];

    $defaultConfigurations = {
      trace: (Vue?.prototype?.$lsw?.logger?.$options?.active ),
    };

    $trace(method, args) {
      if(this.$configurations.trace) {
        const methodArgs = Array.from(args);
        console.log(`[trace][lsw-database-virtualizer] ${method}: (${methodArgs.length}) ${methodArgs.map(e => typeof e).join(", ")}`);
      }
    }

    constructor(configurations = {}) {
      this.$configurations = Object.assign({}, this.$defaultConfigurations, configurations || {});
      this.$trace("constructor", arguments);
      this.triggers = new TriggersClass();
      this.physicalConnection = undefined;
      this.virtualConnection = undefined;
      this.schema = undefined;
    }

    configure(options = {}) {
      this.$trace("configure", arguments);
      $ensure({ options }, 1).to.have.uniquelyKeys(["physicalConnection", "virtualConnection", "schema"]);
      Object.assign(this, options);
      return this;
    }

    setPhysicalConnection(physicalConnection) {
      this.$trace("setPhysicalConnection", arguments);
      this.physicalConnection = physicalConnection;
      return this;
    }

    setVirtualConnection(virtualConnection) {
      this.$trace("setVirtualConnection", arguments);
      this.virtualConnection = virtualConnection;
      return this;
    }

    setSchema(schema) {
      this.$trace("setSchema", arguments);
      this.schema = schema;
      return this;
    }

    start() {
      this.$trace("start", arguments);
      return LswCycler.from(this, "*").run(this.$lifecycle);
    }

    async onStart() {
      this.$trace("onStart", arguments);
      // *@TODO:
    }

    async onStartValidation() {
      this.$trace("onStartValidation", arguments);
      // *@TODO:
    }

    async onValidateConnection() {
      this.$trace("onValidateConnection", arguments);
      // *@TODO:
    }

    async onValidateSchema() {
      this.$trace("onValidateSchema", arguments);
      // *@TODO:
    }

    async onFinishValidation() {
      this.$trace("onFinishValidation", arguments);
      // *@TODO:
    }

    async onDeleteVirtualDatabase() {
      this.$trace("onDeleteVirtualDatabase", arguments);
      // *@TODO:
    }

    async onStartClonation() {
      this.$trace("onStartClonation", arguments);
      // *@TODO:
    }

    async onCloneDatabase() {
      this.$trace("onCloneDatabase", arguments);
      // *@TODO:
    }

    async onFinishClonation() {
      this.$trace("onFinishClonation", arguments);
      // *@TODO:
    }

    async onStartVirtualization() {
      this.$trace("onStartVirtualization", arguments);
      // *@TODO:
    }

    async onVirtualizeSchema() {
      this.$trace("onVirtualizeSchema", arguments);
      // *@TODO:
    }

    async onVirtualizeTables() {
      this.$trace("onVirtualizeTables", arguments);
      // *@TODO:
    }

    async onVirtualizeColumns() {
      this.$trace("onVirtualizeColumns", arguments);
      // *@TODO:
    }

    async onFinishVirtualization() {
      this.$trace("onFinishVirtualization", arguments);
      // *@TODO:
    }

    async onStartFormalization() {
      this.$trace("onStartFormalization", arguments);
      // *@TODO:
    }

    async onFormalizeColumns() {
      this.$trace("onFormalizeColumns", arguments);
      // *@TODO:
    }

    async onFormalizeTables() {
      this.$trace("onFormalizeTables", arguments);
      // *@TODO:
    }

    async onFormalizeSchema() {
      this.$trace("onFormalizeSchema", arguments);
      // *@TODO:
    }

    async onFinishFormalization() {
      this.$trace("onFinishFormalization", arguments);
      // *@TODO:
    }

    async onReport() {
      this.$trace("onReport", arguments);
      // *@TODO:
    }

    async onFinish() {
      this.$trace("onFinish", arguments);
      // *@TODO:
    }

  }
  // @code.end: LswDatabaseVirtualizer class

  return LswDatabaseVirtualizer;

});
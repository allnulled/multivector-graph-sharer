const jQliteResultset = class extends Array {

  static create(...args) {
    return new this(...args);
  }

  static defaultConfigurations = {
    trace: false,
  }

  trace() {
    if(this.$configurations.trace) {
      console.log("[trace][jqlite] " + methodId + " ");
    }
  }

  constructor(...args) {
    super(...args);
    this.$formatters = {};
    this.$configurations = {};
  }

  addConfigurations(configurations = {}) {
    this.trace("addConfigurations");
    Object.assign(this.$configurations, configurations);
    return this;
  }

  addFormatter(id, callback) {
    this.trace("addFormatter");
    this.$formatters[id] = callback.bind(this);
    return this;
  }

  removeFormatter(id) {
    this.trace("removeFormatter");
    delete this.$formatters[id];
    return this;
  }

  action(actionData) {
    this.trace("action");
    if(!(actionData.op in this)) {
      throw new Error("Method «${actionData.op}» was not found on «jQlite.action»");
    }
    return this[actionData.op](actionData);
  }

  schema(actionData) {
    this.trace("schema");
    // @TODO...
  }

  select(actionData) {
    this.trace("select");
    // @TODO...
  }

  insert(actionData) {
    this.trace("insert");
    // @TODO...
  }

  update(actionData) {
    this.trace("update");
    // @TODO...
  }

  delete(actionData) {
    this.trace("delete");
    // @TODO...
  }

  get to() {
    this.trace("to");
    return this.$formatters;
  }

};
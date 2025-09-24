class ArrayProxy {
  
  constructor(initial = []) {
      this.$data = Array.isArray(initial) ? initial.slice() : [];
  }

  get length() {
      return this.$data.length;
  }

  set length(val) {
      this.$data.length = val;
  }

  toArray() {
      return this.$data.slice();
  }

  toString() {
      return this.$data.toString();
  }

  toJSON() {
      return this.toArray();
  }

};

const mutables = [
  "copyWithin", "fill", "pop", "push", "reverse", "shift",
  "sort", "splice", "unshift"
];

const inmutables = [
  "concat", "includes", "indexOf", "join", "lastIndexOf",
  "slice", "toString", "toLocaleString", "entries",
  "every", "filter", "find", "findIndex", "flat", "flatMap",
  "forEach", "map", "reduce", "reduceRight", "some", "values", "keys", "at"
];

const new2023 = [
  "toReversed", "toSorted", "toSpliced", "with"
];

// Métodos mutables (modifican this.$data)
for (const method of mutables) {
  ArrayProxy.prototype[method] = function (...args) {
      return this.$data[method](...args);
  };
}

// Métodos inmutables (devuelven nuevo array o valor)
for (const method of inmutables.concat(new2023)) {
  ArrayProxy.prototype[method] = function (...args) {
      const resultado = this.$data[method](...args);
      this.setData(resultado);
      return this;
  };
}

const jQlitePrototype = class extends ArrayProxy {

  static create(...args) {
    return new this(...args);
  }

  static from = this.create;

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
    this.$data = [];
    this.$formatters = new jQliteFormatter(this);
    this.$configurations = {};
  }

  getDatabase() {
    this.trace("getDatabase");
    return LswSqlite;
  }

  setData(data) {
    this.trace("setData");
    if(!(Array.isArray(data))) {
      throw new Error(`Required parameter «data» to be an array on «jQlite.setData»`);
    }
    this.$data = data;
    return this;
  }

  getData() {
    return this.$data;
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

  schema() {
    this.trace("schema");
    return LswSqlite.getSchema();
  }

  get to() {
    this.trace("to");
    return this.$formatters;
  }

  omit(props = []) {
    this.trace("omit");
    for(let index=0; index<this.$data.length; index++) {
      const row = this.$data[index];
      for(let indexProp=0; indexProp<props.length; indexProp++) {
        const propId = props[indexProp];
        delete row[propId];
      }
    }
    return this;
  }

  allow(props = [], defaultValue = undefined) {
    this.trace("allow");
    let output = [];
    for(let index=0; index<this.$data.length; index++) {
      const row = this.$data[index];
      const newRow = {};
      for(let indexProp=0; indexProp<props.length; indexProp++) {
        const propId = props[indexProp];
        newRow[propId] = row[propId] || defaultValue;
      }
      output.push(newRow);
    }
    this.$data = output;
    return this;
  }

  extract(propId) {
    this.trace("extract");
    let output = [];
    for(let index=0; index<this.$data.length; index++) {
      const row = this.$data[index];
      const newRow = row[propId];
      output.push(newRow);
    }
    this.$data = output;
    return this;
  }

  ids() {
    this.trace("ids");
    return this.extract("id");
  }

  select(actionData) {
    this.trace("select");
    // @TODO...
    const { table, where, sort = ["!id"] } = actionData;
    return LswSqlite.select(table, where, sort);
  }

  insert(actionData) {
    this.trace("insert");
    // @TODO...
    const { table, value } = actionData;
    return LswSqlite.insert(table, value);
  }

  update(actionData) {
    this.trace("update");
    // @TODO...
    const { table, where, value } = actionData;
    return LswSqlite.update(table, where, value);
  }

  delete(actionData) {
    this.trace("delete");
    // @TODO...
    const { table, where } = actionData;
    return LswSqlite.delete(table, where);
  }

  randomized(...args) {
    this.trace("randomized");
    let id = 0;
    const output = LswRandomizer.getRandomObject(...args).map(row => {
      return Object.assign(row, {
        id: id++
      });
    });
    return this.setData(output);
  }

  datify() {
    return this.to.data();
  }

  jsonify() {
    return this.to.json();
  }

  sqlize() {
    return this.to.sql();
  }

};
(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswProxifier'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswProxifier'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  /**
   * 
   * 
   * @$section: LswProxifier API » LswProxifier class
   * @type: class
   * @extends: Object
   * @vendor: lsw
   * @namespace: LswProxifier
   * @source code: La clase está definida así:
   * 
   */
  // @code.start: LswProxifier class | @$section: LswProxifier API » LswProxifier class
  class BaseClass {
    initialize(...args) {
      const promise = this.onInitialize(...args);
      if (promise instanceof Promise) {
        return promise.then(output => {
          return this;
        });
      }
      return this;
    }
    onInitialize() {
      return this;
    }
  }

  const AbstractProxy = class {
    constructor(value) {
      this.value = value;
    }
  }
  class AbstractVirtualizer extends AbstractProxy {}
  class AbstractSchemaEntity extends AbstractProxy {
    static toObject() {
      return {
        entityId: this.getEntityId(),
        name: this.getName(),
        version: this.getVersion(),
        properties: this.getProperties(),
        externalProperties: this.getExternalProperties(),
        methods: this.getMethods(),
        virtualizerId: this.getVirtualizerId(),
        formSettings: this.getFormSettings(),
        extraAttributes: this.getExtraAttributes(),
      };
    }
    static getEntityId() {
      throw new Error(`Required method «getEntityId» to be overriden by «AbstractSchemaEntity» inherited class on «AbstractSchemaEntity.getEntityId»`);
    }
    static getName() {
      throw new Error(`Required method «getName» to be overriden by «AbstractSchemaEntity» inherited class on «AbstractSchemaEntity.getName»`);
    }
    static getVersion() {
      throw new Error(`Required method «getVersion» to be overriden by «AbstractSchemaEntity» inherited class on «AbstractSchemaEntity.getVersion»`);
    }
    static getProperties() {
      throw new Error(`Required method «getProperties» to be overriden by «AbstractSchemaEntity» inherited class on «AbstractSchemaEntity.getProperties»`);
    }
    static getExternalProperties() {
      return {};
    }
    static getMethods() {
      throw new Error(`Required method «getMethods» to be overriden by «AbstractSchemaEntity» inherited class on «AbstractSchemaEntity.getMethods»`);
    }
    static getVirtualizerId() {
      throw new Error(`Required method «getVirtualizerId» to be overriden by «AbstractSchemaEntity» inherited class on «AbstractSchemaEntity.getVirtualizerId»`);
    }
    static getFormSettings() {
      throw new Error(`Required method «getFormSettings» to be overriden by «AbstractSchemaEntity» inherited class on «AbstractSchemaEntity.getFormSettings»`);
    }
    static getExtraAttributes() {
      throw new Error(`Required method «getExtraAttributes» to be overriden by «AbstractSchemaEntity» inherited class on «AbstractSchemaEntity.getExtraAttributes»`);
    }
  }
  class AbstractItem { }
  class AbstractList {
    constructor(value) {
      this.value = Array.isArray(value) ? value : [];
    }
    forEach(callback) {
      this.value.forEach(callback);
      return this;
    }
    filter(callback) {
      this.value = this.value.filter(callback);
      return this;
    }
    map(callback) {
      this.value = this.value.map(callback);
      return this;
    }
    reduce(callback, initialValue = []) {
      this.value = this.value.reduce(callback, initialValue);
      return this;
    }
    modify(callback) {
      this.value = callback(this.value);
      return this;
    }
    concat(...lists) {
      this.value = this.value.concat(...lists);
      return this;
    }
    onlyProp(prop) {
      this.value = this.value.map(it => it[prop]);
      return this;
    }
    onlyProps(props) {
      this.value = this.value.map(it => {
        const out = {};
        props.forEach(prop => {
          out[prop] = it[prop];
        });
        return out;
      });
      return this;
    }
    removeProp(prop) {
      return this.removeProps([prop]);
    }
    removeProps(props) {
      this.value = this.value.map(it => {
        const out = {};
        const keys = Object.keys(it).filter(prop => {
          return props.indexOf(prop) === -1;
        });
        keys.forEach(key => {
          out[key] = it[key];
        });
        return out;
      });
      return this;
    }
    deduplicate() {
      const out = [];
      this.value.forEach(it => {
        if (out.indexOf(it) === -1) {
          out.push(it);
        }
      });
      this.value = out;
      return this;
    }
    sort(callback) {
      this.value = this.value.sort(callback);
      return this;
    }
  };

  class LswProxifier {
    static create(...args) {
      return new this(...args);
    }
    AbstractProxy = AbstractProxy;
    AbstractSchemaEntity = AbstractSchemaEntity;
    AbstractVirtualizer = AbstractVirtualizer;
    AbstractItem = AbstractItem;
    AbstractList = AbstractList;
    constructor(mainInjection = {}) {
      this.$definitions = {};
      this.$mainInjection = mainInjection;
      this.$splitterChar = "@";
    }
    define(name, classesDef) {
      if(!(name in this.$definitions)) {
        this.$definitions[name] = {};
      }
      if(typeof classesDef !== "object") {
        throw new Error(`Required parameter «classesDef» to be a class on «LswProxifier.define»`)
      }
      const classesIds = Object.keys(classesDef);
      for(let index=0; index<classesIds.length; index++) {
        const classId = classesIds[index];
        const classDef = classesDef[classId];
        if(typeof classDef !== "function") {
          throw new Error(`Required proxy class «${classId}» to be a class on «LswProxifier.define»`)
        }
      }
      Object.assign(this.$definitions[name], classesDef);
    }
    find(selector) {
      const [name, aspectId = false] = selector.split(this.$splitterChar);
      if(!(name in this.$definitions)) {
        throw new Error(`Could not find proxy classes from name «${name}» on «LswProxifier.find»`);
      }
      if(!aspectId) {
        return this.$definitions[name];
      }
      if(!(aspectId in this.$definitions[name])) {
        throw new Error(`Could not find proxy aspect «${aspectId}» from class «${name}» on «LswProxifier.find»`);
      }
      return this.$definitions[name][aspectId];
    }
    getFactory() {
      return this.proxify.bind(this);
    }
    proxify(obj) {
      return {
        as: (typeSelector = "", proxyExtraArguments = []) => {
          if(typeof typeSelector !== "string") {
            throw new Error(`Required parameter «typeSelector» to be a string on «proxify(@).as(@)»`);
          }
          const [definitionId, aspectId = "Item"] = typeSelector.split(this.$splitterChar);
          if(!(definitionId in this.$definitions)) {
            throw new Error(`Required parameter «definitionId» [«${definitionId}»] to exist in «proxifier.$definitions» but it does not on «proxify(@).as(@)`);
          }
          if(!(aspectId in this.$definitions[definitionId])) {
            throw new Error(`Required parameter «aspectId» [«${aspectId}»] to exist in «proxifier.$definitions[${JSON.stringify(definitionId)}]» but it does not on «proxify(@).as(@)`);
          }
          const proxyClass = this.$definitions[definitionId][aspectId];
          const proxyInstance = new proxyClass(obj, ...proxyExtraArguments);
          if(typeof this.$mainInjection === "function") {
            this.$mainInjection(proxyInstance, proxyClass);
          } else if(typeof this.$mainInjection === "object") {
            Object.assign(proxyInstance, this.$mainInjection);
          }
          return proxyInstance;
        }
      };
    }
  };

  LswProxifier.default = LswProxifier;

  globalThis.$proxifier = LswProxifier.create();
  // @code.end: LswProxifier class

  return LswProxifier;

});
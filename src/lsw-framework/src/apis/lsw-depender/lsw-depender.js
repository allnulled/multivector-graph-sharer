(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswDepender'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswDepender'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  /**
   * 
   * 
   * @$section: Lsw Depender API » LswDepender class
   * @type: class
   * @extends: Object
   * @vendor: lsw
   * @namespace: LswDepender
   * @source code: La clase está definida así:
   * 
   */
  // @code.start: LswDepender class | @section: Lsw Depender API » LswDepender class
  const Definition = class {
    constructor({ id, dependencies = [] }) {
      this.id = id;
      this.dependencies = dependencies;
    }
  };

  const LswDepender = class {

    static create(...args) {
      return new this(...args);
    }

    constructor(definitions = {}) {
      this.$definitions = definitions;
    }

    hasDefined(name) {
      if (name in this.$definitions) {
        if (this.$definitions[name] instanceof Definition) {
          return true;
        }
      }
      return false;
    }

    define(...args) {
      if (typeof args[0] === "string") {
        return this.addDefinition(...args);
      }
      return this.addUniqueDefinitions(...args);
    }

    resolve(idsInput = this, defs = this.$definitions) {
      const ids = idsInput === this ? Object.keys(this.$definitions) : idsInput;
      let resolved = new Set();
      let resultado = [];
      const resolverNodo = function(id) {
        console.log("resolviendo nodo:", id, defs);
        if (resolved.has(id)) return;
        if (!defs[id]) return; // Si no está definido, lo ignoramos
        for (let dep of defs[id].dependencies || []) {
          resolverNodo(dep);
        }
        resolved.add(id);
        resultado.push(id);
      }
      for (let id of [].concat(ids)) {
        resolverNodo(id);
      }
      return resultado;
    }

    addDefinition(name, definition, shouldFailOnRedundancy = 1, shouldOverrideOnRedundancy = 1) {
      Validation: {
        if (this.hasDefined(name)) {
          if (shouldFailOnRedundancy) {
            throw new Error(`Dependency «${name}» is already defined and should not redund on «LswDepender.define»`);
          } else if (!shouldOverrideOnRedundancy) {
            return false; // !@BREAK: the fallback must not override it
          } else if (shouldOverrideOnRedundancy) {
            // !@OK: the fallback will override it
          } else {
            throw new Error("Cannot logically happen (1)");
          }
        }
      }
      Define_it: {
        if (typeof definition !== "object") {
          throw new Error(`Required definition of «${name}» to be an object on «LswDepender.define»`);
        } else if (typeof definition.id !== "string") {
          definition.id = name;
        } else if (Array.isArray(definition.dependencies)) {
          throw new Error(`Required definition of «${name}» its property «dependencies» to be a array on «LswDepender.define»`);
        } else {
          for (let indexDependency = 0; indexDependency < definition.dependencies.length; indexDependency++) {
            const dependencyRef = definition.dependencies[indexDependency];
            if (typeof dependencyRef !== "string") {
              throw new Error(`Required definition of «${name}» its property «dependencies» on its index «${indexDependency}» to be a string on «LswDepender.define»`);
            }
          }
        }
        this.$definitions[name] = new Definition(definition);
      }
    }

    addUniqueDefinitions(moreDefinitions = {}) {
      const definitionIds = Object.keys(moreDefinitions);
      for (let indexId = 0; indexId < definitionIds.length; indexId++) {
        const definitionId = definitionIds[indexId];
        const definitionInstance = moreDefinitions[definitionId];
        this.define(definitionId, definitionInstance, 1);
      }
    }

    addMissingDefinitions(moreDefinitions = {}) {
      const definitionIds = Object.keys(moreDefinitions);
      for (let indexId = 0; indexId < definitionIds.length; indexId++) {
        const definitionId = definitionIds[indexId];
        const definitionInstance = moreDefinitions[definitionId];
        this.define(definitionId, definitionInstance, 0, 0);
      }
    }

    resetDefinitions(moreDefinitions = {}) {
      const definitionIds = Object.keys(moreDefinitions);
      for (let indexId = 0; indexId < definitionIds.length; indexId++) {
        const definitionId = definitionIds[indexId];
        const definitionInstance = moreDefinitions[definitionId];
        this.define(definitionId, definitionInstance, 0, 1);
      }
    }

    deleteDefinitions(definitionsInput = []) {
      const definitions = Array.isArray(definitionsInput) ? definitionsInput : [definitionsInput];
      for (let indexDefinition = 0; indexDefinition < definitions.length; indexDefinition++) {
        const definitionId = definitions[indexDefinition];
        delete this.$definitions[definitionId];
      }
    }

  }

  LswDepender.default = LswDepender;
  // @code.end: LswDepender class

  return LswDepender;

});
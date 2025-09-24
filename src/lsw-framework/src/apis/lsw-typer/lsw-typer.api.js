(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswTyper'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswTyper'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  // @code.start: LswTyper API | @$section: LswTyper API » LswTyper class
  class LswTyper {

    static parse(jsontypedText) {
      return LswTyperParser.parse(jsontypedText);
    }

    constructor(types = {}) {
      this.$types = types;
    }

    define(typeId, typeCallback) {
      this.$types[typeId] = typeCallback;
    }

    getTypeCallbackById(typeId) {
      return this.$types[typeId] || null;
    }

    parse(jsontypedText) {
      const ast = this.constructor.parse(jsontypedText);
      const json = this.constructor.resolveTypes(ast, this.$types);
      return JSON.parse(json);
    }

    static resolveTypes(input, reducers) {
      return JSON.stringify(input, (key, value) => {
        const isTyped = value && (typeof value === 'object') && ("$value" in value) && ("$type" in value);
        // Filtramos los que no son type:
        if (!isTyped) {
          return value;
        }
        console.log("is typed:", key, value);
        const $types = Array.isArray(value.$type) ? value.$type : [value.$type];
        Iterating_possible_types:
        for(let index=0; index<$types.length; index++) {
          const reducerId = $types[index];
          // Filtramos los que cuyo $type no se encuentra entre los reducers:
          if(!(reducerId in reducers)) {
            console.log("Id not found:", reducerId);
            continue Iterating_possible_types;
          }
          console.log("Id reduceable:", reducerId);
          // Aplicamos el reducer pertinente...
          const reducer = reducers[reducerId];
          const result = reducer(value);
          // Y si devuelven diferente de undefined...
          console.log("Reduction:", result);
          if (typeof result !== "undefined") {
            // Los retornamos.
            return result;
          }
        }
        // Y si no devolvemos lo normal.
        return value;
      }, 2);
    }

  }

  globalThis.$lswTyper = new LswTyper();

  return LswTyper;
  // @code.end: LswTyper API

});
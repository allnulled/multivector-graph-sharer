(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswCircuiter'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswCircuiter'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  // @code.start: LswCircuiter class | @$section: Lsw Circuiter API » LswCircuiter class
  class AsyncCircuit {

    static create(...args) {
      return new this(...args);
    }

    constructor() {
      this.middlewares = [];
    }

    hook(callback) {
      this.middlewares.push(callback);
      return this;
    }

    prehook(callback) {
      this.middlewares.unshift(callback);
      return this;
    }

    unhook(callback) {
      const pos = this.middlewares.indexOf(callback);
      if(pos !== -1) {
        this.middlewares.splice(pos, 1);
      }
      return this;
    }

    // Función principal para parsear el árbol
    parse(node) {
      // Si el nodo es un array (ejecutar en paralelo)
      if (Array.isArray(node)) {
        const code = node.map(cb => this.parse(cb)).join(',');
        return `Promise.all([${code}])`; // Convertimos todo en un Promise.all
      }

      // Si es un objeto con $type y $callbacks
      if (node && typeof node === 'object') {
        Inject_middlewares: {
          for(let index__middleware=0; index__middleware<this.middlewares.length; index__middleware++) {
            const middleware = this.middlewares[index__middleware];
            const result = middleware(node);
          }
        }
        const { $type, $callbacks } = node;
        const callbacks = $callbacks.map(cb => (typeof cb === 'function' ? `(${cb.toString()})()` : this.parse(cb)));
        // Dependiendo del tipo, generamos el código adecuado
        switch ($type) {
          case 'parallel':
            return `Promise.all([\n  ${callbacks.join(',')}\n  ])`; // Ejecutar en paralelo
          case 'serie':
            return `(async () => {\n  ${callbacks.map(cb => `await ${cb}`).join('; ')}\n  })()`; // Ejecutar en serie
          case 'race':
            return `Promise.race([\n  ${callbacks.join(',')}\n  ])`; // Ejecutar en carrera
          case 'sync':
            return `(() => {\n  ${callbacks.join(';\n  ')};\n  return Promise.resolve();\n  })()`; // Ejecutar síncrono
          default:
            throw new Error(`Required property «$type» to be one known but found «${$type}» on «this.parse»`);
        }
      }

      // Si el nodo es una función, la transformamos directamente
      if (typeof node === 'function') {
        return `(${node.toString()})()`; // Convertimos la función en una llamada inmediata
      }

      throw new Error(`Required argument «node» to be of known type but found «${typeof $type}» on «this.parse»`);
    }

    // Método que ejecuta el código generado por eval
    async execute(node, externalScope = {}) {
      const code = this.parse(node);
      const AsyncFunction = (async function() {}).constructor;
      const argKeys = Object.keys(externalScope).join(", ");
      const argValues = Object.values(externalScope);
      const asyncFunction = new AsyncFunction(argKeys, code);
      return await asyncFunction(...argValues); // Ejecutamos el código generado con eval
    }
  }
  // @code.end: LswCircuiter class

  return AsyncCircuit;
});

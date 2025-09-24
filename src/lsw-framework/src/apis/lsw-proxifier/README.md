# lsw-proxifier

Class proxifier tool for LSW.

## Installation

```sh
npm install -s @allnulled/lsw-proxifier
```

## Importation

In node.js:

```js
require("@allnulled/lsw-proxifier");
```

In browser:

```html
<script src="node_modules/@allnulled/lsw-proxifier/proxifier.unbundled.js"></script>
```

## ¿Para qué es?

Sirve para crear proxies de definiciones, objetos y listas usando clases previamente registradas.

## ¿Qué features tiene?

- Nombre de espacios y API vía clase.
- Inyección global a todos los proxis vía instanciación del Proxifier.
- Definición centralizada de clases proxi.
- API básica para listas (arrays, opcional).
- Ciclo de inicialización incluído en el flujo normal de la API.
- Te deja obtener un factory para abreviar 1 acceso, del `proxifier` a su método `proxy`. Na, chorradas.
- Te permite tener tu propio sistema de jerarquía de clases independiente del sistema: el sistema se acuerda de usar el `initialize` que llama al `onInitialize`, y de guardarte en un árbol la indexación de clases que tú luego abrevias con el `.` en el `name`.
- Es una API que sí respeta las interfaces nativas del lenguaje.
- Bueno, ocupa el namespace `Proxifier`.


## ¿Cuál es la idea de uso?

Primero instancias un proxifier:

```js
const proxifier = new Proxifier({
  // Aquí inyectas para todos manualmente (no prototipo sino Object.assign en el constructor):
  $api: mi.super.api()
});
```

Segundo registras tus propias clases de proxis:

```js
proxifier.define("Mi.Super.Proxy.Con.Namespaces.Automatico.Siii", class extends proxifier.Item {
  // Aquí inyectas para los proxis de objetos:
}, class extends proxifier.List {
  // Aquí inyectas para los proxis de listas:
  constructor(other, args) {
    // Este método se llama automáticametne al proxificar.
  }
  onInitialize(initialize, args) {
    // Este método [es especial porque] se llama automáticamente al proxificar [y no es el constructor].
  }
});
```

Tercero instancias tus propios proxis:

```js
proxifier.proxify({}).as("Mi.Super.Proxy.Con.Namespaces.Automatico.Siii");
proxifier.proxify([]).as("Mi.Super.Proxy.Con.Namespaces.Automatico.Siii");
proxifier.proxify([]).as("Mi.Super.Proxy.Con.Namespaces.Automatico.Siii", "item");
proxifier.proxify([]).as("Mi.Super.Proxy.Con.Namespaces.Automatico.Siii", "list");
// Quizá esta línea explique el ejemplo anterior, los nombres de los parámetros:
proxifier.proxify([]).as("Mi.Super.Proxy.Con.Namespaces.Automatico.Siii", "list", ["other", "args"], ["initialize", "args"]);
```

## Test

The test goes as follows:

```js
require(__dirname + "/proxifier.unbundled.js");

// Definir "SomeClass"
const proxifier = new Proxifier({
  // This object is for global, manual injections:
  saludate(somebody) {
    console.log("Hi, " + somebody);
    return this;
  }
});
proxifier.define("SomeClass",
  // This class is for objects:
  class extends proxifier.Item {
    print() {
      console.log("item", this.value);
      return this;
    }
  },
  // This class is for arrays:
  class extends proxifier.List {
    print() {
      console.log("list", this.value);
      console.log("items", this.value.length);
      return this;
    }
  }
);
proxifier.proxify({}).as("SomeClass").print();  // Debería imprimir "item {}"
proxifier.proxify([1, 2, 3]).as("SomeClass").print();  // Debería imprimir la lista y la cantidad de elementos
proxifier.proxify([1, 2, 3]).as("SomeClass").sort((a,b) => a<b?1:-1).print();
proxifier.proxify([1, 2, 3]).as("SomeClass").map(i => i*2).print();
proxifier.proxify([1, 2, 3]).as("SomeClass").filter(i => (i % 2) === 0).print();
proxifier.proxify([{a:0,b:1,c:1,d:1},{a:0,b:1,c:1,d:1},{a:0,b:1,c:1,d:1}]).as("SomeClass").onlyProp("b").print();
proxifier.proxify([{a:0,b:1,c:1,d:1},{a:0,b:1,c:1,d:1},{a:0,b:1,c:1,d:1}]).as("SomeClass").onlyProps(["a","d"]).print();
proxifier.proxify([{a:0,b:1,c:1,d:1},{a:0,b:1,c:1,d:1},{a:0,b:1,c:1,d:1}]).as("SomeClass").removeProp("a").print();
proxifier.proxify([{a:0,b:1,c:1,d:1},{a:0,b:1,c:1,d:1},{a:0,b:1,c:1,d:1}]).as("SomeClass").removeProps(["a","d"]).print();
proxifier.proxify([1,1,2,3,2,4,5,5,6,2,2,2,1]).as("SomeClass").deduplicate().print().saludate("user!").print();

proxifier.define("com.namespaced.async.RandomClass", class extends proxifier.Item {
  // Fill randomly:
}, class extends proxifier.List {
  constructor(value, a, b, c) {
    super(value);
    console.log(a,b,c);

  }
  // Fill randomly:
  onInitialize(a,b,c) {
    console.log(a,b,c);
    this.value = 500; // This is bad because you break compatibility, but you still could do it, it's JS.
    return;
  }
});

// Check that namespaces are naturally made by using . as separator:
console.log(proxifier.classes.com.namespaced.async.RandomClass.Item);
console.log(proxifier.classes.com.namespaced.async.RandomClass.List);

proxifier.proxify({}).as("com.namespaced.async.RandomClass").saludate("Hi!");

// To force typage you can:
const forcedList = proxifier.proxify({}).as("com.namespaced.async.RandomClass", "list");
const forcedItem = proxifier.proxify({}).as("com.namespaced.async.RandomClass", "item");
console.log(forcedList, forcedItem);

// You can use the factory to abbreviate:
const proxy = proxifier.getFactory();
proxy({}).as("com.namespaced.async.RandomClass", "item").saludate("user");
// This is a demo on how to use the [constructor args], [initialize args] on proxification:
proxy({}).as("com.namespaced.async.RandomClass", "list", [400,500,600], [100, 200, 300]).saludate("user");
```

## Source code

El fuente es muy sencillo. Ahí tienes la API completa de verbos para los proxis de lista que vienen incluidos:

```js
(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['Proxifier'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['Proxifier'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  class BaseClass {
    initialize(...args) {
      const promise = this.onInitialize(...args);
      if(promise instanceof Promise) {
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

  class Proxifier {
    constructor(injection = {}) {
      const that = this;
      this.injection = injection;
      this.classes = {};
      this.Item = class extends BaseClass {
        constructor(value) {
          super(value);
          this.value = value;
          Object.assign(this, that.injection);
        }
      };
      this.List = class extends BaseClass {
        constructor(value) {
          super(value);
          this.value = Array.isArray(value) ? value : [];
          Object.assign(this, that.injection);
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
    }
    _get(obj, path) {
      return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }
    _set(obj, path, value) {
      let keys = path.split('.');
      let lastKey = keys.pop();
      let target = keys.reduce((acc, key) => acc[key] ??= {}, obj);
      target[lastKey] = value;
      return obj;
    }
    define(name, ItemClass, ListClass) {
      this._set(this.classes, name, {
        Item: ItemClass,
        List: ListClass
      });
    }
    getFactory() {
      return this.proxify.bind(this);
    }
    proxify(obj) {
      return {
        as: (name, forceSubtype = false, constructorArgs = [], initializeArgs = []) => {
          const ClassDef = this._get(this.classes, name);
          if (!ClassDef) {
            throw new Error(`Required parameter «${name}» to exist as defined class in «typifier.proxify(...).as»`);
          }
          let instance = undefined;
          Instantiation:
          if (!forceSubtype) {
            if (Array.isArray(obj)) {
              instance = new ClassDef.List(obj, ...constructorArgs);
              break Instantiation;
            }
            instance = new ClassDef.Item(obj, ...constructorArgs);
          } else if (["list", "item"].indexOf(forceSubtype) === -1) {
            throw new Error("Required parameter «forceSubtype» to be a valid string or false on «Proxifier.proxify(...).as»");
          } else if (forceSubtype.toLowerCase() === "list") {
            instance = new ClassDef.List(obj, ...constructorArgs);
          } else if (forceSubtype.toLowerCase() === "item") {
            instance = new ClassDef.Item(obj, ...constructorArgs);
          } else {
            throw new Error("This cannot logically happen");
          }
          if(typeof instance.initialize === "function") {
            return instance.initialize(...initializeArgs);
          }
          return this;
        }
      };
    }
  };

  Proxifier.default = Proxifier;

  return Proxifier;

});
```
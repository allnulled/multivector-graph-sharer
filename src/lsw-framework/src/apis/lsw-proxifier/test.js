require(__dirname + "/proxifier.unbundled.js");

// Definir "SomeClass"
const proxifier = new LswProxifier({
  // This object is for global, manual injections:
  saludate(somebody) {
    console.log("Hi, " + somebody);
    return this;
  }
});
proxifier.define("SomeClass", {
  // This class is for objects:
  Item: class extends proxifier.AbstractItem {
    print() {
      console.log("item", this.value);
      return this;
    }
  },
  // This class is for arrays:
  List: class extends proxifier.AbstractList {
    print() {
      console.log("list", this.value);
      console.log("items", this.value.length);
      return this;
    }
  },
  // This class is for schema definition:
  Definition: class extends proxifier.AbstractSchemaEntity {

  }
});
proxifier.proxify({}).as("SomeClass@Item").print();  // Debería imprimir "item {}"
proxifier.proxify([1, 2, 3]).as("SomeClass@List").print();  // Debería imprimir la lista y la cantidad de elementos
proxifier.proxify([1, 2, 3]).as("SomeClass@List").sort((a, b) => a < b ? 1 : -1).print();
proxifier.proxify([1, 2, 3]).as("SomeClass@List").map(i => i * 2).print();
proxifier.proxify([1, 2, 3]).as("SomeClass@List").filter(i => (i % 2) === 0).print();
proxifier.proxify([{ a: 0, b: 1, c: 1, d: 1 }, { a: 0, b: 1, c: 1, d: 1 }, { a: 0, b: 1, c: 1, d: 1 }]).as("SomeClass@List").onlyProp("b").print();
proxifier.proxify([{ a: 0, b: 1, c: 1, d: 1 }, { a: 0, b: 1, c: 1, d: 1 }, { a: 0, b: 1, c: 1, d: 1 }]).as("SomeClass@List").onlyProps(["a", "d"]).print();
proxifier.proxify([{ a: 0, b: 1, c: 1, d: 1 }, { a: 0, b: 1, c: 1, d: 1 }, { a: 0, b: 1, c: 1, d: 1 }]).as("SomeClass@List").removeProp("a").print();
proxifier.proxify([{ a: 0, b: 1, c: 1, d: 1 }, { a: 0, b: 1, c: 1, d: 1 }, { a: 0, b: 1, c: 1, d: 1 }]).as("SomeClass@List").removeProps(["a", "d"]).print();
proxifier.proxify([1, 1, 2, 3, 2, 4, 5, 5, 6, 2, 2, 2, 1]).as("SomeClass@List").deduplicate().print().saludate("user!").print();

proxifier.define("com.namespaced.async.RandomClass", {
  Item: class extends proxifier.AbstractItem {
    // Fill randomly:
  },
  List: class extends proxifier.AbstractList {
    constructor(value, a, b, c) {
      super(value);
      console.log(a, b, c);

    }
    // Fill randomly:
    onInitialize(a, b, c) {
      console.log(a, b, c);
      this.value = 500; // This is bad because you break compatibility, but you still could do it, it's JS.
      return;
    }
  }
});

// Check that namespaces are naturally made by using . as separator:
console.log(proxifier.$definitions["com.namespaced.async.RandomClass"].Item);
console.log(proxifier.$definitions["com.namespaced.async.RandomClass"].List);

proxifier.proxify({}).as("com.namespaced.async.RandomClass").saludate("Hi!");

// To force typage you can:
const forcedList = proxifier.proxify({}).as("com.namespaced.async.RandomClass@List");
const forcedItem = proxifier.proxify({}).as("com.namespaced.async.RandomClass@Item");
console.log(forcedList, forcedItem);

// You can use the factory to abbreviate:
const proxy = proxifier.getFactory();
proxy({}).as("com.namespaced.async.RandomClass@Item").saludate("user");
// This is a demo on how to use the [constructor args], [initialize args] on proxification:
proxy({}).as("com.namespaced.async.RandomClass@List", [400, 500, 600], [100, 200, 300]).saludate("user");
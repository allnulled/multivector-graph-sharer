# lsw-trigger

Register and emit async triggers using asterisks, names, priority and parameters. Less than 100 lines script.

Branch of [@allnulled/triggers-class](https://github.com/allnulled/triggers-class).

## Installation

```sh
npm i -s @allnulled/lsw-trigger
```

## Import

In node.js:

```js
require("@allnulled/lsw-trigger");
```

In html:

```html
<script src="node_modules/@allnulled/lsw-trigger/triggers-class.js"></script>
```

Then you can use `window.TriggersClass` or `global.TriggersClass`.

## API

These are the signatures of the methods:

```js
TriggersClass.globMatch(patterns, list);
const triggersClass = new TriggersClass();
triggersClass.all = {};
triggersClass.register(triggerNamePattern, triggerIdentifier, triggerCallback, triggerConfigurations = {});
await triggersClass.emit(triggerName, parameters = {});
triggersClass.unregister(triggerIdentifier);
```

The `globMatch` static method accepts a patterns list, and a texts list. It will return the texts that match at least one pattern.

The `register` method requires `name:string`, `identifier:string` and `callback:function`. Optionally, `configurations:object`. 
  - `name` is the name of the event. This one accepts `*` as any character/s, like glob patterns.
  - `identifier` is the name of this registration.
  - `callback` is the function triggered.
  - `configurations` is an object. It can have `priority` as a number. The higher, the sooner. Passed to the callback too.

The `emit` method requires `name:string` with the name of the event (no `*` accepted here). Optionally, `parameters:object`, passed to the callback too.

The `unregister` method requires only `identifier:string`, the same used on `register` call previously.

## Example

This is the current test of the library.

```js
console.log(TriggersClass.globMatch([
    "crud.insert.*.users",
    "crud.*.many.users"
], [
    "crud.select.one.users",
    "crud.select.many.users",
    "crud.insert.one.users",
    "crud.insert.many.users",
    "crud.update.one.users",
    "crud.update.many.users",
    "crud.delete.one.users",
    "crud.delete.many.users",
]));
const triggers = new TriggersClass();
let counter = 0;
triggers.register("crud.insert.one.tabla1", "temp1", function () {
    console.log("triggering temp1");
    counter -= 2;
    return 100;
}, {
    priority: 20
});
triggers.register("crud.insert.one.tabla1", "temp2", function () {
    console.log("triggering temp2");
    counter *= 10;
    return 10;
}, {
    priority: 10
});
triggers.register("crud.insert.one.tabla1", "temp3", function () {
    console.log("triggering temp3");
    counter += 5;
    return 1;
}, {
    priority: 30
});
const output = await triggers.emit("crud.insert.one.tabla1", { in: 500 });
const outputSum = output.reduce((o,i) => {
    o += i;
    return o;
}, 0);
setTimeout(() => {
    console.log(counter);
    console.log(outputSum);
    if(counter !== 30) {
        throw new Error("Triggers order is not as expected");
    }
    if(outputSum !== 111) {
        throw new Error("Emit is not working as expected");
    }
}, 1000);
```


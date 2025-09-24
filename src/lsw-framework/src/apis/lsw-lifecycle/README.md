# lsw-lifecycle

Lifecycle tool for LSW.

This package depends by default on:

 - [`@allnulled/lsw-cycler`](https://github.com/allnulled/lsw-cycler).
 - [`@allnulled/lsw-trigger`](https://github.com/allnulled/lsw-trigger).
 - [`@allnulled/lsw-database`](https://github.com/allnulled/lsw-database).
 - [`@allnulled/lsw-schema`](https://github.com/allnulled/lsw-schema).
 - [`@allnulled/lsw`](https://github.com/allnulled/lsw).

## Installation

```sh
npm i -s @allnulled/lsw-lifecycle
```

## Importation

From node.js you have to:

```sh
require("node_modules/@allnulled/lsw-lifecycle/lsw-lifecycle.js");
```

From html you have to:

```html
<script src="node_modules/@allnulled/lsw-lifecycle/lsw-lifecycle.js"></script>
```

## API

The global variable is found at `window.LswLifecycle`.

It is an instance of `LswCycler` with a predefined set of methods, defined on its `LswLifecycle.steps` property.

## Conclusion

This is a package used to pack some utilities. It is not used in the project right now.
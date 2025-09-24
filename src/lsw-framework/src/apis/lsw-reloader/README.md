# lsw-reloader

Reloader/reloadable tool for LSW.

## Installation

```sh
npm i -s @allnulled/lsw-reloader
```

## Importation

From node.js you have to:

```sh
node node_modules/@allnulled/lsw-reloader/reloader.js
```

From html you have to:

```html
<script src="node_modules/@allnulled/lsw-reloader/reloadable.js"></script>
```

Then you bind changes on back to refresh on front.

## API

If you don't like to polute your node_modules folder, you can use the API:

```js
const reloader = require("@allnulled/lsw-reloader/reloader.js");

await reloader({
    directory: __dirname,
    port: 3000,
    files: ["**/*.js"],
    filter: filepath => true
});
```

And with this, you set up a server, with socket.io, listening for browsers that want to be automatically reloaded, loading `reloadable.js` from the front-side.

## CLI

No CLI right now.


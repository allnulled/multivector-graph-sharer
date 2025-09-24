# lsw-tester

Test management for LSW.

## Installation

```sh
npm i -s @allnulled/lsw-tester
```

## Importation

In node.js:

```js
require("@allnulled/lsw-tester");
```

In html:

```html
<script src="node_modules/@allnulled/lsw-tester/lsw-tester.js"></script>
```

## Features

- 📦 modulable: can pack test modules.
- ➡️ usable: can use the API with 1 simple (chainable pattern) function call.
- 🫖 filtrable: can label tests with: always, normally, only, never.
- ⏰ timeoutable: can attach a timeout to any module
- 🎥 reportable: can report in runtime by events or by final JSON.
- 🔎 detailable: can see the assertions on runtime.
- 🔃 reusable: can compose modules by modules and assertions (meaning functions).
- 🌀 nestable: for the same reason.


# lsw-randomizer

Randomizer utilities for LSW.

## Installation

```sh
npm i -s @allnulled/lsw-randomizer
```

## Importation

From node.js you have to:

```sh
require("node_modules/@allnulled/lsw-randomizer/lsw-randomizer.js");
```

From html you have to:

```html
<script src="node_modules/@allnulled/lsw-randomizer/lsw-randomizer.js"></script>
```

## API

The global variable is found at `window.LswRandomizer`.

These are the available signatures for now:

```js
class LswRandomizer {
    static getRandomIntegerBetween(start = 0, end = 100) {}
    static getRandomString(len, alphabet = this.$defaultAlphabet) {}
    static getRandomItem(list) {}
    static getRandomObject(totalProps = [0, 10], listOf = false) {}
}
```
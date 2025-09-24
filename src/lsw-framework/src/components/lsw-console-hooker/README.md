# lsw-console-hooker

Console hooker UI tool for LSW.

Based on [vue@2](#) (optionally).

## Installation

```sh
npm i -s @allnulled/console-hooker
```

## Importation

If you plan to use it along with the [vue@2](#) component, you can:

```html
<script src="node_modules/@allnulled/lsw-console-hooker/console-hooker-api.js"></script>
<script src="node_modules/@allnulled/lsw-console-hooker/console-hooker.js"></script>
<link rel="stylesheet" type="text/css" href="node_modules/@allnulled/lsw-console-hooker/console-hooker.css" />
```

If you plan to use the API only, import the API and avoid the other 2 files.

## Usage

The working protocol is:

 - You inject the JS of the API via script tags
 - You inject a new instance of `ConsoleHooker` providing the ID of the HTML tag
 - You can log freely, and it will be reflected in the HTML.

If you use the [vue@2](#) component, you only need to inject the component, and the UI logic (to not overflood messages) is provided for you.

If you do not use the [vue@2](#) component, you can hook the node.js console or whatever.

In fact, if the ID of the HTML tag is not matched, it will fail silently the DOM injection and continue.

So, if you plan to do something else, override the method `writeToHtml(method, args)` so you can get the desired behaviour of the library/hook.

### Usage with vue@2

In your [vue@2](#) template:

```html
<lsw-console-hooker />
```

### Usage without vue@2

In your JavaScript:

```js
const consoleHooker = new ConsoleHooker("tag-id");
```

Later, you only need to:

```js
consoleHooker.restoreConsole();
```


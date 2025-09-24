# lsw-toasts

Toasts manager tool for LSW.

Based on [vue@2](#).

## Installation

```sh
npm i -s @allnulled/lsw-toasts
```

## Importation

```html
<script src="node_modules/@allnulled/lsw-toasts/lsw-toasts.compiled.js"></script>
<link rel="stylesheet" type="text/css" href="node_modules/@allnulled/lsw-toasts/lsw-toasts.css" />
```

The *compiled version* is because the template is injected to the JavaScript via a simple replace (but it is still needed).

## Usage

The only method exposed is `send`, and the only property, `sent`. You can use it this way:

```js
LswToasts.toast({
  title: "Sin título",
  message: "Sin texto",
  orientation: "top", // can be also: "bottom" or "center"
  background: "#FFF", // for css
  foreground: "#000", // for css
  timeout: 3000 // milliseconds
});
```

You can only customize colors, no orientation or else.
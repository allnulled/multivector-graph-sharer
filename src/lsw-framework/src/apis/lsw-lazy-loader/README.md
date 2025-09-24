# lsw-lazy-loader

Para cargar scripts globales, 1 sola vez o más, y asíncronamente.

# Hay 2 scripts con 1 global para cada uno

Estamos en la carpeta `lsw` de `lsw-one/src/lsw-framework/src/apis/lsw-lazy-loader`.

Los 2 scripts son `lsw-lazy-loader.js` y `lazy-loads.js`, se deben cargar por este mismo orden.

Se explican a continuación.

## LswLazyLoads

Este el el fichero `lazy-loads.js` de la API del `lsw-lazy-loader`.

Esta es la API final, la que te interesa al fin y al cabo.

```js
// Register globally:
LswLazyLoads.register({
  alias: "mylib",
  url: "https://www.whatever.com/wherever",
  type: "scriptSrc", /*
    "scriptAsync",
    "scriptSrcModule",
    "linkStylesheet",
  */
  scope: Vue.prototype.$lsw,
  getter: Vue.prototype.$noop,
  confirmer: Vue.prototype.$noop,
  confirmation: true,
  once: false,
  onceDone: false,
});

// Then you can:
await LswLazyLoads.load("mylib");
```

Ejemplo real:

```js
//Defines en un script:
LswLazyLoader.global.register({
  alias: "beautifier",
  url: "assets/lib/beautifier/beautifier.js",
  type: "scriptSrc",
  once: true,
  confirmer: () => typeof beautifier !== "undefined",
});
// Y luego, donde quieras, puedes, sin riesgo a repetir inyecciones:
await LswLazyLoader.global.load("beautifier");
// Y aquí ya puedes:
beautfier.js("let x = 90;");
```

## LswLazyLoader

Si quieres mirar un poco cómo está hecho, al final, `LswLazyLoads` es una instancia de `LswLazyLoader`.

Pero esto solo si quieres mirar un poco más por dentro, no ofrece gran cosa más esta API, solo centraliza los recursos.

Por esto es, que al final, te interesa el otro fichero.
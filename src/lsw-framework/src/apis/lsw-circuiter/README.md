# lsw-circuiter

Permite pasar árboles de sync, serie, parallel y race a función asíncrona.

Branch of [@allnulled/async-circuiter](https://github.com/allnulled/async-circuiter).

## Installación

```sh
npm i -s @allnulled/lsw-circuiter
```

## Importación

En node.js:

```js
require("@allnulled/lsw-circuiter");
```

En html:

```html
<script src="node_modules/@allnulled/lsw-circuiter/async-circuit.js"></script>
```

## Idea

La idea es poder escribir mapas de circuitos con tuberías que permitan los modos más típicos de asincronicidad que son serie, paralelo y carrera.

Se hace convirtiendo un mapa en un script que con `AsyncFunction` pasamos de código a función.

Este mapa tiene unas condiciones especiales, donde:

  - Solo se aceptan valores de tipo `function`, y `object` con una propiedad `$type` y un valor válido para ésta.
  - Las `function` son usadas como código fuente, por lo cual se usa `toString()`, no valen funciones de código nativo.
  - Los `object` son usados como pivote para grupos funcionales asíncronos.
     - Cuando `$type` es `sync` es una lista de `$callbacks` en síncrono
     - Cuando `$type` es `serie` es una lista de `$callbacks` en serie
     - Cuando `$type` es `parallel` es una lista de `$callbacks` en paralelo
     - Cuando `$type` es `race` es una lista de `$callbacks` en carrera

Sé que faltan muchas cosas, pero la API más básica sería esta, para mí.

## Uso

El test es este:

```js
// Ejemplo de uso:
const data = {};
const setData = function(obj = {}) {
    Object.assign(data, obj);
};
const tree = {
    $type: 'parallel',
    $callbacks: [
    {
        $type: 'sync',
        $callbacks: [
        () => setData({ m1: 'Sync 1' }),
        () => setData({ m2: 'Sync 2' })
        ]
    },
    {
        $type: "race",
        $callbacks: [
        async () => {
            setData({ m3: 'Async 1' });
            return 'done 1';
        },
        async () => {
            setData({ m4: 'Async 2' });
            return 'done 2';
        }
        ]
    },
    {
        $type: 'serie',
        $callbacks: [
        async () => {
            setData({ m5: 'Serie 1' });
            return 'done 3';
        },
        async () => {
            setData({ m6: 'Serie 2' });
            return 'done 4';
        }
        ]
    },
    ]
};
const asyncCircuit = AsyncCircuit.create();
asyncCircuit.hook(function(node) {
    console.log("Finished: ", node);
});
await asyncCircuit.execute(tree, { setData });
console.log('Todo listo!');
console.log(data);
if(!("m1" in data)) {
    throw new Error("m1 not found");
}
```
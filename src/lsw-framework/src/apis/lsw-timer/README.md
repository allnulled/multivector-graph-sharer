# lsw-timer

Parser simple para fecha, hora, rango, duración y lista.

Branch of [@allnulled/lsw-timer](https://github.com/allnulled/lsw-timer).

## Instalación

```sh
npm i -s @allnulled/lsw-timer
```

Y en node.js ya puedes:

```js
require("@allnulled/lsw-timer");
```

Y en html tienes que:

```html
<script src="node_modules/@allnulled/lsw-timer/lsw-timer.js"></script>
```

## Uso

Tanto en node.js como en html puedes:

```js
const time = Timeformat_parser.parse("1h 5min 30s");
```

## Formatos válidos

Permite:

  - duración: `0y 0mon 0d 0h 0min 0s 0ms`
  - fecha: `2025/01/01`
  - hora: `00:00:00.000`, `00:00:00`, `00:00`
  - fecha y hora: `2025/01/01+00:00:00.000`
  - rango de fecha y hora: `2025/01/01-2028/01/01`
  - lista de los anteriores, usando `,` para separar

Un ejemplo de cada:

```js
const out1 = Timeformat_parser.parse("1h 20min");
const out2 = Timeformat_parser.parse("1y 2mon 5d 3h 2min 10s 15ms");
const out3 = Timeformat_parser.parse("1h, 2h, 3h");
const out4 = Timeformat_parser.parse("2025/01/01+00:00:00.000");
const out5 = Timeformat_parser.parse("2025/01/01+00:00:00.000-2025/01/01+00:00:01.000");
const out6 = Timeformat_parser.parse("2025/01/01-2028/01/01");
const out7 = Timeformat_parser.parse("2025/01/01-2028/01/01, 2030/01/01-2033/01/01");
```



## Casos de uso

Parseo simple de los tipos anteriores, no mucho más. En teoría estaba `moment.js` para cosas más más.
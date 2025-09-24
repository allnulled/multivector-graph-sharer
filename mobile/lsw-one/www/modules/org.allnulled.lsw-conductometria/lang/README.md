# protolang

Lenguaje para trackeo propagativo.

Parte del ecosistema `allnulled@lsw-one`, aunque no fuerza la API.

- [protolang](#protolang)
  - [Instalación](#instalación)
  - [Compilación](#compilación)
  - [Uso](#uso)
  - [Formatos válidos](#formatos-válidos)
  - [Sintaxis](#sintaxis)
    - [Sentencia 1 de 4: definir concepto (def)](#sentencia-1-de-4-definir-concepto-def)
    - [Sentencia 2 de 4: definir función (fun)](#sentencia-2-de-4-definir-función-fun)
    - [Sentencia 3 de 4: relacionar propagadores (rel)](#sentencia-3-de-4-relacionar-propagadores-rel)
    - [Sentencia 4 de 4: incluir recurso](#sentencia-4-de-4-incluir-recurso)
    - [Notas extra](#notas-extra)
      - [Los caracteres prohibidos](#los-caracteres-prohibidos)
      - [Los parámetros de función](#los-parámetros-de-función)
      - [Los 2 tipos de propagadores](#los-2-tipos-de-propagadores)
        - [Propagador de tiempo](#propagador-de-tiempo)
        - [Propagador abierto](#propagador-abierto)
      - [Parte en inglés, parte en español](#parte-en-inglés-parte-en-español)

## Instalación

```sh
git clone [link] .
```


## Compilación

```sh
bash builder.sh
```

## Uso

Con node.js haces scripts con:

```js
require(__dirname + "/protolang.js");
const ast = ProtolangParser.parse("def concepto1, concepto2");
console.log(ast);
```

Con javascript de HTML igual, importas con un script-tag normal y ya puedes.

## Formatos válidos

Todos, cualquiera. Yo uso `*.prot` o `*.proto`. No sé aún.

## Sintaxis

Solo puedes hacer 4 cosas de momento:

 - `def`: definir concepto
 - `fun`: definir función
 - `rel`: relacionar propagadores
 - `inc`: incluir recurso

### Sentencia 1 de 4: definir concepto (def)

Puedes definir conceptos:

```proto
def concepto1, concepto2, concepto3
```

Insertará estos nombres como un `Concepto` si no estaban ya.

El único separador es la coma: `,`

### Sentencia 2 de 4: definir función (fun)

Puedes definir funciones:

```proto
fun nombre de función: parametro1, parametro2 {
    // Cuerpo de función, el parser no fuerza, pero aquí va JS.
}
```

Insertará estos nombres como un `Propagador_prototipo` si no estaban ya.

### Sentencia 3 de 4: relacionar propagadores (rel)

```proto
rel concepto1
  > concepto2 * 0.8
  > concepto3 * 0.5
  > concepto4 * 0.2
  >> nombre de función: parámetro 1, parámetro 2 /* esto iría aquí: JS.call( ### ) */
```

Insertará los `Propagador` necesarios.

  - asociando los `Propagador_prototipo` necesarios desde él.

### Sentencia 4 de 4: incluir recurso

```proto
inc ./conceptos
inc ./funciones
inc ./relaciones
```

Incluirá otro fichero o carpeta, como en el ejemplo. También `*.proto`.



### Notas extra

Las indicaciones anteriores y algunas aclaraciones de soporte son suficientes para no leerse el parser de 85 líneas actualmente.

#### Los caracteres prohibidos

En varios sitios se usan identificadores. Pues los caracteres prohibidos son:

```
FORBIDDEN_TOKENS_FOR_IDENTIFIERS = ","/"*"/":"/"{"/">"
```

#### Los parámetros de función

En protolang, hay varios lugares donde se recoge info para los parámetros de una función en JavaScript.

Según en qué lugar, se recoge de una u otra forma, porque tiene varios destinos, según:

- *es para la cabecera de una definición de función*
   - el caso de `fun x: arg1, arg2 {}`
   - no permite pasar valores por defecto desde ahí
   - sí permite nombres de variables js en orden y por comas
- *es para pasárselos a una llamada de función*
   - el caso de `rel concepto1 > concepto2 * 0.8, 200, 400, 600, 800, 1000, "otra cosa", {incluso:objetos,y:variables}`

#### Los 2 tipos de propagadores

##### Propagador de tiempo

El propagador simple, tipo `rel causa > concepto * 0.5`, es el `multiplicador de tiempo` o de duración. Lo que hace es:

  - Coge la duración de la acción anterior
  - Coge el número de la expresión
  - Los multiplica
  - Se lo asigna a una nueva acción
  - Le sobreescribe el concepto
  - Le copia otros campos:
    - tiene_inicio
  - La inyecta con efecto propagativo recursivo

Pero mayormente, sirve para multiplicar el `tiene_duracion` por un número y asignárselo.

Si usas el `1` por ejemplo, significa que o son la misma acción, o una acción alimenta en proporción igual a otro concepto.

```
rel desayunar > comer * 1
rel merendar > comer * 1
rel cenar > comer * 1
rel picar > comer * 1
```

Esto hará que si asigno `20min` a `desayunar`, también le estaré asignando a `comer`. Y lo mismo con las otras.

##### Propagador abierto

El uso normal es:

```
rel desayunar
  >> subir: <trigo>, <leche>, <azúcar>, 1, { whate: where }
  >> log
  >> bajar: "azúcar", 1
```

Son 3 modalidades de uso de propagador abierto.

  - en `subir` le pasamos "trigo", "leche" y "azúcar" como conceptos, y el resto como parámetros normales.
  - en `log` solo llamamos al propagador de log, sin conceptos ni parámetros
  - en `bajar` le pasamos el resto después de `:` como parámtros normales.

¿Cómo hace la discriminación?

Simplemente, si empieza por una lista de `<conceptos aislados así>` (recuerda que deben respetar los tokens prohibidos porque esto es un identificador), lo pillará así.

#### Parte en inglés, parte en español

El código fuente y los JSON incluso que saca, están en idiomas mezclados.

No quería mezclar la palabra `prototype`, y de momento se queda así.
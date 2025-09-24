# lsw-ensurer

Simple API to do checks and keep good error reporting. For node.js or browser.

Branch of [@allnulled/ensure](https://github.com/allnulled/ensure).

## Installation

```sh
npm install -s @allnulled/ensure
```

Then on node.js:

```js
const ensure = require("@allnulled/ensure");
```

Or on browser:

```html
<script src="node_modules/@allnulled/ensure/ensure.js"></script>
```

This will overwrite the global `ensure` as a function.

## Features

Las razones por las cuales optar por `lsw-ensurer` son:

- Encadenar comprobaciones porque es *chainable*.
- Navegar por objetos porque tienes `.its(...)` y `.back()`.
- Lanzar errores con buen reporte con la API de `LswEnsurer.ensure`/`window.$ensure`.
- Devolver solamente `true` o `false` con la API de `LswEnsurer.check`/`window.$ensure`.
- Comprobar cualquier condición programáticamente porque tienes la API base.
- Usar cómodos encadenadores para hacer comprobaciones porque tienes la API v1.
- Es una solución eficiente porque:
   - aprovecha los *prototypes* y no crea instancias nuevas.
   - aprovecha los *getters* y *setters* de JavaScript para ampliar APIs en runtime.
- Para **performance superior** puedes usar la API de `LswEnsurer.assert`/`window.$assert`.
   - es una función sencilla.
   - no instancia clases.
   - no usa configuraciones.
   - te sirve igual para reducir a 1 línea muchas comprobaciones.


## API signatures

```js
// Main global bridge:
window.LswEnsurer // Main class for the API
window.$ensurer // Throws errors
window.$check // Only chcks
window.$fails // Simple function to booleanize try-catch from a callback
window.$assert // Simple function to booleanize JS generative expressions
// Static API and constructor:
LswEnsurer.assert(condition:Boolean, errorMessage:String = "Assertion error happened");
LswEnsurer.fails(callback:Function, errorMessage:String = "Assertion error happened");
LswEnsurer.check(...args); // = new LswEnsurer(...args) injecting {asBoolean:true} in the args[1] object.
LswEnsurer.ensure(...args); // = new LswEnsurer(...args)
LswEnsurer.create(...args); // = previous
LswEnsurer.constructor(source:Object, overridings:Object = {});
// Parameters:
//   - source: object with 1 key only. The key is used as message.
//   - overridings: object with properties you want to override from default constructor.
//      - it defaults to empty
//      - it accepts {asBoolean:Boolean=false} to return true/false instead of throwing an error
const x = somewhere();
// Basic API: you can do everything with this
$ensure({x}).type(value:String); // = typeof $subject === value
$ensure({x}).notType(value:String); // = typeof $subject !== value
$ensure({x}).is(any:any); // = $subject === value
$ensure({x}).isnt(any:any); // = $subject !== value
$ensure({x}).isnt(any:any); // = $subject !== value
$ensure({x}).can(callback:Function); // = callback($subject) === true
$ensure({x}).cant(callback:Function); // = callback($subject) !== true
$ensure({x}).throws(callback:Function); // = () => try { callback($subject); reject(); } catch { resolve() }
$ensure({x}).doesntThrow(callback:Function); // = $callback()
// Verb to Be API:
$ensure({x}).to.be.string(); // = typeof $subject === "string"
$ensure({x}).to.be.number(); // = typeof $subject === "number" && isNaN($subject)
$ensure({x}).to.be.object(); // = typeof $subject === "object"
$ensure({x}).to.be.undefined(); // = typeof $subject === "undefined"
$ensure({x}).to.be.null(); // = $subject === null
$ensure({x}).to.be.boolean(); // = typeof $subject === "boolean"
$ensure({x}).to.be.instanceOf(class:Class); // = $subject instanceof class
$ensure({x}).to.be.array(); // = Array.isArray($subject)
$ensure({x}).to.be.function(); // = typeof $subject === "function"
$ensure({x}).to.be.empty(); // = $subject != [0 "" [] {} false]
$ensure({x}).to.not.be...; // = same API reflected in negation
// Verb to Have API:
$ensure({x}).to.have.key(key:String); // = Object.keys($subject).contains(key)
$ensure({x}).to.have.keys(keys:Array<String>); // = Object.keys($subject).contains(...keys)
$ensure({x}).to.have.value(value:Any); // = Object.values($subject).contains(value)
$ensure({x}).to.have.values(values:Array<Any>); // = Object.values($subject).contains(...values)
$ensure({x}).to.have.uniquelyKeys(keys:Array<String>); // = Object.keys($subject).contains(...keys) && noOtherKeys()
$ensure({x}).to.have.uniquelyValues(values:Array<any>); // = Object.keys($subject).contains(...keys) && noOtherValues()
$ensure({x}).to.not.have...; // = same API reflected in negation
// Navigation API:
$ensure({x}).its(property:String); // $subject = $subject[property]
$ensure({x}).back(levels:Integer = 1); // levels * { $subject = $subject.$parent }
$ensure({x}).safelyBack(property:String); // try * { $subject = $subject.$parent }

// Checker API is provided under `$check` and works the same but returning booleans instead of throwing errors:
$check(200).type("number");
$check("hello").type("string");
$check({msg:"hello"}).to.have.key("msg");
$check(}).to.have.key("msg");
```

Under `$check` you have all the same API but returning `true` or `false` instead of throwing a error (of class `LswEnsurer.AssertionError`).

## Performance considerations

Use `$ensure` API to validate or `throw` errors.

Use `$check` API to validate conditions only `true` or `false`.

Use crude `$assert` and `$fails` API on performance-critical scenarios. They are simple one-liner shortcut for simple patterns.

## Global injections

- The `LswEnsurer` holds a class now.
- The `$ensure` holds a function now. It calls `LswEnsurer.create(...args)`.
- The `$check` holds a function now. It calls `LswEnsurer.create(...args)` but injecting option `{asAssertion:true}`.
- The `$assert` holds a function now. It calls `LswEnsurer.assert(...args)` but injecting option `{asAssertion:true}`.
- The `$fails` holds a function now. It calls the provided `callback:1` parameter inside a `try-catch` and returns false if it does not fail.


## Note

The global namespace is critically poluted with this package:

- `globalThis.LswEnsurer`
- `globalThis.$fails`
- `globalThis.$assert`
- `globalThis.$check`
- `globalThis.$ensure`

## Test

I paste the test for you to understand alltogether:

```js
const main = async function () {

  try {

    const LswEnsurer = require(__dirname + "/ensure.js");

    Test_1: {
      // Uso de la API
      const v1 = 5;
      const v2 = 10;
      const v3 = 50;
      $ensure({ v1 }, 1).is(5);
      $ensure({ v2 }, 1).is(10);
      $ensure({ v3 }, 1).is(50);
      $ensure({ v3 }, 1).isnt(51);
      $ensure({ v3 }, 1).type("number");
      // Ejemplo del README
      const v = 500;
      $ensure({ v }, 1).is(500);
      $ensure({ v }, 1).isnt(501);
      $ensure({ v }, 1).type("number");
      $ensure({ v }, 1).notType("string");
      $ensure({ v }, 1).can(n => n > 100);
      $ensure({ v }, 1).cant(n => n < 100);
      $ensure({ v }, 1).throws(n => { throw new Error("wherever"); });
      $ensure({ v }, 1).doesntThrow(n => "ok!");
      // The API is chainable by default: (not check! It cannot chain, it always returns a boolean instead)
      $ensure({ v }, 1).is(500).isnt(200);
      // NEW FEATURE! It is the: To be or not to be API:
      $ensure({ v }, 1).to.be.number();
      $ensure({ v }, 1).to.not.be.string();
      $ensure({ v }, 1).to.not.be.object();
      $ensure({ v }, 1).to.not.be.array();
      $ensure({ v }, 1).to.not.be.undefined();
      $ensure({ v }, 1).to.not.be.null();
      $ensure({ v }, 1).to.not.be.function();
      $ensure({ v }, 1).to.not.be.instanceOf(Event);
      $ensure({ v }, 1).to.not.be.empty(); // empty is any of: [] {} "" 0 false
      // NEW FEATURE! It is the: To have or not to have API:
      const v10 = {
        b: 2,
        c: 3,
        e: 5,
        g: 7,
      }
      $ensure({ v10 }, 1).to.not.have.key("a");
      $ensure({ v10 }, 1).to.not.have.keys(["d", "f"]);
      $ensure({ v10 }, 1).to.have.key("b");
      $ensure({ v10 }, 1).to.have.keys(["c", "e", "g"]);
      $ensure({ v10 }, 1).to.have.uniquelyKeys(["b", "c", "e", "g"]);
      $ensure({ v10 }, 1).to.not.have.value(0);
      $ensure({ v10 }, 1).to.not.have.values([4, 6]);
      $ensure({ v10 }, 1).to.have.value(2);
      $ensure({ v10 }, 1).to.have.values([3, 5, 7]);
      $ensure({ v10 }, 1).to.have.uniquelyValues([2, 3, 5, 7, 9]);
      $ensure({ v10 }, 1).to.have.uniquelyValues([2, 3, 5, 7], "It only has the main numbers");
      let checkWorksToo = false;
      if ($check({ v10 }, 1).to.have.value(2)) {
        checkWorksToo = true;
      }
      if (!checkWorksToo) {
        throw new Error("Check seems to stop working, at least $check(...).to.have.value");
      }
      console.log("[*] Passed Test_1");
    }

    Test_2: {
      const v = 900;
      $ensure({ v }, 1).to.be.number();
      $ensure({ v }, 1).to.not.be.string();
      $ensure({ v }, 1).to.not.be.object();
      $ensure({ v }, 1).to.not.be.array();
      $ensure({ v }, 1).to.not.be.undefined();
      $ensure({ v }, 1).to.not.be.null();
      $ensure({ v }, 1).to.not.be.function();
      $ensure({ v }, 1).to.not.be.instanceOf(Event);
      $ensure({ v }, 1).to.not.be.empty(); // empty is any of: [] {} "" 0 false
      console.log("[*] Passed Test_2");
    }

    Test_3: {
      const nav = {
        one: {
          two: {
            three: 3
          }
        }
      };

      Demo_navigation_and_have_key: {
        $ensure({ nav }, 1)
          .its("one")
          .its("two")
          .its("three").to.be.number().is(3)
          .back().to.be.object()
          .back().to.be.object().to.have.key("two")
          .its("two").to.have.key("three")
          .back().to.not.have.key("three").to.have.key("two");
      }

      Demo_keys: {
        const piece1 = $ensure({
          nav2: {
            a: 1,
            b: 2,
            c: 3
          }
        }, 1);
        // you can say some
        piece1.to.have.keys(["a", "b"]);
        // you must say all
        Demo_uniqueKeys: {
          let demoError = false;
          try {
            // Same input as "keys" fails:
            piece1.to.have.uniquelyKeys(["a", "b"]);
            demoError = new Error("It should have failed (1)");
          } catch (error) {
            demoError = false;
            // But when you say all the keys it passes:
            piece1.to.have.uniquelyKeys(["a", "b", "c"]);
            demoError = false;
          }
          if (demoError instanceof Error) {
            throw demoError;
          }
        }
      }
      console.log("[*] Passed Test_3");
    }

    Test_4: {

      const piece1 = $ensure({
        nav2: {
          a: "a",
          b: "b",
          c: "c",
        }
      }, 1);
      Demo_values: {
        // you can say some
        piece1.to.have.values(["a", "b"]);
      }
      // you must say all
      Demo_uniqueValues: {
        let demoError = false;
        try {
          // Same input as "values" fails:
          piece1.to.have.uniquelyValues(["a", "b"]);
          demoError = new Error("It should have failed (2)");
        } catch (error) {
          demoError = false;
          // But when you say all the values it passes:
          piece1.to.have.uniquelyValues(["a", "b", "c", 9]);
          demoError = false;
        }
        if (demoError instanceof Error) {
          throw demoError;
        }
        console.log("[*] Passed Test_4");
      }
    }

    Test_6: {
      $ensure(500).type("number");
      $ensure("hello").type("string");
      $ensure([]).to.be.array().to.be.object().to.not.be.string();
      $ensure({}).to.be.object();
      // ASÍ SE HACE PARA USAR EL OBJETO COMO {ID:VALOR}: pasándole un 1 en el segundo parámetro
      $ensure({ label: "value" }, 1).type("string");
      // Pero por defecto operará contra el valor que se le pase directamente:
      $ensure({ name: "Carl" }).its("name").is("Carl");
    }

  } catch (error) {
    console.log("Error passing the test");
    console.log(error);
  }

};

main();
```

## Conclusion

No es la API última, pero sintácticamente se va acercando.

La orientación del artefacto estaría en un punto intermedio entre funcional y natural:
  - Prioridad de ser funcional siempre
     - `$assert` y `$fail` están para esto en último caso.
  - Con la opción de ser natural
     - `$ensure` y `$check` se mantienen en una línea funcional
     - pero sí que dan vueltas innecesarias al CPU para que escribas más cómodo

Estamos diciendo que:
  - La **mantenibilidad, legibilidad, accesibilidad** son factores muy importantes en la **continuidad** de los proyectos.
  - Las validaciones y aserciones son patrones:
     - de muy bajo nivel
     - que se van a repetir mucho
  - En caso de usar `$ensure` y `$check` estás sacrificando performance por mantenibilidad.
     - y *puede ser* beneficioso en suma también.
  - En caso de usar `$assert` y `$fails` estás priorizando performance por mantenibilidad.
     - y *seguro es* beneficioso en suma también.
  - La alternativa cruda ya la sabes
     - y son las expresiones booleanas en JavaScript
     - que tampoco están nada mal
     - pero si va de líneas, te toma 3, con esto 1
     - y si va de claridad, pues claramente
     - mételo ni que sea para el `$assert` y `$fails`
        - y ya verás como en cualquier momento... *ah, me iría bien algo para aserciones* o *mmm... validaciones...*.
        - son 500 líneas, digo si vas a hacer 1 proyecto que lo valga
        - si no, pilla las funciones de `$assert` y `$fails`
           - o hazte un polyfill y luego lo enganchas rápido con esto si quieres más.

Piensa además que...:

  - Puedes extender la clase y así continuar con más métodos.
     - en todo proyecto vas a repetir aserciones típicas
        - algunas de dominio, algunas no
        - recuerda que estamos aprovechando el `prototype` igual
        - puedes flatenear expresiones booleanas
           - tanto parametrizables
           - como no parametrizables
  - Puedes inyectarle en el `prototype` y extender la misma API global.
     - así con un `assign` inyectas tu API de dominio rápidamente.
     - puedes basarte en el patrón usado en `$ensure(...).to`
        - para acceder a APIs que se crean en runtime
        - pero que usan una propiedad para descubrirse
        - y conseguir un patrón *lazy loader* o a saber.
        - y creo que todavía hay un patrón mejor pero es un juego con el `prototype` que no me ha salido siempre bien.

En conjunto, son 500 líneas que, aunque parezca que intimiden, bueno, aclaran mucho el código y las recomiendo mucho de inyectar.

Compatible con browser y node.js, obvio.
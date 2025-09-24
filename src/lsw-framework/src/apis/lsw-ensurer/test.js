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
require(__dirname + "/lsw-compromiser.js");

describe("LswCompromiser API Test", function (it) {

  it("can use has, get, set, resolve, reject, unset", async function () {

    let compromiser = undefined;
    let state = {
      llaves: "arriba",
      bolsillo: "abajo",
    };
    let fns = {
      ok: () => { },
      moverBolsilloAbajo: () => {
        console.log("Mover bolsillo abajo!");
        state.bolsillo = "abajo";
      },
      moverBolsilloArriba: () => {
        console.log("Mover bolsillo arriba!");
        state.bolsillo = "arriba";
      },
      moverLlavesABolsillo: () => {
        console.log("Mover llaves a bolsillo!");
        state.llaves = "bolsillo";
      },
      sacarLlavesDeBolsillo: () => {
        console.log("Sacar llaves de bolsillo!");
        state.llaves = state.bolsillo;
      },
      empezar: () => {
        console.log("Empezamos!");
      }
    }
    Diseccion_de_promesas: {
      compromiser = LswCompromiser.create([
        "subo",
        "cojo las llaves",
        "bajo",
        "saco las llaves",
        "vamos",
      ]);
    }
    Definicion_de_propagaciones: {
      Propagaciones_prometidas: {
        // Lo que antes hacíamos así:
        Antes: {
          break Antes;
          compromiser.on("subo").then(() => compromiser.get("cojo las llaves").resolve(1));
          compromiser.on("cojo las llaves").then(() => compromiser.get("bajo").resolve(1));
          compromiser.on("bajo").then(() => compromiser.get("saco las llaves").resolve(1));
          compromiser.on("saco las llaves").then(() => compromiser.get("vamos").resolve(1));
        }
        // Que se pueda hacer ahora así:
        Ahora: {
          compromiser.propagate("subo").to("cojo las llaves").to("bajo").to("saco las llaves").to("vamos");
        }
      }
      Propagaciones_consecuentes: {
        compromiser.on("subo").then(fns.moverBolsilloArriba);
        compromiser.on("cojo las llaves").then(fns.moverLlavesABolsillo);
        compromiser.on("bajo").then(fns.moverBolsilloAbajo);
        compromiser.on("saco las llaves").then(fns.sacarLlavesDeBolsillo);
        compromiser.on("vamos").then(fns.empezar);
      }
    }
    Inicio_de_propagaciones: {
      await compromiser.get("subo").resolve(1);
    }
    Encuentro: {
      await compromiser.on("vamos");
    }
    Aserciones: {
      const { llaves, bolsillo } = state;
      ensure({ llaves }).is("abajo");
      ensure({ bolsillo }).is("abajo");
      console.log("El test fue satisfactorio!");
    }

  });

});
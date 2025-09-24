const LswTester = require(__dirname + "/lsw-tester.js");

const main = async function () {

  const results = await LswTester.global.define({
    id: "Test de ejemplo 1",
    fromCollection: [{
      id: "Inicio de tests de ejemplo 1",
      fromCollection: [{
        id: "Comprobación de módulos globales",
        fromCallback: function() {
          console.log("Hello from comprobacion de modulos globales");
        }
      }]
    }]
  }).options({
    onAnything(evento, arg) {
      console.log("En cualquier evento:", evento);
    },
    onStartTester() {
      console.log("Starting tests...");
    },
    onFinishTester() {
      console.log("Finished tests.");
    },
  }).run();

  console.log(results.getStatus());

};

main();
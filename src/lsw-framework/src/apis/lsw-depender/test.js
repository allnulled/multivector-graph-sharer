describe("LswDepender API Test", function(it) {

  it("can load the API", async function() {
    require(__dirname + "/lsw-depender.js");
  });
  
  it("can create a new instance", async function() {
    const depender = LswDepender.create();
    depender.define("causa", { dependencies: ["evento"] });
    depender.define("consecuencia", { dependencies: ["evento"] });
    depender.define("concepto", {})
    depender.define("fatalidad", { dependencies: ["consecuencia"] });
    depender.define("fortuna", { dependencies: ["consecuencia"] });
    depender.define("destino", { dependencies: ["consecuencia"] });
    depender.define("raíz", { dependencies: ["causa"] });
    depender.define("branca", { dependencies: ["raíz"] });
    depender.define("árbol", { dependencies: ["raíz"] });
    depender.define("evento", { dependencies: ["concepto"] });
    console.log(depender.resolve());
  });

});
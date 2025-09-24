const jsonParser = require(__dirname + "/lsw-typer.js");

describe("JSON Parser Test", function() {
  
  it("can parse a string", async function() {
    const resultado1 = jsonParser.parse('"hola"');
    console.log(resultado1);
  });
  
  it("can parse an object", async function() {
    const resultado1 = jsonParser.parse('{"mensaje":"hola"}');
    console.log(resultado1);
  });
  
  it("can parse a typed objects", async function() {
    const resultado1 = jsonParser.parse('@message {"mensaje":"hola"}');
    const resultado2 = jsonParser.parse('@message.from.somewhere {"mensaje":"hola"}');

    // const resultado3 = jsonParser.parse('@file://message/from/somewhere {"mensaje":"hola"}');
    // const resultado4 = jsonParser.parse('@file://message/from/somewhere.js {"mensaje":"hola"}');
    console.log(resultado1);
    console.log(resultado2);
    // console.log(resultado3);
    // console.log(resultado4);
  });
  
  it("can parse a protocoled objects", async function() {
    // const resultado1 = jsonParser.parse('@http://message {"mensaje":"hola"}');
    // const resultado2 = jsonParser.parse('@ftp://message {"mensaje":"hola"}');
    // const resultado3 = jsonParser.parse('@file://message {"mensaje":"hola"}');
    // const resultado4 = jsonParser.parse('@ufs://message.txt {"mensaje":"hola"}');
    // console.log(resultado1);
    // console.log(resultado2);
    // console.log(resultado3);
    // console.log(resultado4);
  });
  
  it("can parse pre-separated noun types", async function() {
    // const resultado1 = jsonParser.parse('@http:///root/message {"mensaje":"hola"}');
    // const resultado2 = jsonParser.parse('@ftp:///message {"mensaje":"hola"}');
    // const resultado3 = jsonParser.parse('@file:///message {"mensaje":"hola"}');
    // const resultado4 = jsonParser.parse('@ufs:///to/somewhere/message.txt?with=data&more=data#section {"mensaje":"hola"}');
    // console.log(resultado1);
    // console.log(resultado2);
    // console.log(resultado3);
    // console.log(resultado4);
  });

});
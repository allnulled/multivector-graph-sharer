const fs = require("fs");
const path = require("path");

require(__dirname + "/../protolang.js");

console.log("ProtolangParser", ProtolangParser);

describe("Protolang Parser and API Test", function (it) {

  it("can load the parser on node.js", async function () {
    ensure({ ProtolangParser }).notType("undefined");
    ensure({ ProtolangParser }).type("object");
  });

  const examplesFolder = path.resolve(__dirname + "/examples");
  const exampleFiles = fs.readdirSync(examplesFolder);
  for (let index = 0; index < exampleFiles.length; index++) {
    const file = exampleFiles[index];
    const filepath = path.resolve(examplesFolder, file);
    const contents = fs.readFileSync(filepath).toString();

    it(`can parse example «${file}»`, async function () {
      console.log("[*] Parsing: " + file);
      const ast = ProtolangParser.parse(contents, {
        tracer: {
          trace(event) {
            return console.log(event);
            const { type, rule, location } = event;
            console.log(`${type.toUpperCase()} ${rule} at line ${location.start.line}, column ${location.start.column}`);
          }
        }
      });
      console.log(JSON.stringify(ast, null, 2));
    });
  }


});
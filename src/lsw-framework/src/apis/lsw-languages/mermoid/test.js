require(__dirname + "/mermoid.bundled.js");

const fs = require("fs");

const outputFolder = __dirname + "/test/output";
const examplesFolder = __dirname + "/test/input";
const examplesFiles = fs.readdirSync(examplesFolder);

for(let index=0; index<examplesFiles.length; index++) {
  const exampleFile = examplesFiles[index];
  const testPath = examplesFolder + "/" + exampleFile;
  const testContents = fs.readFileSync(testPath).toString();
  const ast = MermoidParser.parse(testContents);
  fs.writeFileSync(outputFolder + "/" + exampleFile + ".json", JSON.stringify(ast, null, 2), "utf8");
}
const fs = require("fs");
const testFiles = fs.readdirSync(__dirname + "/tests/input");
require(__dirname + "/naty-script-parser.js");

for(let index=0; index<testFiles.length; index++) {
  const testFile = testFiles[index];
  const testContent = fs.readFileSync(`${__dirname}/tests/input/${testFile}`).toString();
  const output = NatyScriptParser.parse(testContent, {
    memory: {}
  });
  // console.log(JSON.stringify(output, null, 2));
  fs.writeFileSync(`${__dirname}/tests/output/${testFile}`, JSON.stringify(output, null, 2), "utf8");
}
const fs = require("fs");
const path = require("path");

const base = fs.readFileSync(__dirname + "/lsw-typer.parser.js").toString();

let output = base.replace(`module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};`, `return {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};`);

const header = `(function(factory) {
  const mod = factory();
  if(typeof window !== 'undefined') {
    window["LswTyperParser"] = mod;
  }
  if(typeof global !== 'undefined') {
    global["LswTyperParser"] = mod;
  }
  if(typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function() {\n`;

const footer = `\n});`

output = header + output + footer;

fs.writeFileSync(__dirname + "/lsw-typer.parser.js", output, "utf8");

let defaultTypesContent = "";
Compile_default_types: {
  const basepath = __dirname + "/default";
  const allFiles = fs.readdirSync(basepath, { recursive: true });
  for(let index=0; index<allFiles.length; index++) {
    const file = allFiles[index];
    const filepath = path.resolve(basepath, file);
    const isFile = fs.lstatSync(filepath).isFile();
    if(isFile) {
      console.log("Type found: " + filepath);
      defaultTypesContent += fs.readFileSync(filepath).toString() + "\n";
    }
  }
}

Compile_all_in_1: {
  const contentsParser = fs.readFileSync(__dirname + "/lsw-typer.parser.js").toString();
  const contentsApi = fs.readFileSync(__dirname + "/lsw-typer.api.js").toString();
  const allContents = [contentsParser, contentsApi, defaultTypesContent].join("\n\n");
  fs.writeFileSync(__dirname + "/lsw-typer.js", allContents, "utf8");
}
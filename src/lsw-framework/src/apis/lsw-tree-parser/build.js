const textTailRegex = /\}\)\(this\);[ \t\n\r]*$/g;
const inputContent = require("fs").readFileSync(__dirname + "/tripilang.parser.js").toString();
const outputContent = inputContent.replace(textTailRegex, "})(globalThis);");
require("fs").writeFileSync(__dirname + "/tripilang.parser.js", outputContent, "utf8");
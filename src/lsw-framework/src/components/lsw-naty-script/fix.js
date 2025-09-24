const fs = require("fs");

let contents = "";
contents += fs.readFileSync(__dirname + "/naty-script-parser.js").toString();
contents = contents.replace("\n})(this);", "\n})(typeof window === 'undefined' ? global : window);")
// @DONE: Comentado porque se mete en el builder del framework aparte:
// contents += fs.readFileSync(__dirname + "/naty-script.api.js").toString();
fs.writeFileSync(__dirname + "/naty-script-parser.js", contents, "utf8");

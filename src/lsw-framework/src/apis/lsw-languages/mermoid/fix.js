const fs = require("fs");

let contents = fs.readFileSync(__dirname + "/mermoid.js").toString();
contents = contents.replace("\n})(this);", "\n})(globalThis);")
contents += "\n" + fs.readFileSync(__dirname + "/mermoid.api.js").toString();
fs.writeFileSync(__dirname + "/mermoid.bundled.js", contents, "utf8");

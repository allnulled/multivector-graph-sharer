const fs = require("fs");

let contents = fs.readFileSync(__dirname + "/weeklang.js").toString();
contents = contents.replace("\n})(this);", "\n})(globalThis);")
contents += "\n" + fs.readFileSync(__dirname + "/weeklang.api.js").toString();
fs.writeFileSync(__dirname + "/weeklang.bundled.js", contents, "utf8");

const fs = require("fs");

let contents = fs.readFileSync(__dirname + "/lsw-timer.js").toString();
contents = contents.replace("\n})(this);", "\n})(typeof window === 'undefined' ? global : window);")
contents += "\n" + fs.readFileSync(__dirname + "/lsw-timer.api.js").toString();
fs.writeFileSync(__dirname + "/lsw-timer.bundled.js", contents, "utf8");

const fs = require("fs");

fs.writeFileSync(__dirname + "/devwatch.txt", (new Date()).toLocaleString(), "utf8");
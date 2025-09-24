const fs = require("fs");

let contents = "";
contents += fs.readFileSync(__dirname + "/lsw-sqlite.head.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/lsw-sqlite.basic-interface.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/lsw-sqlite.schema-builder-interface.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/lsw-sqlite.crud-interface.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/jqlite.head.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/jqlite.loader.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/jqlite.utils.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/jqlite.formatter.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/jqlite.prototype.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/jqlite.factory.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/jqlite.api.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/jqlite.appendix.js").toString() + "\n\n";
contents += fs.readFileSync(__dirname + "/lsw-sqlite.appendix.js").toString() + "\n\n";

fs.writeFileSync(__dirname + "/lsw-sqlite.dist.js", contents, "utf8");
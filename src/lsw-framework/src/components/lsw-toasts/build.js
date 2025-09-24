const fs = require("fs");

const template = fs.readFileSync(__dirname + "/lsw-toasts.html").toString();
const component = fs.readFileSync(__dirname + "/lsw-toasts.js").toString();
const compiledComponent = component.replace("$template", template);

fs.writeFileSync(__dirname + "/lsw-toasts.compiled.js", compiledComponent, "utf8");

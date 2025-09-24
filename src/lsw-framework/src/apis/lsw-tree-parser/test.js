const fs = require("fs");
require(__dirname + "/tripilang.parser.js");

const trees = fs.readdirSync(__dirname + "/tests/").map(file => fs.readFileSync(__dirname + "/tests/" + file).toString());

for(let index=0; index<trees.length; index++) {
  const tree = trees[index];
  console.log("Parseando: ", tree);
  const ast = TripilangParser.parse(tree);
  fs.writeFileSync(`${__dirname}/resultados/${index}.json`, JSON.stringify(ast, null, 2), "utf8");
}

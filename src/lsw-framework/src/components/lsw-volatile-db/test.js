const VolatileDB = require(__dirname + "/lsw-volatile-db.js");

(() => {

  const db = VolatileDB.create();

  db.createTable("usuarios");
  
  db.data.usuarios.insert({
    name: "Carlos0",
    surname: "Jimeno0 Hernández0"
  }, {
    name: "Carlos1",
    surname: "Jimeno1 Hernández1"
  }, {
    name: "Carlos2",
    surname: "Jimeno2 Hernández2"
  }, {
    name: "Random",
    surname: "Random Random"
  }, {
    name: "Carlos3",
    surname: "Jimeno3 Hernández3"
  }, {
    name: "Carlos4",
    surname: "Jimeno3 Hernández3",
    age: "eval://return 30 + 4",
    salute: "function://return `Hello, my name is ${this.name}!`",
    visit: "async-function://return `Hello, my name is ${this.name}!`",
  });

  const item1 = db.data.usuarios.selectById(1);
  const item2 = db.data.usuarios.selectById(2);
  const item3 = db.data.usuarios.selectById(3);
  const item4 = db.data.usuarios.selectById(4);
  const item5 = db.data.usuarios.selectById(5);
  const item6 = db.data.usuarios.selectById(6);
  const allCarlos = db.data.usuarios.select(it => it.name.startsWith("Carlos"));

  console.log([item1, item2, item3, item4, item5, item6]);
  console.log(allCarlos);
  console.log(item6);
  console.log(item6.salute());
  console.log(item6.visit());

  db.data.usuarios.update(item1.id, { name: "Carlos000" });

  console.log(db.data.usuarios.selectById(item1.id));

})();
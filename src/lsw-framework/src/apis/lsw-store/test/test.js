require(__dirname + "/../dist/store.js");
const Store = UniversalStore;
const store = new Store({ user: { name: "John", age: 30, hobbies: ["reading"] } });
const storepath = __dirname + "/db1.json";
store.hydrate(storepath);
const hobbies_watcher = function(event, path, state) {
  console.log("event:", event);
  console.log("path:", path);
  console.log("state:", state);
};
store.watch(["user", "hobbies"], hobbies_watcher);
store.push(["user", "hobbies"], "coding");
console.log(store.get(["user", "hobbies"]));
store.pop(["user", "hobbies"]);
console.log(store.get(["user", "hobbies"]));
store.add(["user"], "location", "USA");
console.log(store.get(["user"]));
store.remove(["user"], "location");
console.log(store.get(["user"]));
store.dehydrate(storepath);


const store2 = new Store({
  config: {
    toolkit1: {
      opt1: 500,
      opt2: 200,
    },
    toolkit2: {
      opt1: 500,
      opt2: 200,
    },
    toolkit3: {
      opt1: 500,
      opt2: 200,
    }
  }
});
store2.multiextend({
  selector: ["config"],
  mode: "default",
  value: {
    toolkit1: {},
    toolkit2: {},
    toolkit3: {},
    toolkit4: {},
    toolkit5: {},
  },
}, {
  selector: ["config", "toolkit1"],
  mode: "default",
  value: {
    opt1: 0,
    opt2: 0,
    opt3: 0,
    opt4: 0,
    opt5: 0,
  },
}, {
  selector: ["config", "toolkit2"],
  mode: "default",
  value: {
    opt1: 0,
    opt2: 0,
    opt3: 0,
    opt4: 0,
    opt5: 0,
  },
}, {
  selector: ["config", "toolkit3"],
  mode: "default",
  value: {
    opt1: 0,
    opt2: 0,
    opt3: 0,
    opt4: 0,
    opt5: 0,
  },
}, {
  selector: ["config", "toolkit4"],
  mode: "default",
  value: {
    opt1: 0,
    opt2: 0,
    opt3: 0,
    opt4: 0,
    opt5: 0,
  },
}, {
  selector: ["config", "toolkit5"],
  mode: "default",
  value: {
    opt1: 0,
    opt2: 0,
    opt3: 0,
    opt4: 0,
    opt5: 0,
  },
});
console.log(store2.get())

require(__dirname + "/async-circuit.js");

const _ = require(__dirname + "/functions.js");
const main = async function () {
  try {
    // Ejemplo de uso:
    const data = {};
    const setData = function(obj = {}) {
      Object.assign(data, obj);
    };
    const tree = {
      $type: 'parallel',
      $callbacks: [
        {
          $type: 'sync',
          $callbacks: [
            () => setData({ m1: 'Sync 1' }),
            () => setData({ m2: 'Sync 2' })
          ]
        },
        {
          $type: "race",
          $callbacks: [
            async () => {
              setData({ m3: 'Async 1' });
              return 'done 1';
            },
            async () => {
              setData({ m4: 'Async 2' });
              return 'done 2';
            }
          ]
        },
        {
          $type: 'serie',
          $callbacks: [
            async () => {
              setData({ m5: 'Serie 1' });
              return 'done 3';
            },
            async () => {
              setData({ m6: 'Serie 2' });
              return 'done 4';
            }
          ]
        },
      ]
    };
    const asyncCircuit = AsyncCircuit.create();
    asyncCircuit.hook(function(node) {
      console.log("Finished: ", node);
    });
    await asyncCircuit.execute(tree, { setData });
    console.log('Todo listo!');
    console.log(data);
    if(!("m1" in data)) {
      throw new Error("m1 not found");
    }
  } catch (error) {
    console.log(error);
  }
};

main();

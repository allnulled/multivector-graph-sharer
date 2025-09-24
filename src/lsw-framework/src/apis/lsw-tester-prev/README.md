# lsw-tester

Test like mocha with ensurer on browser or node.js.

Branch of [@allnulled/lsw-tester](https://github.com/allnulled/lsw-tester).

## Installation

```sh
npm i -s @allnulled/lsw-tester
```

## Importation

In node.js:

```js
require("@allnulled/lsw-tester");
```

In html:

```html
<script src="node_modules/@allnulled/lsw-tester/lsw-tester.js"></script>
```

## Features

- Support for convenient modes:
   - `normally`
   - `always`
   - `never`
   - `only`

## Usage

This is the test of the tester:

```js
const LswTester = require(__dirname + "/lsw-tester.js");

const main = async function () {

  const test1 = await LswTester.run("Test ID", function (it) {

    console.log(1);

    it("can load the API", async function () {
      console.log(2);
      await new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 1000 * 0.5);
      })
      throw 90;
    });

  });

  const test2 = await LswTester.run("MicrodataBank API Test", function (it) {
    it.timeout(5000);
    it.only("can access the API global variable 1", function () {});
    it.never("can access the API global variable 2", function () {});
    it.always("can access the API global variable 3", function () {});
    it.normally("can access the API global variable 4", function () {});
    it("can access the API global variable 5", function () {});
  });

  const test3 = await LswTester.run("MicrodataBank API Test", function (it) {
    it.timeout(1000); // Timeout for all tests
    it.normally("can set timeout different on specific test", async function(settings) {
      settings.timeout(3000);
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      })
    });
  });

  const report1 = test1.getReportAsJson();
  const report2 = test2.getReportAsJson();
  const report3 = test3.getReportAsJson();

  console.log(report1);
  console.log(report2);
  console.log(report3);

};

main();
```

## Real usecase

This is a real usecase using the tool integrated on the `lsw` project:

```js
(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswTests'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswTests'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {

  LswTestRegistry.define("lsw.first-test", function () {
    return LswTester.collection("Lsw First Test", function (test) {
      test("can wait 1 second", async function () {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      });
    });
  });

  LswTestRegistry.define("lsw.second-test", function () {
    return LswTester.collection("Lsw Second Test", function (test) {
      test("can wait 1 second", async function () {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      });
    });
  });

  LswTestRegistry.define("lsw.third-test", function () {
    return LswTester.collection("Lsw Third Test", async function (test) {
      test("can wait 1 second", async function () {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      });
    });
  });

  LswTestRegistry.define("lsw.fourth-test", function () {
    return LswTester.collection("Lsw Fourth Test", async function (test) {
      test("can wait 1 second", async function () {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      });
    });
  });

  LswTestRegistry.collect("Lsw Fifth Test", async function (test) {
    test("can wait 1 second", async function () {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    });
  });

  return LswTestRegistry;

});
```

Notice the different method used in the last call.

That should be the preferred way to define your tests.

Then you only have to:

```js
const currentReport = tester.getReport();
const currentReportJson = tester.getReportAsJson(true); // The 'true' arg is to compress the output
```

## Used with lsw

When used on the `lsw` project, you have more classes, as you saw:

```js
LswTester
LswTestRegistry === LswTests
```

## The class `LswTestRegistry` / `LswTests`

There we save the known test functions.

Once you have all your tests:

```js

```
# lsw-logger

Logger with some features: cross-env, leveling, deactivation, event emitter, before and after, centralization, custom ids, function stringification.

Branched from [@allnulled/lsw-logger](https://github.com/allnulled/lsw-logger).

## Installation

```sh
npm install @allnulled/lsw-logger
```

## Importation

In node.js:

```js
require("@allnulled/lsw-logger");
```

In html:

```html
<script src="node_modules/@allnulled/lsw-logger/superlogger.bundled.js"></script>
```

## Usage

```js
const logger1 = Superlogger.create("angular");
const logger2 = Superlogger.create("jquery");
const logger3 = Superlogger.create("moment.js");

logger1.trace("method.id", "From trace");
logger1.log("From log");
logger1.debug("From debug");
logger1.warn("From warn");
logger1.error("From error");

logger1.setBefore(console.log);
logger1.setAfter(console.log);
logger1.resetCallbacks();

logger1.setLevel("trace", console.log);
logger1.setLevel("debug", console.log);
logger1.setLevel("log", console.log);
logger1.setLevel("warn", console.log);
logger1.setLevel("error", console.log);
logger1.resetEvents();


```

## Test

Current state, that provides full coverage report, looks like:

```js
require(__dirname);

const loggers = {};

describe("Superlogger API Test", function (it) {

  it("can create instances", async function () {
    loggers.one = Superlogger.create("one");
    loggers.two = Superlogger.create("two");
    loggers.three = Superlogger.create("three");
    loggers.unnamed = Superlogger.create();
    const { one } = loggers;
    one.setLevel("log");
    one.trace("method", "ok");
    one.debug("ok");
    one.log("ok");
    one.warn("ok");
    one.error("ok");
    one.warn({ fn: () => 500 * 8 })
  });

  it("can activate and deactivate", async function () {
    const { one } = loggers;
    one.activate();
    one.log("this should be printed");
    one.deactivate();
    one.log("this should NOT be printed");
    one.activate();
    one.log("this should be printed");
  });

  it("can use trace with different method signature", async function () {
    const { one } = loggers;
    one.setLevel("trace");
    one.trace("method.id", { data: () => "whatever" });
  });

  it("can set and unset events", async function () {
    const { one } = loggers;
    const traces = [];
    one.setEvent("trace", () => traces.push("trace"));
    one.setEvent("debug", () => traces.push("debug"));
    one.setEvent("log", () => traces.push("log"));
    one.setEvent("warn", () => traces.push("warn"));
    one.setEvent("error", () => traces.push("error"));
    one.trace("method.id", { data: () => "whatever" });
    one.debug({ data: () => "debug" });
    one.warn({ data: () => "warn" });
    one.log({ data: () => "log" });
    one.error({ data: () => "error" });
    console.log(traces);
    const ensureState = it => {
      return Array.isArray(it) && it.length === 5 && it[0] === "trace";
    };
    ensure({ traces }).can(ensureState);
    one.resetEvents();
    one.trace("method.id", () => traces.push("trace2"));
    ensure({ traces }).can(ensureState);
  });

  it("can set and unset callbacks", async function () {
    const { one } = loggers;
    let counter = 0;
    one.setBefore(() => { counter += 100; });
    one.setAfter(() => { counter += 1; });
    one.log("hi!");
    one.log("hi!");
    one.log("hi!");
    ensure({ counter }).is(303);
    one.log("hi!");
    ensure({ counter }).is(404);
    one.resetCallbacks();
    one.log("hi!");
    ensure({ counter }).is(404);
  });

  it("can set and get source", async function () {
    const { one } = loggers;
    const source = 500;
    one.setSource(source);
    one.setEvent("trace", undefined);
    ensure({ source: one.source }).is(500);
  });

  Error_handlers: {

    it("can fill error in coverage report", async function () {
      const { one } = loggers;
      ensure({ Superlogger }).throws(it => it.create(500)); // id must be a string!
      ensure({ Superlogger }).throws(it => { it.create("dupl"); it.create("dupl"); }); // cant create duplicated ids!
      ensure({ Superlogger }).throws(it => { it.create("whatever", 500); }); // options must be an object!
      ensure({ one }).throws(it => it.setLevel("myown")); // level must exist!
      ensure({ one }).throws(it => it.$log("unknownLevel")); // level must exist!
      ensure({ one }).throws(it => it.$emit("unknownLevel")); // level must exist!
      const obj1 = {};
      obj1.o1 = obj1;
      const recursiveObject = { o: obj1 };
      ensure({ one }).doesntThrow(it => it.log(recursiveObject));
    });

    it("can fill rare cases in coverage report", async function () {
      const { one } = loggers;
      ensure({ one }).doesntThrow(it => it.log({ o: null }));
      ensure({ randomString: Superlogger.generateRandomString() }).can(it => it.length === 5);
    });

  }

  it("can run usage example", async function () {
    const logger1 = Superlogger.create("angular");
    const logger2 = Superlogger.create("jquery");
    const logger3 = Superlogger.create("moment.js");

    logger1.trace("method.id", "From trace");
    logger1.log("From log");
    logger1.debug("From debug");
    logger1.warn("From warn");
    logger1.error("From error");

    logger1.setBefore(console.log);
    logger1.setAfter(console.log);
    logger1.resetCallbacks();

    logger1.setLevel("trace", console.log);
    logger1.setLevel("debug", console.log);
    logger1.setLevel("log", console.log);
    logger1.setLevel("warn", console.log);
    logger1.setLevel("error", console.log);
    logger1.resetEvents();
  });

});
```
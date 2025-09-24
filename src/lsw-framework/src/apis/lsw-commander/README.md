# lsw-commander

Use URLs and Objects to call functions.

Branched from [@allnulled/url-command](https://github.com/allnulled/url-command).

## Install

```sh
npm i -s @allnulled/lsw-commander
```

## Import

In node.js:

```js
require("@allnulled/lsw-commander");
```

In html:

```html
<script src="node_modules/@allnulled/lsw-commander/lsw-commander.js"></script>
```

## API

**1. Create an instance**

Use `URLCommand.from(object)` to create an instance.

**2. Run commands**

Then use `urlcommand.run(text)` to run commands by URL.

It will call the function passing 1 object only, containing the parameters provided on `run`.

**3. Run functions**

Functions can have their own use cases of their own parameters, and this is about JavaScript. 

You have 2 options.

**Option 1: numerical properties**

If you only pass numbers from 0 to whatever as keys, like `?0=hello&1=world&2=!`, it will call `fn("hello", "world", "!")` instead of `f({ 0:"hello", 1:"world", 2: "!" })`.

**Option 2: specify argumentsOrder property**

You can also use the parameter `?...&argumentsOrder=a,b,c,d` to call functions using all the parameters allowed by JavaScript.

It will call the function spreading the specified properties in the specified order.

**4. Pass data too**

Apart from the querystring parameters, you can pass data, like objects and functions and whatever (no strings, I mean), with a second parameter on the `run` method.

```js
urlcommand.run("/path/to/somewhere?", {
  "0": "hello",
  "1": "world",
  "2": "!"
});
```

**5. Configurable callback for before and after a command**

```js
urlcommand.beforeRun(console.log);
urlcommand.afterRun(console.log);
```

**6. Configurable callback for command errors**

This example makes that, on errors, the command returns 501 instead of propagating the error (default behaviour).

```js
urlcommand.onError(() => 501);
```

## Usage

```js
const object = {
    command: {
        hello({ name }): () => console.log("hello, " + name)
    }
};
URLCommand.from(object).run("/command/hello?name=world");
```

## Test

```js
require(__dirname + "/lsw-commander.js")

describe("URLCommand API Test", function (it) {
  it.onError(console.log);
  // Ejemplo de uso
  const handlers = {
    sum: ({ a, b }) => parseFloat(a) + parseFloat(b),
    maths: {
      multiply: ({ a, b }) => parseFloat(a) * parseFloat(b),
      sumatory: (...args) => {
        let out = 0;
        for(let index=0; index<args.length; index++) {
          const arg = args[index];
          out += parseFloat(arg);
        }
        return out;
      }
    },
    commands: {
      hello: (urlParams) => {
        const { name } = urlParams;
        const msg = "hello, " + name;
        return msg;
      },
      message(emitter, receiver, contents) {
        const msg = `${emitter} says to ${receiver}: "${contents}"`;
        return msg;
      },
      bye: (name) => {
        const msg = "bye, " + name;
        return msg;
      },
      fail: (urlParams) => {
        throw new Error(urlParams.error || "Error message not specified");
      }
    }
  };

  const urls = [
    // Hello world: 
    ["/commands/hello?name=world", "hello, world"],
    // Unique object parameter function call: 
    ["/sum?a=10&b=2", 12],
    // Unique object parameter function call + Nestable path: 
    ["/maths/multiply?a=10&b=2", 20],
    // Spread function call (explicit): 
    ["/maths/sumatory?a=40&b=7&c=2&d=1&argumentsOrder=a,b,c,d", 50],
    // Spread function call (explicit): 
    ["/commands/message?a=origin&b=destination&c=This is a request&argumentsOrder=a,b,c", 'origin says to destination: "This is a request"'],
    // Spread function call (explicit) + real data (no strings-only): 
    ["/commands/bye?argumentsOrder=a", 'bye, Emily', { a: "Emily" }],
    // Spread function call (implicit): must have numbers, from 0 untill the last parameter, and nothing else, and it will spread the parameters.
    ["/maths/sumatory?0=0&1=100&2=200&3=300", 600],
    // Spread function call (implicit): must have numbers, from 0 untill the last parameter, and nothing else, and it will spread the parameters.
    ["/commands/fail?error=It is okay, it have to return -315.36", -315.36],
  ];

  let counterBef = 0;
  let counterAft = 0;
  const increaseBef = () => counterBef++;
  const increaseAft = () => counterAft++;
  for (let index = 0; index < urls.length; index++) {
    const [url, result, args = {}] = urls[index];
    it("Can run: " + url, async function () {
      const urlcommand = URLCommand.from(handlers);
      urlcommand.beforeRun(increaseBef);
      urlcommand.afterRun(increaseAft);
      urlcommand.onError(() => -315.36);
      const output = urlcommand.run(url, args);
      console.log("      output:", output);
      ensure({ output }).is(result);
      // El OR es para el caso en que falla, que no llama al afterRun sino al onError:
      ensure({ comparison: counterBef === counterAft || (counterBef - 1) === counterAft }).is(true);
      ensure({ counterBef }).isnt(0);
    });
  }
});
```
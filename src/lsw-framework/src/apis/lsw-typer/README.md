# lsw-typer

JSON typer tool for LSW.

Branch of: [@allnulled/jsontyped](https://github.com/allnulled/jsontyped).

## Installation

```sh
npm i -s @allnulled/lsw-typer
```

## Importation

In node.js:

```js
require("@allnulled/lsw-typer");
```

In html:

```html
<script src="node_modules/@allnulled/lsw-typer/lsw-typer.js"></script>
```

## Usage

```js
LswTyper.parse(`"This could be a normal JSON"`);
LswTyper.parse(`@message "This is another level of JSON"`);
LswTyper.parse(`@deeper.types "This is a valid way of chaining ref types"`);
LswTyper.parse(`@deeper/types/somewhere/else.js "This is also a valid way of chaining ref types"`);
LswTyper.parse(`@file:///you/can/specify/protocol/too "This is also a valid way of chaining ref types"`);
LswTyper.parse(`@http:///you/can/specify/protocol/too "This is also a valid way of chaining ref types"`);
```

Basically, any type supports this "prefix" in which you specify, with these symbols and normal variable-accepted js symbols [A-Za-z_$] +[0-9].

Then it always translate the types to:

```json
{
  $protocol: null,
  $type: "message",
  $value: "This is another level of JSON"
}
```

Which is also quite readable. You can customize the output re-building the parser, by `npm run build`.

## Changelog

**22 of January of 2025.**

  - Accepts URLs with protocol, host, path, querystring and section automatically parsed.
  - Accepts also JavaScript object paths separated by "`.`".